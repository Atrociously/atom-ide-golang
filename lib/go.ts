import { EventEmitter } from 'events'
import * as cp from 'child_process'
import * as path from 'path'
import * as util from './util'
import * as pkg from '../package.json'

export class Go extends EventEmitter {
    env: any;
    public constructor() {
        super();

        let emit = this.emit
        let output = ''

        let goEnv = this.spawn(['env'], {async: false}) as cp.SpawnSyncReturns<string>
        if (goEnv.error) {
            atom.notifications.addError(`${pkg.name} unable to get the go env are you sure go is installed?`, {
                dismissable: true,
                description: goEnv.error.message,
                detail: goEnv.error.stack,
            })
            return
        }
        this.env = util.parseEnv(goEnv.stdout.toString())
    }

    public tool(name: string, args: string[], options?: any, callback?: any): cp.ChildProcess {
        options = options === null || options === undefined ? {} : options
        options = Object.assign({
            env: process.env,
        }, options)

        let toolpath = path.join(this.env.GOPATH, 'bin', name)
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
