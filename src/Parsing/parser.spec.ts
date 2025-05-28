import { parser } from './parser'
import { test, expect } from 'vitest'
import { TokenTypes, Token, NodeTypes } from '../type/AST'

test('parser', () => {
    const tokens: Token[] = [
        { type: TokenTypes.Paren, value: '(' },
        { type: TokenTypes.Name, value: 'add' },
        { type: TokenTypes.NumberLiteral, value: '2' },
        { type: TokenTypes.Paren, value: '(' },
        { type: TokenTypes.Name, value: 'subtract' },
        { type: TokenTypes.NumberLiteral, value: '4' },
        { type: TokenTypes.NumberLiteral, value: '2' },
        { type: TokenTypes.Paren, value: ')' },
        { type: TokenTypes.Paren, value: ')' },
    ]
    const ast = {
        type: NodeTypes.Program,
        body: [
            {
                type: NodeTypes.CallExpression,
                name: 'add',
                params: [
                    {
                        type: NodeTypes.NumberLiteral,
                        value: '2',
                    },
                    {
                        type: NodeTypes.CallExpression,
                        name: 'subtract',
                        params: [
                            {
                                type: NodeTypes.NumberLiteral,
                                value: '4',
                            },
                            {
                                type: NodeTypes.NumberLiteral,
                                value: '2',
                            },
                        ],
                    },
                ],
            },
        ],
    }
    expect(parser(tokens)).toEqual(ast)
})
