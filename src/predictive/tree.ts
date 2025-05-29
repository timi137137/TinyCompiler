import { Configuration, SyntaxTreeNode } from './types';


/**
 * 根据格局转换过程构建语法树
 * @param configs 格局转换数组
 * @returns 语法树根节点
 */
export function buildSyntaxTree(configs: Configuration[]): SyntaxTreeNode {
    // 节点栈：存储待展开的非终结符节点
    const nodeStack: SyntaxTreeNode[] = [];
    const rootSymbol = configs[0].stack[1]; // 初始栈顶为开始符号
    const root: SyntaxTreeNode = { symbol: rootSymbol, children: [] };
    nodeStack.push(root);

    // 从第一步操作开始处理
    for (let i = 1; i < configs.length; i++) {
        const config = configs[i];
        const prevConfig = configs[i - 1];

        if (config.production) {
            // 应用产生式：弹出父节点，添加子节点
            const parent = nodeStack.pop()!;
            const production = config.production;

            // 为产生式右部创建子节点
            const children: SyntaxTreeNode[] = [];
            for (const symbol of production.right) {
                if (symbol === 'ε') continue; // 跳过空产生式

                const child: SyntaxTreeNode = {
                    symbol,
                    children: []
                };
                children.push(child);

                // 所有节点都入栈（包括终结符）
                nodeStack.push(child);
            }

            // 设置父节点的子节点（保持右部顺序）
            parent.children = children;
        } else {
            // 匹配终结符：弹出栈顶节点，设置值
            const leaf = nodeStack.pop()!;
            // 被匹配的终结符是前一个格局剩余输入的第一个符号
            leaf.value = prevConfig.input[0];
        }
    }

    return root;
}

/**
 * 格式化输出语法树
 */
export function printSyntaxTree(node: SyntaxTreeNode, depth = 0): string {
    const indent = '  '.repeat(depth);
    let output = `${indent}${node.symbol}`;

    if (node.value) {
        output += ` (${node.value})`;
    }

    if (node.children.length > 0) {
        output += ` → [${node.children.map(c => c.symbol).join(' ')}]`;
    }

    for (const child of node.children) {
        output += '\n' + printSyntaxTree(child, depth + 1);
    }

    return output;
}
