const child = require('child_process');
const path = require('path');
const util = require('./util');

const READY = new Event('ready');

class Go {
    constructor() {
        this.ev = new EventTarget();
        
        let result = this.spawn(["env"], {async: false}, null);
        this.env = util.parseEnv(result.stdout.toString("ascii"));
    }

    on(event, callback) {
        this.ev.addEventListener(event, callback);
    }

    dispatch(event) {
        this.ev.dispatchEvent(event);
    }

    tool(name, args, options, callback) {
        let toolpath = path.join(this.env.GOPATH, "bin", name);

        // check if async was specified then run the tool async or sync (default: async)
        if ('async' in options) {
            if (options.async) {
                return child.execFile(toolpath, args, options, callback);
            } else {
                return child.execFileSync(toolpath, args, options, callback);
            }
        }
        return child.execFile(toolpath, args, options, callback);
    }

    spawn(args, options) {
        // check if async was specified then run the tool async or sync (default: async)
        if ('async' in options) {
            if (options.async) {
                return child.spawn("go", args, options);
            } else {
                return child.spawnSync("go", args, options);
            }
        }
        return child.spawn("go", args, options);
    }
}

exports.Go = Go;
