import { AutoLanguageClient, LanguageServerProcess } from 'atom-languageclient'
import { SuggestionsRequestedEvent } from 'atom/autocomplete-plus'
import { TextEditor } from 'atom'
import { ChildProcess } from 'child_process'
import { Go } from './go'
import * as util from './util'
import * as pkg from '../package.json'

export class GoLanguageClient extends AutoLanguageClient {
    go: Go
    GO_IDENTIFIER_REGEX: RegExp

    public constructor() {
        super()

        this.go = new Go();
        this.GO_IDENTIFIER_REGEX = /(([^\d\W])[\w.]*)|\.$/
    }

    public startServerProcess(_projectPath: string): LanguageServerProcess | Promise<LanguageServerProcess> {
        const gopls = this.go.tool('gopls', ['-mode=stdio'], {
            env: process.env,
        })
        gopls.on('close', () => {
            console.log(this.processStdErr)
        })
        return gopls as LanguageServerProcess
    }

    public getSuggestions(request: SuggestionsRequestedEvent) {
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
