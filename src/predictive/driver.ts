import { PredictiveTable, Production, Configuration, Terminal, NonTerminal, Symbol } from './types';

/**
 * 预测分析驱动器算法（算法3.4）
 * @param start 文法开始符号
 * @param table 预测分析表
 * @param tokens 输入记号流
 * @returns 格局转换过程数组
 */
export function predictiveDriver(
    start: NonTerminal,
    table: PredictiveTable,
    tokens: Terminal[]
): Configuration[] {
    const configs: Configuration[] = [];
    let step = 0;

    // 初始化：栈底为$，栈顶为开始符号；输入末尾添加$
    const stack: Symbol[] = ['$', start];
    const input: Terminal[] = [...tokens, '$'];
    let pos = 0; // 输入指针

    // 记录初始格局
    configs.push({
        step: step++,
        stack: [...stack],
        input: input.slice(pos),
    });

    while (stack.length > 0) {
        const top = stack[stack.length - 1]; // 栈顶符号
        const currentToken = input[pos]; // 当前输入记号

        // 终止条件：栈顶为$且输入处理完毕
        if (top === '$' && currentToken === '$') break;

        if (isTerminal(top)) {
            // 栈顶是终结符，直接匹配
            if (top === currentToken) {
                // 匹配成功，弹出栈顶，输入指针后移
                stack.pop();
                pos++;
                configs.push({
                    step: step++,
                    stack: [...stack],
                    input: input.slice(pos),
                });
            } else {
                throw new Error(`语法错误：位置${pos}，期望 ${top}，但得到 ${currentToken}`);
            }
        } else {
            // 栈顶是非终结符
            const row = table.get(top as NonTerminal);
            if (!row) throw new Error(`分析表错误：无 ${top} 的行`);

            const prod = row.get(currentToken) ?? 'error';
            if (prod === 'error') {
                throw new Error(`语法错误：位置${pos}，${top} 在 ${currentToken} 上无产生式`);
            }

            // 应用产生式：弹出非终结符，压入右部（逆序压栈）
            stack.pop();
            const right = prod.right;
            if (right[0] !== 'ε') { // 处理空产生式（ε不压栈）
                for (let i = right.length - 1; i >= 0; i--) {
                    stack.push(right[i]);
                }
            }

            // 记录格局
            configs.push({
                step: step++,
                stack: [...stack],
                input: input.slice(pos),
                production: prod,
            });
        }
    }

    return configs;
}

// 判断是否是终结符
export function isTerminal(symbol: Symbol): boolean {
    if (symbol.length === 0) return false;
    const firstChar = symbol[0];

    // 终结符条件：
    // 1. 非大写字母开头
    // 2. 特殊符号（运算符、括号等）
    return !(firstChar >= 'A' && firstChar <= 'Z');
}
