import { GoLanguageClient } from './go-languageclient'

const client: GoLanguageClient = new GoLanguageClient()

module.exports = client

module.exports.config = {
    customGoPath: {
        title: 'Go Path',
        description: 'Custom path to the go home',
        type: 'string',
        default: '',
        order: 1,
    },
    formatTool: {
        title: 'Format Tool',
        description: 'Set the desired format tool',
        type: 'string',
        default: 'goimports',
        enum: ['gofmt', 'goimports', 'goreturns', 'gofumpt'],
        order: 2,
    },
    formatOptions: {
        title: 'Format Options',
        description: 'Set formatting options for desired tool',
        type: 'array',
        default: [],
        items: {
            type: 'string',
        },
        order: 3,
    }
}
