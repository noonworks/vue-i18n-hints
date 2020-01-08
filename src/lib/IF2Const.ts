import * as ts from 'typescript';

function identifer2String(name: ts.PropertyName): string {
  if (ts.isIdentifier(name)) return name.text;
  // does not support other than identifer
  return '';
}

function createStringProperty(
  identifer: ts.PropertyName,
  name: string,
  prefix: string
): ts.PropertyAssignment {
  const propVal = ts.createStringLiteral(prefix + name);
  return ts.createPropertyAssignment(identifer, propVal);
}

function createNestedProperty(
  members: ts.NodeArray<ts.TypeElement>,
  identifer: ts.PropertyName,
  name: string,
  prefix: string
): ts.PropertyAssignment {
  return ts.createPropertyAssignment(
    identifer,
    ts.createObjectLiteral(
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      createChildren(members, prefix + name + '.'),
      true
    )
  );
}

function createStringArrayProperty(
  length: number,
  identifer: ts.PropertyName,
  name: string,
  prefix: string
): ts.PropertyAssignment {
  const nodes: ts.Expression[] = [];
  for (let i = 0; i < length; i++) {
    nodes.push(ts.createStringLiteral(prefix + name + '[' + i + ']'));
  }
  const arrLt = ts.createArrayLiteral(nodes, true);
  return ts.createPropertyAssignment(identifer, arrLt);
}

function createChildren(
  members: ts.NodeArray<ts.TypeElement>,
  prefix: string
): Array<ts.ObjectLiteralElementLike> {
  const result: Array<ts.ObjectLiteralElementLike> = [];
  const lengthInfo: { [key: string]: number } = {};
  members.forEach(member => {
    if (member.kind !== ts.SyntaxKind.PropertySignature) return;
    if (!ts.isPropertySignature(member)) return;
    if (!member.type) return;
    // get name as string
    const name = identifer2String(member.name);
    if (!name) return;
    // string
    if (member.type.kind === ts.SyntaxKind.StringKeyword) {
      result.push(createStringProperty(member.name, name, prefix));
      return;
    }
    // nested type literal
    if (ts.isTypeLiteralNode(member.type)) {
      result.push(
        createNestedProperty(member.type.members, member.name, name, prefix)
      );
      return;
    }
    // literal
    if (ts.isLiteralTypeNode(member.type)) {
      if (ts.isNumericLiteral(member.type.literal)) {
        // numeric literal
        const val = parseInt(member.type.literal.text);
        if (!isNaN(val)) lengthInfo[prefix + name] = val;
      }
      return;
    }
    // array ([])
    if (ts.isArrayTypeNode(member.type)) {
      // get length
      const len = lengthInfo[name + 'Length'];
      if (typeof len === 'undefined' || len <= 0) return;
      // string array
      if (member.type.elementType.kind === ts.SyntaxKind.StringKeyword) {
        result.push(createStringArrayProperty(len, member.name, name, prefix));
        return;
      }
      return;
    }
    // type reference (Array<T>)
    if (ts.isTypeReferenceNode(member.type)) {
      const tname = member.type.typeName;
      if (!ts.isIdentifier(tname) || tname.escapedText !== 'Array') return;
      const tArgs = member.type.typeArguments;
      if (!tArgs) return;
      // get length
      const len = lengthInfo[name + 'Length'];
      if (typeof len === 'undefined' || len <= 0) return;
      // Array<string>
      if (tArgs.length === 1 && tArgs[0].kind === ts.SyntaxKind.StringKeyword) {
        result.push(createStringArrayProperty(len, member.name, name, prefix));
        return;
      }
      return;
    }
  });
  return result;
}

export function IF2Const<T extends ts.Node>(
  context: ts.TransformationContext
): ts.Transformer<T> {
  const InterfaceVisitor: ts.Visitor = (node: ts.Node): ts.Node | undefined => {
    node = ts.visitEachChild(node, InterfaceVisitor, context);
    if (!ts.isInterfaceDeclaration(node)) return node;

    const ifDecl: ts.InterfaceDeclaration = node;

    // new Identifer
    const newName = ts.createIdentifier(ifDecl.name.escapedText + 'Hints');
    ifDecl.name = newName;
    // new const variable
    const varDecl = ts.createVariableDeclaration(ifDecl.name);
    const declList = ts.createVariableDeclarationList(
      [varDecl],
      ts.NodeFlags.Const
    );
    const newNode = ts.createVariableStatement(
      [ts.createModifier(ts.SyntaxKind.ExportKeyword)],
      declList
    );

    // add members to new const variable
    const props: Array<ts.ObjectLiteralElementLike> = createChildren(
      ifDecl.members,
      ''
    );

    // return newNode;
    const propsNodes = ts.createNodeArray<ts.ObjectLiteralElementLike>(props);
    const objLtr = ts.createObjectLiteral(propsNodes, true);
    varDecl.initializer = objLtr;
    return newNode;
  };
  return (rootNode: T): T => ts.visitNode(rootNode, InterfaceVisitor);
}
