function parseEnv(env, source) {
    let vars = source.split("\n").filter((el) => { return el != ""; });
    console.log(vars);

    for (let v of vars) {
        let parts = v.split("=");
        let key = parts[0];
        let value = parts[1].replace("\"", "");
        env[key] = value;
    }
    console.log(env);
}

exports.parseEnv = parseEnv;
