import * as pkg from '../package.json'

function parseEnv(source: string) {
    let env = {}

    let vars = source.split('\n').filter((el) => { return el != '' })

    for (let v of vars) {
        let parts = v.split('=')
        let key = parts[0].replace('set', '').trim()
        let value = parts[1].replace('"', '').trim()
        env[key] = value
    }

    return env
}

function getPluginConfigValue(key: string): any {
    return atom.config.get(`${pkg.name}.${key}`)
}

exports.parseEnv = parseEnv
exports.getPluginConfigValue = getPluginConfigValue
