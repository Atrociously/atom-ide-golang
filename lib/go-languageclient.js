
const { AutoLanguageClient } = require('atom-languageclient');
const child = require('child_process');
const process = require('process');

class GoLanguageClient extends AutoLanguageClient {
    constructor() {
        super(...arguments);
        this.GO_IDENTIFIER_REGEX = /(([^\d\W])[\w.]*)|\.$/;
    }

    getGrammarScopes() {
        return [ "source.go", "go" ];
    }

    getLanguageName() {
        return "Go";
    }

    getServerName() {
        return "gopls";
    }

    getRootConfigurationKey() {
        return "gopls";
    }

    mapConfigurationObject(configuration) {
        return {
            gopls: configuration
        };
    }

    provideOnSaveCodeFormat() {
        return super.provideOnSaveCodeFormat();
    }

    async startServerProcess(projectPath) {
        const env = process.env;
        const gopls = "gopls";

        const childProcess = child.spawn(gopls, ["-mode=stdio"], {
            env: env,
        });

        childProcess.on("close", code => {
            if (!childProcess.killed) {
                atom.notifications.addError("ide-golang the gopls language server closed unexpectedly.", {
                    dismissable: true,
                    description: this.processStdErr ? `<code>${this.processStdErr}</code>` : `Exit code ${code}`,
                });
            }
            console.log(this.processStdErr);
        })

        return childProcess;
    }

    async getSuggestions(request) {
        if (!this.GO_IDENTIFIER_REGEX.test(request.prefix)) return null;
        return super.getSuggestions(request);
    }
}

exports.GoLanguageClient = GoLanguageClient;
