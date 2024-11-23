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
const deployer_1 = __importDefault(require("./utils/deployer"));
const generator_1 = __importDefault(require("./generator"));
hexo.config.url_submission = Object.assign({
    enable: true,
    type: 'all',
    prefix: ['post'],
    ignore: [],
    channels: {},
    count: 100,
    proxy: '',
    urls_path: 'submit_url.txt',
    sitemap: 'sitemap.xml'
}, hexo.config.url_submission);
const pluginConfig = hexo.config.url_submission;
if (pluginConfig === null || pluginConfig === void 0 ? void 0 : pluginConfig.enable) {
    hexo.extend.generator.register('submission_generator', (locals) => {
        return (0, generator_1.default)(locals, hexo);
    });
    hexo.extend.deployer.register('url_submission', (args) => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, deployer_1.default)(hexo);
    }));
}
//# sourceMappingURL=index.js.map