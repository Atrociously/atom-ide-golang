import { AutoLanguageClient, LanguageServerProcess } from 'atom-languageclient'
import { InitializeParams } from 'atom-languageclient/build/lib/languageclient'
import { SuggestionsRequestedEvent } from 'atom/autocomplete-plus'
import { TextEditor } from 'atom'
import { ChildProcess } from 'child_process'
import * as atomIde from 'atom-ide'
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

    public getFileCodeFormat(editor: TextEditor): Promise<atomIde.TextEdit[]> {
        let formatTool = this.go.tool(util.getPluginConfigValue('formatTool'), [...util.getPluginConfigValue('formatOptions')])
        let newText = ''
        formatTool.stdout.setEncoding('ascii')
        formatTool.stdout.on('data', (data) => {
            if (data) {
                newText += data
            }
        })
        formatTool.stdin.write(editor.getText())
        formatTool.stdin.end()

        return new Promise((resolve, reject) => {
            formatTool.addListener('error', reject);
            formatTool.addListener('exit', resolve);
        }).then(() => {
            if (newText === undefined || newText === '') {
                newText = editor.getText()
            }
            return [{
                oldRange: editor.getBuffer().getRange(),
                newText: newText,
            }]
        })
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
