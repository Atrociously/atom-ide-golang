const { GoLanguageClient } = require('./go-languageclient');

let client = new GoLanguageClient();

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
        default: 'gofmt',
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

module.exports = client;
