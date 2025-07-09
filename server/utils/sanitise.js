// Regex: any whitespace (incl. NBSP)  OR  any emoji / pictograph
const noWsEmojiRE =
    /[\s\u00A0]|\p{Emoji_Presentation}|\p{Extended_Pictographic}/u;

exports.clean     = (str = "") => str.replace(/\s+/g, ""); // remove all spaces
exports.isInvalid = (str = "") => noWsEmojiRE.test(str);
exports.noWsEmojiRE = noWsEmojiRE;        // front-end can import this too
