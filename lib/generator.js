'use strict';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const utils_1 = require("./utils/utils");
exports.default = (locals, hexo) => {
    const { config, log, source_dir } = hexo;
    const url_submission = config.url_submission;
    const { type: generatorType, count, urls_path, prefix, ignore } = url_submission;
    log.info(utils_1.projectPrefix.concat("Start generating url list..."));
    let pages = locals.pages.toArray().concat(...locals.posts.toArray());
    let urls = pages.map((post) => {
        return {
            "date": post.updated || post.date,
            "permalink": post.permalink,
            "source": post.source
        };
    }).sort(function (a, b) {
        return b.date - a.date;
    }).slice(0, count).filter((post) => {
        const url = new URL(post.permalink);
        return (prefix.length === 0 ? true : prefix.filter(k => url.pathname.startsWith(k)).length > 0)
            && (ignore.length === 0 ? true : ignore.filter(k => (0, utils_1.isMatchUrl)(url.pathname, k)).length === 0);
    });
    if ('latest' === generatorType) {
        try {
            urls = urls.filter((post) => {
                const pageFile = fs_1.default.statSync(path_1.default.join(source_dir, post.source));
                return new Date(pageFile.mtime).setHours(0, 0, 0, 0) === new Date().setHours(0, 0, 0, 0);
            });
        }
        catch (error) {
            log.error(utils_1.projectPrefix.concat("Read file meta failed, error is: ", error.message));
            return { path: '', data: '' };
        }
    }
    let urlsMap = urls.map(post => post.permalink).join('\n');
    if (urls.length > 0) {
        log.info(utils_1.projectPrefix.concat("Page urls will generate into file named \x1b[90m" + urls_path + "\x1b[39m"));
    }
    else {
        log.info(utils_1.projectPrefix.concat("No matching pages found!"));
        return { path: '', data: '' };
    }
    return {
        path: urls_path,
        data: urlsMap
    };
};
//# sourceMappingURL=generator.js.map