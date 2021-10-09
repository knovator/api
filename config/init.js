"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
exports.__esModule = true;
exports.setAPIConfig = exports.config = void 0;
var config = {
    baseUrl: "",
    handleCache: true
};
exports.config = config;
var setAPIConfig = function (conf) {
    exports.config = config = __assign(__assign({}, config), conf);
};
exports.setAPIConfig = setAPIConfig;
