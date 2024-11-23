"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.queue = exports.isMatchUrl = exports.readFileSync = exports.defaultTimeOut = exports.projectPrefix = void 0;
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
exports.projectPrefix = 'url_submission: ';
exports.defaultTimeOut = 2000;
const readFileSync = (publicDir, filePath) => {
    return fs_1.default.readFileSync(path_1.default.join(publicDir, filePath), 'utf8');
};
exports.readFileSync = readFileSync;
const isMatchUrl = (s, p) => {
    if (s === p)
        return true;
    const words = p.split(/\*+/g);
    if (words.length === 2 && words[0] === "" && words[1] === "") {
        return true;
    }
    if (words.length === 1 || (words.length === 2 && (words[0] === "" || words[1] === ""))) {
        return _check_regular(s, p);
    }
    if (!_check_includes(s, p))
        return false;
    if (words.length >= 2) {
        return _check_fixs(s, words);
    }
    return false;
};
exports.isMatchUrl = isMatchUrl;
const _check_includes = (s, p) => {
    const words = Array.from(new Set(p.split(/\?|\*+/g).filter(Boolean)));
    if (words.some((word) => {
        return !s.includes(word);
    })) {
        return false;
    }
    return true;
};
const _check_fixs = (s, words) => {
    if (words.length >= 2) {
        const prefix = words[0];
        const suffix = words[words.length - 1];
        let str = s;
        if (suffix) {
            const matched = str.match(new RegExp(`^(.*?)${suffix.replaceAll("?", ".")}$`));
            if (!matched)
                return false;
            str = matched[1];
        }
        if (prefix) {
            const matched = str.match(new RegExp(`^${prefix.replaceAll("?", ".")}(.*?)$`));
            if (!matched)
                return false;
            str = matched[1];
        }
        const rest = words.slice(1, words.length - 1);
        return _check_words(str, rest);
    }
    return false;
};
const _check_regular = (s, p) => {
    return new RegExp("^" + p.replaceAll("?", ".").replaceAll(/\*+/g, '.*') + "$", "g").test(s);
};
const _check_words = (s, words) => {
    if (words.length === 0)
        return true;
    const mid_index = words.reduce((a, v, i) => (v.length > words[a].length ? i : a), Math.floor(words.length / 2));
    const middle = words[mid_index];
    const matched_array = Array.from(s.matchAll(new RegExp(`${middle.replaceAll("?", ".")}`, "g")));
    if (!matched_array.length)
        return false;
    matched_array.sort(() => Math.random() - 0.5);
    const first_half = words.slice(0, mid_index);
    const second_half = words.slice(mid_index + 1);
    return matched_array.some((matched) => {
        const length = matched[0].length;
        if ("number" !== typeof matched.index)
            return false;
        const left = s.slice(0, matched.index);
        const right = s.slice(matched.index + length);
        return _check_words(left, first_half) && _check_words(right, second_half);
    });
};
const queue = (arr) => {
    let sequence = Promise.resolve();
    arr.forEach((item) => {
        sequence = sequence.then(item);
    });
    return sequence;
};
exports.queue = queue;
//# sourceMappingURL=utils.js.map