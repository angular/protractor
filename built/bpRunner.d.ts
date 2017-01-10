/// <reference types="node" />
/// <reference types="q" />
import { ChildProcess } from 'child_process';
import * as q from 'q';
import { Config } from './config';
export declare class BlockingProxyRunner {
    private config;
    bpProcess: ChildProcess;
    port: number;
    constructor(config: Config);
    start(): q.Promise<{}>;
    checkSupportedConfig(): void;
}
