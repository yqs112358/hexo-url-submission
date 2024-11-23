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
    const { urlList, urlArr, count: baseCount } = url_submission;
    let { token, count } = (_a = url_submission.channels) === null || _a === void 0 ? void 0 : _a.baidu;
    token = token || process.env.BAIDU_TOKEN;
    const logPrefix = utils_1.projectPrefix.concat('(\x1b[3mbaidu\x1b[23m) ');
    axios_1.default.defaults.timeout = utils_1.defaultTimeOut;
    if (count === undefined) {
        log.info(logPrefix.concat("The number of submitted entries for Baidu Search is not set, and the default value will be used for submission."));
    }
    count = Math.min(count || baseCount, urlArr.length);
    log.warn(logPrefix.concat('The number of entries submitted by Baidu Search has been set to \x1b[1m', String(count), '\x1b[22m'));
    log.info(logPrefix.concat("Start submit urlList to baidu engine..."));
    const target = "/urls?site=" + url + "&token=" + token;
    try {
        let response = yield axios_1.default.create().request({
            url: target,
            method: 'POST',
            baseURL: 'http://data.zz.baidu.com',
            headers: {
                'Content-type': 'text/plain'
            },
            data: urlList
        });
        let message = '';
        const respJson = response.data;
        if (response.status === 200) {
            const { remain } = respJson;
            let quota = ''.concat(`\x1b[3${remain >= urlArr.length ? '2' : '1'}m`, remain, '\x1b[39m');
            message = message.concat('success: [success: \x1b[32m', respJson.success, '\x1b[39m, remain: ', quota);
        }
        else {
            message = message.concat('failed: [', respJson.message);
        }
        log.info(logPrefix.concat("Submit to baidu engine ", message, ']'));
    }
    catch (error) {
        log.error(logPrefix.concat('Submit to baidu engine error: [', error.message, ']'));
    }
});
exports.deployer = deployer;
//# sourceMappingURL=baidu_deployer.js.map