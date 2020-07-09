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
exports.prompt = exports.accessType = exports.responseType = exports.scope = void 0;
var querystring_1 = __importDefault(require("querystring"));
var axios_1 = __importDefault(require("axios"));
var scope;
(function (scope) {
    scope["EMAIL"] = "https://www.googleapis.com/auth/userinfo.email";
    scope["NAME"] = "https://www.googleapis.com/auth/userinfo.profile";
})(scope = exports.scope || (exports.scope = {}));
var responseType;
(function (responseType) {
    responseType["CODE"] = "code";
})(responseType = exports.responseType || (exports.responseType = {}));
var accessType;
(function (accessType) {
    accessType["OFFLINE"] = "offline";
})(accessType = exports.accessType || (exports.accessType = {}));
var prompt;
(function (prompt) {
    prompt["CONSENT"] = "consent";
})(prompt = exports.prompt || (exports.prompt = {}));
var GoogleProvider = /** @class */ (function () {
    function GoogleProvider(data) {
        var _a, _b, _c;
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
            scope: (_a = data.scope) !== null && _a !== void 0 ? _a : [scope.EMAIL, scope.NAME].join(" "),
            responseType: (_b = data.responseType) !== null && _b !== void 0 ? _b : responseType.CODE,
            accessType: (_c = data.accessType) !== null && _c !== void 0 ? _c : accessType.OFFLINE,
            prompt: prompt.CONSENT,
        };
        this.route = this.route.bind(this);
        this.responseRoute = this.responseRoute.bind(this);
    }
    GoogleProvider.prototype.getAccessToken = function (code) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, clientId, clientSecret, redirectUri, data;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this.params, clientId = _a.clientId, clientSecret = _a.clientSecret, redirectUri = _a.redirectUri;
                        return [4 /*yield*/, axios_1.default({
                                url: "https://oauth2.googleapis.com/token",
                                method: "post",
                                data: {
                                    client_id: clientId,
                                    client_secret: clientSecret,
                                    redirect_uri: redirectUri,
                                    grant_type: "authorization_code",
                                    code: code,
                                },
                            })];
                    case 1:
                        data = (_b.sent()).data;
                        return [2 /*return*/, data.access_token];
                }
            });
        });
    };
    GoogleProvider.prototype.getUserInfo = function (accessToken) {
        return __awaiter(this, void 0, void 0, function () {
            var data, user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, axios_1.default({
                            url: "https://www.googleapis.com/oauth2/v2/userinfo",
                            method: "get",
                            headers: {
                                Authorization: "Bearer " + accessToken,
                            },
                        })];
                    case 1:
                        data = (_a.sent()).data;
                        user = {
                            id: data.id,
                            token: {
                                access_token: accessToken,
                            },
                            info: __assign({}, data),
                        };
                        return [2 /*return*/, user];
                }
            });
        });
    };
    GoogleProvider.prototype.route = function (_req, res) {
        var _a = this.params, clientId = _a.clientId, redirectUri = _a.redirectUri, responseType = _a.responseType, scope = _a.scope, accessType = _a.accessType, prompt = _a.prompt;
        var stringifiedParams = querystring_1.default.stringify({
            client_id: clientId,
            redirect_uri: redirectUri,
            scope: scope,
            response_type: responseType,
            access_type: accessType,
            prompt: prompt,
        });
        res.redirect("https://accounts.google.com/o/oauth2/v2/auth?" + stringifiedParams);
    };
    GoogleProvider.prototype.responseRoute = function (request, response) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, code, error, error_code, accessToken, user;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = request.query, code = _a.code, error = _a.error, error_code = _a.error_code;
                        if (error && error_code == "200") {
                            throw new Error("Access denied from google. error: " + error);
                        }
                        if (!code) {
                            throw new Error("Invalid Code. error: " + error);
                        }
                        return [4 /*yield*/, this.getAccessToken(String(code))];
                    case 1:
                        accessToken = _b.sent();
                        return [4 /*yield*/, this.getUserInfo(String(accessToken))];
                    case 2:
                        user = _b.sent();
                        this.params.doneCallback(user, request, response);
                        return [2 /*return*/];
                }
            });
        });
    };
    return GoogleProvider;
}());
exports.default = GoogleProvider;
//# sourceMappingURL=index.js.map