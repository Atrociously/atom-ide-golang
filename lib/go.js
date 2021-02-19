const cp = require('child_process');
const path = require('path');
const util = require('./util');
const pkg = require('../package.json')

class Go {
    constructor(env) {
        this.env = env
    }

    static async create() {
        return this.spawn(['env']).then((stdout) => {
            let env = util.parseEnv(stdout);
            return new Go(env);
        });
    }

    tool(name, input) {
        let toolpath = path.join(this.env.GOPATH, 'bin', name);
        let options = { env: process.env };

        return new Promise((resolve, reject) => {
            let p = cp.execFile(toolpath, options, (err, stdout, _) => {
                if (err != null) {
                    return reject(err);
                }
                resolve(stdout);
            });
            if (input !== null || input !== undefined) {
                p.stdin.write(input);
            }
            p.stdin.end();
        });
    }

    spawnTool(name, args) {
        let toolpath = path.join(this.env.GOPATH, 'bin', name);
        let options = { env: process.env };

        return cp.execFile(toolpath, args, options);
    }

    static spawn(args) {
        let command = `go ${args.join(' ')}`;
        return new Promise((resolve, reject) => {
            cp.exec(command, (err, stdout, _) => {
                if (err != null) {
                    return reject(err);
                }
                resolve(stdout);
            });
        });
    }
}

module.exports.Go = Go
