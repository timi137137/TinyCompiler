import { Token, TokenTypes } from '../type/AST'

// 词法分析器
export function tokenizer(code: string) {
    // 已分析的记号
    const tokens: Token[] = []
    let current = 0 // 当前分析下标

    while (current < code.length) {
        let char = code[current]

        //空格
        const WHITESPACE = /\s/
        if (WHITESPACE.test(char)) {
            current++
            continue
        }

        //左-小括号
        if (char === '(') {
            tokens.push({
                type: TokenTypes.Paren,
                value: char,
            })
            current++
            continue
        }

        //右-小括号
        if (char === ')') {
            tokens.push({
                type: TokenTypes.Paren,
                value: char,
            })
            current++
            continue
        }

        //单词
        const LETTERS = /[a-z]/i
        if (LETTERS.test(char)) {
            let value = ''
            while (LETTERS.test(char) && current < code.length) {
                value += char
                char = code[++current]
            }
            tokens.push({ type: TokenTypes.Name, value })
        }
        //数字
        const NUMBERS = /[0-9]/
        if (NUMBERS.test(char)) {
            let value = ''
            while (NUMBERS.test(char) && current < code.length) {
                value += char
                char = code[++current]
            }
            tokens.push({ type: TokenTypes.NumberLiteral, value })
        }
    }

  return tokens
}
