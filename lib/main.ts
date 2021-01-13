import DatatipAdapter from 'atom-languageclient/build/lib/adapters/datatip-adapter'
// import 'reflect-metadata'
// import { container } from 'tsyringe'
import { GoLanguageClient } from './go-languageclient'

// const client: GoLanguageClient = container
//     .register<DatatipAdapter>(DatatipAdapter, {
//         useClass: DatatipAdapter,
//     })
//     .resolve(GoLanguageClient)

const client: GoLanguageClient = new GoLanguageClient()

module.exports = client

module.exports.config = {
    customGoPath: {
        title: 'Go Path',
        description: 'Custom path to the go home',
        type: 'string',
        default: '',
    },
    doFormat: {
        title: 'Formatting',
        description: 'Set whether the language server formats code',
        type: 'boolean',
        default: true,
    }
}
