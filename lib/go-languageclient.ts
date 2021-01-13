import { AutoLanguageClient, LanguageServerProcess } from 'atom-languageclient'
import { TextEditor } from 'atom'
import { Go } from './go'
import * as util from './util'
import * as pkg from '../package.json'

export class GoLanguageClient extends AutoLanguageClient {
    public constructor() {
        super()

        this.go = new Go();
        this.GO_IDENTIFIER_REGEX = /(([^\d\W])[\w.]*)|\.$/
    }

    public async startServerProcess(): Promise<ChildProcess> {
        const gopls = this.go.tool('gopls', ['-mode=stdio'], {
            env: process.env,
        })
        gopls.on('close', () => {
            console.log(this.processStdErr)
        })
        return gopls
    }

    public async getSuggestions(request) {
        if (!this.GO_IDENTIFIER_REGEX.test(request.prefix)) return null
        return super.getSuggestions(request)
    }

    public getGrammarScopes() {
        return pkg.enhancedScopes
    }

    public getLanguageName() {
        return "Go"
    }

    public getServerName() {
        return "gopls"
    }

    public getRootConfigurationKey() {
        return "gopls"
    }

    public mapConfigurationObject(configuration) {
        return {
            gopls: configuration
        }
    }
}
