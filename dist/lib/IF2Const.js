"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ts = require("typescript");
function identifer2String(name) {
    if (ts.isIdentifier(name))
        return name.text;
    // does not support other than identifer
    return '';
}
function createString(identifer, name, prefix) {
    const propVal = ts.createStringLiteral(prefix + name);
    return ts.createPropertyAssignment(identifer, propVal);
}
function createNested(members, identifer, name, prefix) {
    return ts.createPropertyAssignment(identifer, ts.createObjectLiteral(
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    createChildren(members, prefix + name + '.'), true));
}
function createStringArray(length, identifer, name, prefix) {
    const nodes = [];
    for (let i = 0; i < length; i++) {
        nodes.push(ts.createStringLiteral(prefix + name + '[' + i + ']'));
    }
    const arrLt = ts.createArrayLiteral(nodes, true);
    return ts.createPropertyAssignment(identifer, arrLt);
}
function createTypeLiteralArray(typeLtr, length, identifer, name, prefix) {
    const nodes = [];
    for (let i = 0; i < length; i++) {
        const curPrefix = prefix + name + '[' + i + '].';
        nodes.push(
        // eslint-disable-next-line @typescript-eslint/no-use-before-define
        ts.createObjectLiteral(createChildren(typeLtr.members, curPrefix), true));
    }
    const arrLt = ts.createArrayLiteral(nodes, true);
    return ts.createPropertyAssignment(identifer, arrLt);
}
function createChildren(members, prefix) {
    const result = [];
    const lengthInfo = {};
    members.forEach(member => {
        if (member.kind !== ts.SyntaxKind.PropertySignature)
            return;
        if (!ts.isPropertySignature(member))
            return;
        if (!member.type)
            return;
        // get name as string
        const name = identifer2String(member.name);
        if (!name)
            return;
        // string
        if (member.type.kind === ts.SyntaxKind.StringKeyword) {
            result.push(createString(member.name, name, prefix));
            return;
        }
        // nested type literal
        if (ts.isTypeLiteralNode(member.type)) {
            result.push(createNested(member.type.members, member.name, name, prefix));
            return;
        }
        // literal
        if (ts.isLiteralTypeNode(member.type)) {
            if (ts.isNumericLiteral(member.type.literal)) {
                // numeric literal
                const val = parseInt(member.type.literal.text);
                if (!isNaN(val))
                    lengthInfo[prefix + name] = val;
            }
            return;
        }
        // array ([])
        if (ts.isArrayTypeNode(member.type)) {
            // get length
            const len = lengthInfo[name + 'Length'];
            if (typeof len === 'undefined' || len <= 0)
                return;
            const elmType = member.type.elementType;
            // string array
            if (elmType.kind === ts.SyntaxKind.StringKeyword) {
                result.push(createStringArray(len, member.name, name, prefix));
                return;
            }
            // type literal array
            if (ts.isTypeLiteralNode(elmType)) {
                result.push(createTypeLiteralArray(elmType, len, member.name, name, prefix));
                return;
            }
        }
        // type reference (Array<T>)
        if (ts.isTypeReferenceNode(member.type)) {
            const tname = member.type.typeName;
            if (!ts.isIdentifier(tname) || tname.escapedText !== 'Array')
                return;
            if (!member.type.typeArguments || member.type.typeArguments.length != 1)
                return;
            const tArg = member.type.typeArguments[0];
            // get length
            const len = lengthInfo[name + 'Length'];
            if (typeof len === 'undefined' || len <= 0)
                return;
            // Array<string>
            if (tArg.kind === ts.SyntaxKind.StringKeyword) {
                result.push(createStringArray(len, member.name, name, prefix));
                return;
            }
            // Array<{}>
            if (ts.isTypeLiteralNode(tArg)) {
                result.push(createTypeLiteralArray(tArg, len, member.name, name, prefix));
                return;
            }
        }
    });
    return result;
}
function createConst(ifDecl) {
    // new Identifer
    const newName = ts.createIdentifier(ifDecl.name.escapedText + 'Hints');
    // object literal
    const objLtr = ts.createObjectLiteral(ts.createNodeArray(createChildren(ifDecl.members, '')), true);
    // new node
    const newNode = ts.createVariableStatement([ts.createModifier(ts.SyntaxKind.ExportKeyword)], ts.createVariableDeclarationList([
        ts.createVariableDeclaration(newName, ts.createTypeReferenceNode(ifDecl.name, undefined), objLtr)
    ], ts.NodeFlags.Const));
    return newNode;
}
function createImportNode(path, names) {
    return ts.createImportDeclaration(undefined, undefined, ts.createImportClause(undefined, ts.createNamedImports(names.map(n => ts.createImportSpecifier(undefined, ts.createIdentifier(n))))), ts.createStringLiteral(path));
}
function IF2ConstFactory(filepath) {
    function IF2Const(context) {
        const interfaces = [];
        const visit = (node) => {
            node = ts.visitEachChild(node, visit, context);
            if (!ts.isInterfaceDeclaration(node))
                return node;
            interfaces.push(node.name.text);
            return createConst(node);
        };
        return (rootNode) => {
            const visited = ts.visitNode(rootNode, visit);
            if (ts.isSourceFile(visited)) {
                const impt = createImportNode(filepath, interfaces);
                visited.statements = ts.createNodeArray([impt, ...visited.statements]);
            }
            return visited;
        };
    }
    return IF2Const;
}
exports.IF2ConstFactory = IF2ConstFactory;
