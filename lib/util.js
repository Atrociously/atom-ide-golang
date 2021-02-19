const pkg = require('../package.json');

module.exports = {
    parseEnv(source) {
        let env = {}

        let vars = source.split('\n').filter((el) => { return el != '' })

        for (let v of vars) {
            let parts = v.split('=')
            let key = parts[0].replace(/set/, '').trim()
            let value = parts[1].replace(/"/g, '').trim()
            env[key] = value
        }

        return env
    },

    getPluginConfigValue(key) {
        return atom.config.get(`${pkg.name}.${key}`)
    },
}
