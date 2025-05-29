import { predictiveDriver } from './driver';
import { buildSyntaxTree, printSyntaxTree } from './tree';
import {PredictiveTable, Production, Terminal} from './types';

// 更健壮的预测分析表（支持更多运算符）
const table: PredictiveTable = new Map([
    ['E', new Map([
        ['id', { left: 'E', right: ['T', "E'"] }],
        ['(', { left: 'E', right: ['T', "E'"] }],
        ['num', { left: 'E', right: ['T', "E'"] }],
    ])],
    ["E'", new Map([
        ['+', { left: "E'", right: ['+', 'T', "E'"] }],
        ['-', { left: "E'", right: ['-', 'T', "E'"] }],
        [')', { left: "E'", right: ['ε'] }],
        ['$', { left: "E'", right: ['ε'] }],
    ])],
    ['T', new Map([
        ['id', { left: 'T', right: ['F', "T'"] }],
        ['(', { left: 'T', right: ['F', "T'"] }],
        ['num', { left: 'T', right: ['F', "T'"] }],
    ])],
    ["T'", new Map([
        ['+', { left: "T'", right: ['ε'] }],
        ['-', { left: "T'", right: ['ε'] }],
        ['*', { left: "T'", right: ['*', 'F', "T'"] }],
        ['/', { left: "T'", right: ['/', 'F', "T'"] }],
        [')', { left: "T'", right: ['ε'] }],
        ['$', { left: "T'", right: ['ε'] }],
    ])],
    ['F', new Map([
        ['id', { left: 'F', right: ['id'] }],
        ['num', { left: 'F', right: ['num'] }],
        ['(', { left: 'F', right: ['(', 'E', ')'] }],
    ])],
]);

// 测试用例：复杂表达式
const testCases = [
    {
        name: "简单表达式",
        tokens: ['id', '+', 'id', '*', 'id'] as Terminal[]
    },
    {
        name: "带括号表达式",
        tokens: ['(', 'id', '+', 'id', ')', '*', 'num'] as Terminal[]
    },
    {
        name: "混合运算",
        tokens: ['id', '*', '(', 'num', '-', 'id', '/', 'num', ')'] as Terminal[]
    }
];

// 运行所有测试用例
for (const testCase of testCases) {
    console.log(`\n===== 测试: ${testCase.name} =====`);
    console.log(`输入: ${testCase.tokens.join(' ')}`);

    try {
        // 运行驱动器算法
        const configs = predictiveDriver('E', table, testCase.tokens);

        // 输出格局转换过程
        console.log('\n格局转换过程:');
        console.log('步骤 | 分析栈 | 剩余输入 | 动作');
        console.log('----|-------|---------|------');

        configs.forEach(cfg => {
            const stackStr = cfg.stack.join(' ');
            const inputStr = cfg.input.join(' ');
            const action = cfg.production
                ? `应用 ${cfg.production.left} → ${cfg.production.right.join(' ')}`
                : '匹配终结符';

            console.log(`${cfg.step.toString().padEnd(4)} | ${stackStr.padEnd(15)} | ${inputStr.padEnd(15)} | ${action}`);
        });

        // 构建语法树
        const tree = buildSyntaxTree(configs);

        // 输出语法树
        console.log('\n语法树:');
        console.log(printSyntaxTree(tree));

    } catch (e) {
        console.error(`错误: ${e.message}`);
    }
}
