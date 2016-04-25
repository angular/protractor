export interface Config {
    specs: Array<string>;
    multiCapabilities: Array<any>;
    capabilities?: any;
    rootElement: string;
    allScriptsTimeout: number;
    getPageTimeout: number;
    params: any;
    framework: string;
    jasmineNodeOpts: {
        showColors: boolean;
        defaultTimeoutInterval: number;
    };
    seleniumArgs: Array<any>;
    seleniumSessionId?: string;
    mochaOpts: {
        ui: string;
        reporter: string;
    };
    chromeDriver?: string;
    configDir: string;
    noGlobals: boolean;
    plugins: Array<any>;
    skipSourceMapSupport: boolean;
    suite?: string;
    suites?: any;
    troubleshoot?: boolean;
    exclude?: Array<string> | string;
    maxSessions?: number;
    seleniumAddress?: string;
    webDriverProxy?: string;
    disableEnvironmentOverrides?: boolean;
    browserstackUser?: string;
    browserstackKey?: string;
    firefoxPath?: string;
    seleniumServerJar?: string;
    seleniumPort?: number;
    localSeleniumStandaloneOpts?: {
        args?: any;
        port?: any;
    };
    sauceAgent?: string;
    sauceBuild?: string;
    sauceKey?: string;
    sauceSeleniumAddress?: string;
    sauceUser?: string;
    v8Debug?: any;
    nodeDebug?: boolean;
    directConnect?: boolean;
    mockSelenium?: boolean;
    baseUrl?: string;
    untrackOutstandingTimeouts?: any;
    debuggerServerPort?: number;
    useAllAngular2AppRoots?: boolean;
    frameworkPath?: string;
    restartBrowserBetweenTests?: boolean;
    onPrepare?: any;
    beforeLaunch?: any;
    getMultiCapabilities?: any;
    elementExplorer?: any;
    afterLaunch?: any;
    debug?: boolean;
    resultJsonOutputFile?: any;
}
export declare class ConfigParser {
    private config_;
    constructor();
    /**
     * Resolve a list of file patterns into a list of individual file paths.
     *
     * @param {Array.<string> | string} patterns
     * @param {=boolean} opt_omitWarnings Whether to omit did not match warnings
     * @param {=string} opt_relativeTo Path to resolve patterns against
     *
     * @return {Array} The resolved file paths.
     */
    static resolveFilePatterns(patterns: Array<string> | string, opt_omitWarnings?: boolean, opt_relativeTo?: string): Array<string>;
    /**
     * Returns only the specs that should run currently based on `config.suite`
     *
     * @return {Array} An array of globs locating the spec files
     */
    static getSpecs(config: Config): Array<string>;
    /**
     * Add the options in the parameter config to this runner instance.
     *
     * @private
     * @param {Object} additionalConfig
     * @param {string} relativeTo the file path to resolve paths against
     */
    private addConfig_(additionalConfig, relativeTo);
    /**
     * Public function specialized towards merging in a file's config
     *
     * @public
     * @param {String} filename
     */
    addFileConfig(filename: string): ConfigParser;
    /**
     * Public function specialized towards merging in config from argv
     *
     * @public
     * @param {Object} argv
     */
    addConfig(argv: any): ConfigParser;
    /**
     * Public getter for the final, computed config object
     *
     * @public
     * @return {Object} config
     */
    getConfig(): Config;
}
