const child = require('child_process');
const path = require('path');
const { parseEnv } = require('./util');

const READY = new Event('ready');

class Go {
    constructor() {
        this.ev = new EventTarget();

        let env = {};
        this.exec(["env"], (error, stdout, stderr) => {
            if (error) {
                atom.notifications.addError(`exec error: ${error}`, {
                    dismissable: true,
                    description: `stderr: ${stderr}`,
                });
            }
            parseEnv(env, stdout);
            this.dispatch(READY);
        });
        this.env = env;
    }

    on(event, callback) {
        this.ev.addEventListener(event, callback);
    }

    dispatch(event) {
        this.ev.dispatchEvent(event);
    }

    tool(name, args, options, callback) {
        let toolpath = path.join(this.env.GOPATH, 'bin', name);

        return child.execFile(toolpath, args, options, callback);
    }

    exec(args, options, callback) {
        return child.exec(`go ${args.join(" ")}`, options, callback);
    }
}

exports.Go = Go;
