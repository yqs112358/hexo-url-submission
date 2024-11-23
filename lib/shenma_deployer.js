"use strict";
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
const axios_1 = __importDefault(require("axios"));
const url_1 = __importDefault(require("url"));
const utils_1 = require("./utils/utils");
const deployer = (args) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { config, log } = args;
    const { url_submission, url } = config;
    const { urlList, urlArr, count: baseCount } = url_submission;
    let { user, token, count } = (_a = url_submission.channels) === null || _a === void 0 ? void 0 : _a.shenma;
    token = token || process.env.SHENMA_TOKEN;
    const logPrefix = utils_1.projectPrefix.concat('(\x1b[3mshenma\x1b[23m) ');
    axios_1.default.defaults.timeout = utils_1.defaultTimeOut;
    if (count === undefined) {
        log.info(logPrefix.concat("The number of submitted entries for ShenMa Search is not set, and the default value will be used for submission."));
    }
    user = user || process.env.SHENMA_USER;
    count = Math.min(count || baseCount, urlArr.length);
    log.warn(logPrefix.concat('The number of entries submitted by ShenMa Search has been set to \x1b[1m', String(count), '\x1b[22m'));
    if (typeof (user) !== 'string' || typeof (token) !== 'string') {
        log.warn(logPrefix.concat("Shenme engine config check invalid, cancel submission."));
        return;
    }
    log.info(logPrefix.concat("Start submit urlList to shenma engine..."));
    const target = "/push?site=" + url_1.default.parse(url).host + "&user_name=" + user + "&resource_name=mip_add&token=" + token;
    try {
        let response = yield axios_1.default.create().request({
            url: target,
            baseURL: 'https://data.zhanzhang.sm.cn',
            method: 'POST',
            headers: {
                'Content-type': 'text/plain'
            },
            data: urlList
        });
        let message = '';
        const respJson = response.data;
        if (response.status === 200) {
            switch (respJson.returnCode) {
                case 200:
                    message = message.concat('success.');
                    break;
                default:
                    message = message.concat('failed: [\x1b[31m', respJson.errorMsg, '\x1b[39m]');
            }
        }
        else {
            message = message.concat('failed: [\x1b[31m shenme submission server is down! \x1b[39m]');
        }
        log.info(logPrefix.concat("Submit to shenma engine ", message));
    }
    catch (error) {
        log.error(logPrefix.concat('Submit to shenma engine error: [\x1b[31m', error, '\x1b[39m]'));
    }
});
exports.deployer = deployer;
//# sourceMappingURL=shenma_deployer.js.map