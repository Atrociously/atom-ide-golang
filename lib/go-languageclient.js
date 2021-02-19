const { AutoLanguageClient } = require('atom-languageclient');
const { Go } = require('./go');
const util = require('./util');
const pkg = require('../package.json');

class GoLanguageClient extends AutoLanguageClient {
    go;
    GO_IDENTIFIER_REGEX = /(([^\d\W])[\w.]*)|\.$/;

    async getFileCodeFormat(editor) {
        let newText = '';
        await this.go.tool(util.getPluginConfigValue('formatTool'), editor.getText()).then((stdout) => {
            newText = stdout;
        });
        return [{
            oldRange: editor.getBuffer().getRange(),
            newText: newText,
        }];
    }

    async startServerProcess(_projectPath) {
        return Go.create().then((go) => {
            const proc = go.spawnTool(this.getServerName(), ['-mode=stdio']);
            this.captureServerErrors(proc);
            proc.on('exit', code => {
                if (!proc.killed) {
                    atom.notifications.addError(`${pkg.name}: go language server stopped unexpectedly`, {
                        dismissable: true,
                        description: this.processStdErr ? `<code>${this.processStdErr}</code>` : `Exit code ${code}`
                    });
                }
            });
            return proc;
        });
    }

    getGrammarScopes() {
        return pkg.enhancedScopes
    }

    getLanguageName() {
        return "Go"
    }

    getServerName() {
        return "gopls"
    }

    getRootConfigurationKey() {
        return "gopls"
    }
}

module.exports.GoLanguageClient = GoLanguageClient;
