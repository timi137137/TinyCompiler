// 每个节点的类型
export enum NodeTypes {
    Program = 'Program', // 根节点
    NumberLiteral = 'NumberLiteral', // 数字
    CallExpression = 'CallExpression', // 函数
    ExpressionStatement = 'ExpressionStatement', // 表达式
    Identifier = 'Identifier', // 标识符
}
// AST语法树子节点
export type ChildNode = NumberLiteralNode | CallExpressionNode

// 抽象类 - 节点
export interface Node {
    type: NodeTypes
}

// 根节点
export interface RootNode extends Node {
    type: NodeTypes.Program
    body: ChildNode[]
    context?: ChildNode[]
}

// 数字节点
export interface NumberLiteralNode extends Node {
    type: NodeTypes.NumberLiteral
    value: string
}

// 函数节点
export interface CallExpressionNode extends Node {
    type: NodeTypes.CallExpression
    name: string
    params: ChildNode[]
    context?: ChildNode[]
}

// 记号的类型
export enum TokenTypes {
    Paren,
    Name,
    NumberLiteral,
}
// 记号
export interface Token {
    type: TokenTypes
    value: string
}

//父节点
export type ParentNode = RootNode | CallExpressionNode | undefined

// 方法
type MethodFn = (node: RootNode | ChildNode, parent: ParentNode) => void

// 访问者模式
export interface VisitorOption {
    enter: MethodFn
    exit?: MethodFn
}
export interface Visitor {
    Program?: VisitorOption
    CallExpression?: VisitorOption
    NumberLiteral?: VisitorOption
    StringLiteral?: VisitorOption
}
