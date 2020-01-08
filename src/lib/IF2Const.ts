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

function createChildren(
  members: ts.NodeArray<ts.TypeElement>,
  prefix: string
): Array<ts.ObjectLiteralElementLike> {
  const result: Array<ts.ObjectLiteralElementLike> = [];
  members.forEach(member => {
    if (member.kind !== ts.SyntaxKind.PropertySignature) return;
    const propSig = member as ts.PropertySignature;
    // value
    if (!propSig.type) return;
    const typenode = propSig.type;
    if (typenode.kind === ts.SyntaxKind.StringKeyword) {
      const node = createStringProperty(propSig.name, prefix);
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
