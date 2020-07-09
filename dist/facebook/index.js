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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var querystring_1 = __importDefault(require("querystring"));
var axios_1 = __importDefault(require("axios"));
var FacebookProvider = /** @class */ (function () {
    function FacebookProvider(data) {
        var _a, _b, _c, _d, _e;
        if (!data.clientId) {
            throw new Error("Missing clientId parameter.");
        }
        if (!data.redirectUri) {
            throw new Error("Missing redirectUri parameter.");
        }
        this.params = {
            clientId: data.clientId,
            doneCallback: data.doneCallback,
            clientSecret: data.clientSecret,
            redirectUri: data.redirectUri,
            scope: (_a = data.scope) !== null && _a !== void 0 ? _a : ["email"].join(","),
            responseType: (_b = data.responseType) !== null && _b !== void 0 ? _b : "code",
            authType: (_c = data.authType) !== null && _c !== void 0 ? _c : "rerequest",
            display: (_d = data.display) !== null && _d !== void 0 ? _d : "popup",
            searchParams: (_e = data.searchParams) !== null && _e !== void 0 ? _e : ["email", "name", "picture"].join(","),
        };
        this.route = this.route.bind(this);
        this.responseRoute = this.responseRoute.bind(this);
        this.buildUser = this.buildUser.bind(this);
    }
    FacebookProvider.prototype.getAppToken = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, clientId, clientSecret, access_token;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this.params, clientId = _a.clientId, clientSecret = _a.clientSecret;
                        return [4 /*yield*/, axios_1.default.get("https://graph.facebook.com/v7.0/oauth/access_token?client_id=" + clientId + "&client_secret=" + clientSecret + "&grant_type=client_credentials")];
                    case 1:
                        access_token = (_b.sent()).data.access_token;
                        this.params.appToken = access_token;
                        return [2 /*return*/];
                }
            });
        });
    };
    FacebookProvider.prototype.getUserId = function (accessToken) {
        return __awaiter(this, void 0, void 0, function () {
            var searchParams, debugToken;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        searchParams = this.params.searchParams;
                        debugToken = querystring_1.default.stringify({
                            access_token: accessToken,
                            fields: searchParams,
                            state: "authStep",
                        });
                        return [4 /*yield*/, axios_1.default.get("https://graph.facebook.com/me?" + debugToken)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    FacebookProvider.prototype.getAccessToken = function (code) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, clientId, clientSecret, redirectUri, scope, params;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this.params, clientId = _a.clientId, clientSecret = _a.clientSecret, redirectUri = _a.redirectUri, scope = _a.scope;
                        params = querystring_1.default.stringify({
                            client_id: clientId,
                            client_secret: clientSecret,
                            redirect_uri: redirectUri,
                            code: code,
                            scope: scope,
                            state: "authStep",
                        });
                        return [4 /*yield*/, axios_1.default.get("https://graph.facebook.com/v7.0/oauth/access_token?" + params)];
                    case 1: return [2 /*return*/, _b.sent()];
                }
            });
        });
    };
    FacebookProvider.prototype.buildUser = function (request) {
        return __awaiter(this, void 0, void 0, function () {
            var code, appToken, tokenData, userData, user, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        code = request.query.code;
                        appToken = this.params.appToken;
                        if (!!appToken) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.getAppToken()];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 5, , 6]);
                        return [4 /*yield*/, this.getAccessToken(String(code))];
                    case 3:
                        tokenData = (_a.sent()).data;
                        return [4 /*yield*/, this.getUserId(tokenData.access_token)];
                    case 4:
                        userData = (_a.sent()).data;
                        user = {
                            id: userData.id,
                            token: __assign({}, tokenData),
                            info: __assign(__assign({}, userData), { picture: __assign({}, userData.picture.data) }),
                        };
                        return [2 /*return*/, user];
                    case 5:
                        err_1 = _a.sent();
                        throw new Error(err_1.message);
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    FacebookProvider.prototype.route = function (_req, res) {
        var _a = this.params, clientId = _a.clientId, redirectUri = _a.redirectUri, authType = _a.authType, responseType = _a.responseType, scope = _a.scope;
        res.redirect("https://www.facebook.com/v7.0/dialog/oauth?client_id=" + clientId + "&redirect_uri=" + encodeURIComponent(redirectUri) + "&auth_type=" + authType + "&response_type=" + responseType + "&scope=" + scope + "&state=codeStep");
    };
    FacebookProvider.prototype.responseRoute = function (request, response) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, state, error, error_code, user;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = request.query, state = _a.state, error = _a.error, error_code = _a.error_code;
                        if (error && error_code == "200") {
                            throw new Error("Access denied from facebook. error: " + error);
                        }
                        if (!state) {
                            throw new Error("Access denied from facebook. error: " + error);
                        }
                        return [4 /*yield*/, this.buildUser(request)];
                    case 1:
                        user = _b.sent();
                        this.params.doneCallback(user, request, response);
                        return [2 /*return*/];
                }
            });
        });
    };
    return FacebookProvider;
}());
exports.default = FacebookProvider;
//# sourceMappingURL=index.js.map