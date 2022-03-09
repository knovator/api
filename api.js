"use strict";
exports.__esModule = true;
exports.setAPIConfig = void 0;
var axios_1 = require("axios");
var QueryString = require("qs");
var init_1 = require("./config/init");
exports.setAPIConfig = init_1.setAPIConfig;
var cache = [];
var cancel = [];
var getEndPoint = function (config) {
    if (init_1.config.prefix) {
        var prefix = typeof init_1.config.prefix === "function"
            ? init_1.config.prefix(config)
            : init_1.config.prefix;
        return init_1.config.baseUrl + "/" + prefix;
    }
    else {
        return init_1.config.baseUrl;
    }
};
var ACTION_HANDLERS = {
    GET: function (url, data, config) {
        var queryUrl = url;
        if (data !== undefined) {
            var query = QueryString.stringify(data);
            queryUrl = queryUrl + "?" + query;
        }
        return axios_1["default"].get("" + getEndPoint(config) + (url ? "" + queryUrl : ""), {
            cancelToken: new axios_1["default"].CancelToken(function (cToken) {
                cancel.push({ url: url, cToken: cToken });
            }),
            headers: config.headers
        });
    },
    DELETE: function (url, data, config) {
        return axios_1["default"]["delete"]("" + getEndPoint(config) + (url ? "/" + url : ""), {
            data: data,
            headers: config.headers
        });
    },
    POST: function (url, data, config) {
        return axios_1["default"].post("" + getEndPoint(config) + (url ? "/" + url : ""), data, {
            headers: config.headers
        });
    },
    PATCH: function (url, data, config) {
        return axios_1["default"].patch("" + getEndPoint(config) + (url ? "/" + url : ""), data, {
            headers: config.headers
        });
    },
    PUT: function (url, data, config) {
        return axios_1["default"].put("" + getEndPoint(config) + (url ? "/" + url : ""), data, {
            headers: config.headers
        });
    }
};
function setHeaders(_a) {
    var headers = _a.headers, _b = _a.authToken, authToken = _b === void 0 ? true : _b;
    var token = typeof init_1.config.getToken === "function" ? init_1.config.getToken() : init_1.config.getToken;
    if (authToken && token) {
        var _c = init_1.config.tokenPrefix, tokenPrefix = _c === void 0 ? "Bearer" : _c;
        axios_1["default"].defaults.headers.common.Authorization = "" + (tokenPrefix ? tokenPrefix + " " : "") + token;
    }
    else {
        delete axios_1["default"].defaults.headers.common.Authorization;
    }
}
function handleError(error) {
    var _a;
    cache = [];
    (_a = init_1.config === null || init_1.config === void 0 ? void 0 : init_1.config.onError) === null || _a === void 0 ? void 0 : _a.call(init_1.config, error);
}
var cacheHandler = function (url) {
    if (init_1.config.handleCache) {
        if (cache.includes(url)) {
            var controller = cancel.filter(function (index) { return index.url === url; });
            controller.map(function (item) { return item.cToken(); });
        }
        else {
            cache.push(url);
        }
    }
};
var fetchUrl = function (_a) {
    var _b = _a.type, type = _b === void 0 ? "get" : _b, url = _a.url, _c = _a.data, data = _c === void 0 ? {} : _c, _d = _a.config, config = _d === void 0 ? {} : _d;
    setHeaders(config);
    url = config.hash ? url + "?hash=" + config.hash : url;
    cacheHandler(url);
    var handler = ACTION_HANDLERS[type.toUpperCase()];
    return handler(url, data, config)
        .then(function (response) { return Promise.resolve(response.data); })["catch"](function (error) {
        handleError(error);
        return Promise.reject(error);
    });
};
exports["default"] = fetchUrl;
