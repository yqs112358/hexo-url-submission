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
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("./utils");
exports.default = (hexo) => __awaiter(void 0, void 0, void 0, function* () {
    let pluginConfig = hexo.config.url_submission;
    if (Object.keys(pluginConfig === null || pluginConfig === void 0 ? void 0 : pluginConfig.channels).length !== 0) {
        try {
            pluginConfig.urlList = (0, utils_1.readFileSync)(hexo.public_dir, pluginConfig === null || pluginConfig === void 0 ? void 0 : pluginConfig.urls_path);
            pluginConfig.urlArr = pluginConfig.urlList.split(/[(\r\n)\r\n]+/);
        }
        catch (error) {
            hexo.log.error(utils_1.projectPrefix.concat('Extract url file failed. Cancel inclusion submission...'));
            return;
        }
    }
    for (let channel in pluginConfig === null || pluginConfig === void 0 ? void 0 : pluginConfig.channels) {
        let filePath = `./../${channel}_deployer.js`;
        try {
            yield (yield Promise.resolve(`${filePath}`).then(s => __importStar(require(s)))).deployer(hexo);
        }
        catch (error) {
            hexo.log.error(utils_1.projectPrefix.concat(`\x1b[31mParsing error, submission channel named \x1b[1m${channel}\x1b[22m does not support.\x1b[39m`));
        }
    }
});
//# sourceMappingURL=deployer.js.map