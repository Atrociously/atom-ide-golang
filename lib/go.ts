import { EventEmitter } from 'events'
import * as cp from 'child_process'
import * as path from 'path'
import * as util from './util'

export class Go extends EventEmitter {
    public constructor() {
        super();

        let emit = this.emit
        let output = ''

        let goEnv: cp.ChildProcess = this.spawn(['env'], {async: false})
        this.env = util.parseEnv(goEnv.stdout.toString('ascii'))
    }

    public tool(name: string, args: string[], options?: object, callback?: object) {
        options = options === null || options === undefined ? {} : options

        let toolpath = path.join(this.env.GOPATH, 'bin', name)

        if ('async' in options) {
            if (options.async) {
                return cp.execFile(toolpath, args, options, callback)
            } else {
                return cp.execFileSync(toolpath, args, options, callback)
            }
        }
        return cp.execFile(toolpath, args, options, callback)
    }

    public spawn(args: string[], options) {
        options = options === null || options === undefined ? {} : options
        if ('async' in options) {
            if (options.async) {
                return cp.spawn('go', args, options)
            } else {
                return cp.spawnSync('go', args, options)
            }
        }
        return cp.spawn('go', args, options)
    }
}
