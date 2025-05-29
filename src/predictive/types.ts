export type Symbol = string; // 文法符号
export type Terminal = string; // 终结符
export type NonTerminal = string; // 非终结符

// 产生式：A → α
export interface Production {
    left: NonTerminal; // 左部非终结符
    right: Symbol[]; // 右部符号串（含ε表示空）
}

// 预测分析表：M[非终结符][终结符] = 产生式 或 错误
export type PredictiveTable = Map<NonTerminal, Map<Terminal, Production | 'error'>>;

// 分析格局（栈 + 输入 + 当前步骤信息）
export interface Configuration {
    step: number; // 步骤序号
    stack: Symbol[]; // 分析栈（栈顶在数组末尾）
    input: Terminal[]; // 剩余输入（当前记号在数组头部）
    production?: Production; // 当前步骤使用的产生式（可选）
}

// 语法树节点
export interface SyntaxTreeNode {
    symbol: Symbol; // 节点对应符号
    children: SyntaxTreeNode[]; // 子节点（产生式右部符号）
    value?: string; // 可选：终结符的值（用于显示）
}
