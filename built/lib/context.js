var AppContext = /** @class */ (function () {
    function AppContext(opts) {
        if (opts === void 0) { opts = {}; }
        this.opts = opts;
    }
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
    Object.defineProperty(AppContext.prototype, "plc", {
        get: function () { return this.opts.plc; },
        set: function (s) { this.opts.plc = s; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(AppContext.prototype, "plcPort", {
        get: function () { return this.opts.plcPort || 2582; },
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
