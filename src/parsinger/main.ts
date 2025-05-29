import { readFileSync } from 'fs';

// 类型定义
interface Token {
    type: string;
    value: string;
}

// DFA状态定义
interface DFAState {
    transitions: Record<string, number>;
    accept?: string;
}

// 词法分析器配置
interface LexerConfig {
    dfa: DFAState[];
    charTypes: Record<string, string>;
    keywords?: string[];
}

// 词法分析器类
class DynamicLexer {
    private dfa: DFAState[];
    private readonly charTypeRules: Record<string, RegExp>;
    private readonly keywords: string[];

    constructor(config: LexerConfig) {
        this.dfa = config.dfa;
        this.charTypeRules = this.compileCharTypeRules(config.charTypes);
        this.keywords = config.keywords || [];
    }

    // 编译传入的正则式
    private compileCharTypeRules(rules: Record<string, string>): Record<string, RegExp> {
        const compiled: Record<string, RegExp> = {};
        for (const [type, pattern] of Object.entries(rules)) {
            try {
                compiled[type] = new RegExp(`^${pattern}$`);
            } catch (e) {
                throw new Error(`Invalid regex pattern for '${type}': '${pattern}'. Error: ${e.message}`);
            }
        }
        return compiled;
    }

    // 获取字符类型
    private getCharType(c: string): string {
        for (const [type, pattern] of Object.entries(this.charTypeRules)) {
            if (pattern.test(c)) return type;
        }
        return 'other';
    }

    // 词法分析
    tokenize(input: string): Token[] {
        let pos = 0;
        const tokens: Token[] = [];
        const length = input.length;

        // DFA状态机
        while (pos < length) {
            let currentState = 0;
            let startPos = pos;
            let lastAcceptPos = -1;
            let lastAcceptToken: string | null = null;

            // 状态转换
            while (pos < length) {
                const c = input[pos];
                const charType = this.getCharType(c);
                const nextState = this.dfa[currentState].transitions[charType];

                if (typeof nextState === 'undefined') break;

                currentState = nextState;
                pos++;

                if (this.dfa[currentState].accept) {
                    lastAcceptPos = pos;
                    lastAcceptToken = this.dfa[currentState].accept!;
                }
            }

            // 如果没有终态抛出错误
            if (lastAcceptToken) {
                const token: Token = {
                    type: lastAcceptToken,
                    value: input.substring(startPos, lastAcceptPos)
                };

                if (token.type === 'identifier' && this.keywords.includes(token.value)) {
                    token.type = 'keyword';
                }

                tokens.push(token);
                pos = lastAcceptPos;
            } else {
                throw new Error(`Lexical error at position ${pos}: unexpected character '${input[pos]}'`);
            }
        }

        return tokens;
    }
}

// 文件加载工具
function loadConfig(filePath: string): LexerConfig {
    try {
        const content = readFileSync(filePath, 'utf-8');
        return JSON.parse(content);
    } catch (e) {
        throw new Error(`Config load failed: ${e.message}`);
    }
}

function loadInput(filePath: string): string {
    try {
        return readFileSync(filePath, 'utf-8').replace(/\s+/g, '');
    } catch (e) {
        throw new Error(`Input load failed: ${e.message}`);
    }
}

// 使用示例
// @ts-ignore
(async () => {
    try {
        // 从命令行获取参数：DFA文件路径和输入单词
        const dfaFilePath = process.argv[3];
        const input = process.argv[2];

        if (!input) {
            throw new Error('用法: ts-node main.ts <输入单词> [dfa文件路径]');
        }

        // 从文件加载配置和输入
        const config = loadConfig(dfaFilePath ?? './lexer-config.json');
        // const input = loadInput('./expression.txt');

        // 创建词法分析器实例
        const lexer = new DynamicLexer(config);

        // 执行词法分析
        const tokens = lexer.tokenize(input);
        console.log('Tokenization result:');
        console.log(tokens);
    } catch (e) {
        console.error('Error:', e.message);
    }
})();
