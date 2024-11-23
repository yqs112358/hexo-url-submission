"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deployer = void 0;
const path_1 = __importDefault(require("path"));
const google_auth_library_1 = require("google-auth-library");
const axios_1 = __importDefault(require("axios"));
const https_proxy_agent_1 = __importDefault(require("https-proxy-agent"));
const fs = __importStar(require("hexo-fs"));
const utils_1 = require("./utils/utils");
const deployer = (args) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { config, log, base_dir } = args;
    const { url_submission, url } = config;
    const { urlArr, count: baseCount, sitemap, proxy } = url_submission;
    let { key, count } = (_a = url_submission.channels) === null || _a === void 0 ? void 0 : _a.google;
    axios_1.default.defaults.timeout = utils_1.defaultTimeOut;
    const logPrefix = utils_1.projectPrefix.concat('(\x1b[3mgoogle\x1b[23m) ');
    if (count === undefined) {
        log.info(logPrefix.concat("The number of submitted entries for Google Search is not set, and the default value will be used for submission."));
    }
    count = Math.min(count || baseCount, urlArr.length);
    log.warn(logPrefix.concat('The number of entries submitted by Google Search has been set to \x1b[1m', String(count), '\x1b[22m'));
    let axios = axios_1.default.create();
    let parsedGoogleKey;
    try {
        let keyPath = path_1.default.join(base_dir, key);
        if (fs.existsSync(keyPath) && fs.statSync(keyPath).isFile()) {
            parsedGoogleKey = JSON.parse(fs.readFileSync(keyPath));
        }
        else {
            parsedGoogleKey = JSON.parse(process.env.GOOGLE_KEY || '{}');
        }
    }
    catch (error) {
        log.error(logPrefix.concat('Google key file not exist, cancel submission. '));
        log.error(logPrefix.concat('Error: \x1b[31m', error.message, '\x1b[39m'));
        return;
    }
    if (proxy !== '') {
        let httpsAgent = (0, https_proxy_agent_1.default)(proxy);
        axios = axios_1.default.create({
            proxy: false,
            httpsAgent
        });
        process.env.HTTPS_PROXY = proxy;
        process.env.HTTP_PROXY = proxy;
    }
    log.info(logPrefix.concat("Start submit urlList to google engine..."));
    const boundary = '===============' + randomRangeNumber(1000000000, 9999999999) + '==';
    let data = '';
    urlArr.slice(0, count).forEach((line) => {
        let body = JSON.stringify({
            url: line,
            type: 'URL_UPDATED',
        });
        data += '\r\n' +
            '--' + boundary + '\n' +
            'Content-Type: application/http \n' +
            'Content-Transfer-Encoding: binary \n' +
            '\r\n' +
            'POST /v3/urlNotifications:publish \n' +
            'Content-Type: application/json \n' +
            'accept: application/json \n' +
            'Content-Length: ' + body.length + '\n' +
            '\r\n' +
            body;
    });
    let tokens = {};
    try {
        const jwtClient = new google_auth_library_1.JWT(parsedGoogleKey.client_email, undefined, parsedGoogleKey.private_key, ["https://www.googleapis.com/auth/indexing"], undefined);
        tokens = yield authorize(jwtClient);
    }
    catch (error) {
        log.error(logPrefix.concat('Submit to google engine authorize error: \x1b[31m', error.message, '\x1b[39m'));
        return;
    }
    try {
        let options = {
            url: 'https://indexing.googleapis.com/batch',
            method: "POST",
            headers: {
                'Content-Type': 'multipart/mixed; boundary="' + boundary + '"',
                'Authorization': 'bearer ' + (tokens === null || tokens === void 0 ? void 0 : tokens.access_token)
            },
            data: data,
            validateStatus: (status) => {
                return status <= 400;
            }
        };
        let response = yield axios.request(options);
        let message = '';
        if (response.status === 200) {
            message = message.concat('success');
        }
        else {
            message = message.concat('failed: [\x1b[31m', response.data.error.message, '\x1b[39m]');
        }
        log.info(logPrefix.concat("Submit to google engine ", message));
    }
    catch (error) {
        log.error(logPrefix.concat('Submit to google engine error: \x1b[31m', error, '\x1b[39m'));
    }
    try {
        let sitemap_options = {
            url: '/ping?sitemap='.concat(url.concat('/', sitemap)),
            baseURL: 'https://www.google.com'
        };
        let response = yield axios.request(sitemap_options);
        if (response.status === 200) {
            log.info(logPrefix.concat("Google Sitemap Notification Received."));
        }
    }
    catch (error) {
        log.error(logPrefix.concat('Submit to google sitmap engine error: \x1b[31m', error.message, '\x1b[39m'));
    }
});
exports.deployer = deployer;
const randomRangeNumber = (minNumber, maxNumber) => {
    let range = maxNumber - minNumber;
    let random = Math.random();
    return minNumber + Math.round(random * range);
};
const authorize = (jwtClient) => {
    return new Promise((resolve, reject) => {
        jwtClient.authorize((err, tokens) => {
            if (err !== null)
                return reject(err);
            resolve(tokens);
        });
    });
};
//# sourceMappingURL=google_deployer.js.map