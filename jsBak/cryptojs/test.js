// 传统的script引入的使用方式
// 需要使用aes的方法，和ecb的格式
// <script type="text/javascript" src="$!{imageServer}/static/js/vendor/cryptojs/aes.js"></script>
// <script type="text/javascript" src="$!{imageServer}/static/js/vendor/cryptojs/mode-ecb-min.js"></script>


var AES_Key = CryptoJS.enc.Utf8.parse('1234567890123456');
var APPID = 'ibeidiao_0571';
// AES加密
function AESencrypt(text) {
  var textUtf8 = CryptoJS.enc.Utf8.parse(text);
  var encrypted = CryptoJS.AES.encrypt(textUtf8,AES_Key,{
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7
  });
  return encrypted.ciphertext.toString();
}
// AES解密
function AESdecrypt(text) {
  var encryptedHexStr = CryptoJS.enc.Hex.parse(text);
  var srcs = CryptoJS.enc.Base64.stringify(encryptedHexStr);
  var decrypted = CryptoJS.AES.decrypt(srcs,AES_Key, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7
  });
  return decrypted;
}
// AES解密成utf8(汉字)
function AESdecryptToUtf8(text) {
  return CryptoJS.enc.Utf8.stringify(AESdecrypt(text));
}
// AES解密成base64
function AESdecryptToBase64(text) {
  return CryptoJS.enc.Base64.stringify(AESdecrypt(text));
}
// 加密成MD5
function MD5(text) {
  return CryptoJS.MD5(text).toString();
}
// 按照字典项对key值排序
function sortASCII(param) {
  var sortArr = Object.keys(param).sort(), _param = {};
  sortArr.forEach((key) => {
    _param[key] = param[key];
  })
  return _param;
}