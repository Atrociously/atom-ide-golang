const { GoLanguageClient } = require('./go-languageclient');

const client = new GoLanguageClient();
client.go.on('ready', () => {
    module.exports = client;
});
// module.exports = client;
