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
const utils_1 = require("./utils/utils");
const deployer = (args) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { config, log } = args;
    const { url_submission, url } = config;
    const { urlArr, count: baseCount } = url_submission;
    let { token, count } = (_a = url_submission.channels) === null || _a === void 0 ? void 0 : _a.bing;
    token = token || process.env.BING_TOKEN;
    const defaultQuota = 500;
    axios_1.default.defaults.timeout = utils_1.defaultTimeOut;
    const logPrefix = utils_1.projectPrefix.concat('(\x1b[3mbing\x1b[23m) ');
    if (count === undefined) {
        log.info(logPrefix.concat("The number of submitted entries for Bing Search is not set. Continue to detect the remaining quota or the default value will be used for submission."));
    }
    count = count || baseCount;
    axios_1.default.defaults.withCredentials = true;
    try {
        let response = yield axios_1.default.create().request({
            url: "/webmaster/api.svc/json/GetUrlSubmissionQuota?siteUrl=" + url + "&apikey=" + token,
            baseURL: 'https://ssl.bing.com',
            method: 'GET',
            validateStatus: (status) => { return status === 200; }
        });
        const respJson = response.data;
        const { DailyQuota, MonthlyQuota } = respJson === null || respJson === void 0 ? void 0 : respJson.d;
        let daliyQuota = ''.concat(`\x1b[3${DailyQuota >= urlArr.length ? '2' : '1'}m`, DailyQuota, '\x1b[39m');
        let monthlyQuota = ''.concat(`\x1b[3${MonthlyQuota >= urlArr.length ? '2' : '1'}m`, MonthlyQuota, '\x1b[39m');
        log.info(logPrefix.concat(`Get bing engine remain, [daliy: ${daliyQuota}, monthly: ${monthlyQuota}]`));
        count = Math.min(count, baseCount, DailyQuota, urlArr.length, defaultQuota);
    }
    catch (error) {
        log.error(logPrefix.concat('Get remain for bing engine error: \x1b[31m', error, '\x1b[39m'));
    }
    if (count === 0) {
        log.warn(logPrefix.concat('The submission quota of this website has been exhausted, cancel submission.'));
        return;
    }
    log.warn(logPrefix.concat('The number of entries submitted by Bing Search has been set to \x1b[1m', count, '\x1b[22m'));
    let urlArray = urlArr.slice(0, count);
    log.info(logPrefix.concat("Start submit urlList to bing engine..."));
    try {
        let response = yield axios_1.default.create().request({
            url: "/webmaster/api.svc/json/SubmitUrlbatch?apikey=" + token,
            baseURL: 'https://ssl.bing.com',
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            data: {
                "siteUrl": url,
                "urlList": urlArray
            },
            validateStatus: function (status) {
                return status <= 400;
            }
        });
        let message = '';
        const respJson = response.data;
        if (response.status === 200) {
            message = message.concat('success.');
        }
        else {
            message = message.concat('failed: \x1b[31m', respJson === null || respJson === void 0 ? void 0 : respJson.Message, '\x1b[39m');
        }
        log.info(logPrefix.concat("Submit to bing engine ", message));
    }
    catch (error) {
        log.error(logPrefix.concat('Submit to bing engine error: \x1b[31m', error.message, '\x1b[39m'));
    }
});
exports.deployer = deployer;
const formatError = (errorCode) => {
    switch (errorCode) {
        case 12:
            return 'AlreadyExists';
        case 16:
            return 'Deprecated';
        case 1:
            return 'InternalError';
        case 3:
            return 'InvalidApiKey';
        case 8:
            return 'InvalidParameter';
        case 7:
            return 'InvalidUrl';
        case 0:
            return 'None';
        case 13:
            return 'NotAllowed';
        case 14:
            return 'NotAuthorized';
        case 11:
            return 'NotFound';
        case 5:
            return 'ThrottleHost';
        case 4:
            return 'ThrottleUser';
        case 9:
            return 'TooManySites';
        case 15:
            return 'UnexpectedState';
        case 6:
            return 'UserBlocked';
        case 10:
            return 'UserNotFound';
        default:
        case 2:
            return 'UnknownError';
    }
};
//# sourceMappingURL=bing_deployer.js.map