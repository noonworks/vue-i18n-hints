import * as ts from 'typescript';

function identifer2String(name: ts.PropertyName): string {
  if (name.kind === ts.SyntaxKind.Identifier) {
    return name.text;
  }
  // does not support other than identifer
  return '';
}

function createStringProperty(
  name: ts.PropertyName,
  prefix: string
): ts.PropertyAssignment | null {
  const id = identifer2String(name);
  if (!id) return null;
  const propVal = ts.createStringLiteral(prefix + id);
  return ts.createPropertyAssignment(name, propVal);
}

function createNestedProperty(
  propSig: ts.PropertySignature,
  prefix: string
): ts.PropertyAssignment | null {
  const name = identifer2String(propSig.name);
  if (!name) return null;
  const tl = propSig.type as ts.TypeLiteralNode;
  // eslint-disable-next-line @typescript-eslint/no-use-before-define
  const children = createChildren(tl.members, prefix + name + '.');
  const objLtr = ts.createObjectLiteral(children, true);
  return ts.createPropertyAssignment(name, objLtr);
}

function createChildren(
  members: ts.NodeArray<ts.TypeElement>,
  prefix: string
): Array<ts.ObjectLiteralElementLike> {
  const result: Array<ts.ObjectLiteralElementLike> = [];
  members.forEach(member => {
    if (member.kind !== ts.SyntaxKind.PropertySignature) return;
    const propSig = member as ts.PropertySignature;
    if (!propSig.type) return;
    // string
    if (propSig.type.kind === ts.SyntaxKind.StringKeyword) {
      const node = createStringProperty(propSig.name, prefix);
      if (node) result.push(node);
    }
    // nested type literal
    if (propSig.type.kind === ts.SyntaxKind.TypeLiteral) {
      const node = createNestedProperty(propSig, prefix);
      if (node) result.push(node);
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
