import * as qiniu from 'qiniu.js';
import * as crypto from "crypto-browserify";
import { qiniuBucketUrl } from "../../config/qiniu-url";

// cache key
let ckeys = new Map();

export const filmyBucket = qiniu.bucket("filmy",{
  url: qiniuBucketUrl ? qiniuBucketUrl : `${location.protocol}//${location.host}`,
});

function getKeys(password: string) {
  return filmyBucket.getFile(`config-${password}.json`)
        .then(body => {
            return body;
        })
        .then(body => JSON.parse(body));
}

filmyBucket.fetchPutToken = function(password: string, key = null, keys: any = null, returnBody: string = null) {
    if (key && !keys && ckeys.has(key)) {

        keys = ckeys.get(key);
    };
  return (keys ? Promise.resolve(keys) : getKeys(password))
          .then(keys => {
              const options: Options = {
                scope: `filmy${key ? ":" + key : ""}`,
                deadline: Math.floor(Date.now() / 1000 + 3000)
              }

              if (returnBody) options.returnBody = returnBody;

              const signture = safeEcode(JSON.stringify(options));

              const encodeDigest = encodeSign(signture,keys.sk);

              const token = `${keys.ak}:${encodeDigest}:${signture}`;

              ckeys.set(key, keys)
              return token;
          })
};

function safeEcode(str: string) {
    return window.btoa(str).replace(/\//g,"_").replace(/\+/g,"-");
}

function encodeSign(str: string, key: string) {
    return crypto.createHmac("sha1",key)
                .update(str)
                .digest("base64")
                .replace(/\//g,"_")
                .replace(/\+/g,"-");
}

interface Options {
    scope: string,
    deadline: number,
    returnBody?: string,
}
