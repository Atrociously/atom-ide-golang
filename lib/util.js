const pkg = require('../package.json')

function parseEnv(source) {
    let vars = source.split("\n").filter((el) => { return el != ""; });

    let env = {}
    for (let v of vars) {
        let parts = v.split("=");
        let key = parts[0].replace("set", "").trim();
        let value = parts[1].replace("\"", "").trim();
        env[key] = value;
    }
    return env;
}

function pluginConfigGet(key) {
    return atom.config.get(`${pkg.name}.${key}`);
}

exports.parseEnv = parseEnv;
