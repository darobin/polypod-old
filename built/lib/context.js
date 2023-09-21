var AppContext = /** @class */ (function () {
    function AppContext(opts) {
        this.opts = opts;
    }
    Object.defineProperty(AppContext.prototype, "blobDir", {
        get: function () { return this.opts.blobDir; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(AppContext.prototype, "keyDir", {
        get: function () { return this.opts.keyDir; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(AppContext.prototype, "repoSigningKey", {
        get: function () { return this.opts.repoSigningKey; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(AppContext.prototype, "plcRotationKey", {
        get: function () { return this.opts.plcRotationKey; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(AppContext.prototype, "recoveryKey", {
        get: function () { return this.opts.recoveryKey; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(AppContext.prototype, "log", {
        get: function () { return this.opts.log; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(AppContext.prototype, "pgURL", {
        get: function () { return this.opts.pgURL || 'postgres://localhost/polypod'; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(AppContext.prototype, "plcURL", {
        get: function () { return this.opts.plcURL || 'http://localhost:2582'; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(AppContext.prototype, "port", {
        get: function () { return this.opts.port || 2583; },
        enumerable: false,
        configurable: true
    });
    return AppContext;
}());
export { AppContext };
export default AppContext;
