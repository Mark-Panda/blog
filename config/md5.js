/**
 * Created by simple on 2018/11/16.
 */

var crypto = require('crypto');
function encodeings(pw) {
    console.log('开始加密');
    var md5 = crypto.createHash('md5');
    md5.update(pw);
    var pwd = md5.digest('hex');
    return pwd
}
module.exports = encodeings
