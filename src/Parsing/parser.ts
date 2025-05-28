import { Token, TokenTypes } from '../type/AST'
import { NodeTypes, NumberLiteralNode, CallExpressionNode, RootNode } from '../type/AST'

function createRootNode(): RootNode {
    return {
        type: NodeTypes.Program,
        body: [],
    }
}

function createNumberNode(value: string): NumberLiteralNode {
    return {
        type: NodeTypes.NumberLiteral,
        value,
    }
}

function createCallExpressionNode(name: string): CallExpressionNode {
    return {
        type: NodeTypes.CallExpression,
        name,
        params: [],
    }
}

export function parser(tokens: Token[]) {
    let current = 0

  const rootNode = createRootNode()

  function walk() {
      let token = tokens[current]

    if (token.type === TokenTypes.NumberLiteral) {
        current++
        return createNumberNode(token.value)
    }

    if (token.type === TokenTypes.Paren && token.value === '(') {
        token = tokens[++current]

      const node = createCallExpressionNode(token.value)
        token = tokens[++current]
        while (!(token.type === TokenTypes.Paren && token.value === ')')) {
            node.params.push(walk())
            token = tokens[current]
        }
        current++
        return node
    }
      throw new Error(`Unknown token:${token}`)
  }
    while (current < tokens.length) {
        rootNode.body.push(walk())
    }
    return rootNode
}
