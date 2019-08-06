import qiniu from 'qiniu';
import { qiniuConfig } from '../config/constant';

// const qiniu = require('qiniu');
// const { qiniuConfig } = require('../localConfig');

const mac = new qiniu.auth.digest.Mac(qiniuConfig.AK, qiniuConfig.SK);

const putPolicy = new qiniu.rs.PutPolicy({
  scope: qiniuConfig.bucket,
  expires: 7200
});

const uploadToken = putPolicy.uploadToken(mac);

const config = new qiniu.conf.Config();

const formUploader = new qiniu.form_up.FormUploader(config);

const putExtra = new qiniu.form_up.PutExtra();

const uploadToQiniu = (fileName, filePath) => {
  return new Promise((resolve, reject) => {
    formUploader.putFile(uploadToken, fileName, filePath, putExtra, (err, body, info) => {
      if (err) {
        console.log(err);
        reject(err);
      }
      if (info.statusCode === 200) {
        console.log(body);
        resolve(body);
      } else {
        console.log(info);
        console.log(body);
      }
    });

  });
};

export default uploadToQiniu;