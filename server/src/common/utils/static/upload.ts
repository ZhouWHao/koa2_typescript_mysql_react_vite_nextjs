import qiniu from "qiniu";
import sharp from "sharp";
import sync from "@/common/utils/sync";
import zone from "./utils/zone";
import Mac from "./utils/Mac";
process.env.VIPS_DISC_THRESHOLD = "750m";

let config = new qiniu.conf.Config({
  zone: zone,
});

let bucket = process.env.OSS_NAME;

/**
 * 将文件上传至七牛云
 * @params buffer {Buffer} 上传图片的Buffer
 * @params fileName {[folder,file_name]} [上传的文件夹,上传的文件名]
 * @return {file_name文件夹名称 file_href文件访问路径}
 * @return mes {string} 错误提示
 */
async function upload(
  buffer: Buffer,
  fileName: [string, string]
): Promise<{ file_name: string; file_href: string } | string> {
  let options = {
    scope: bucket,
  };
  let putPolicy = new qiniu.rs.PutPolicy(options);
  let uploadToken = putPolicy.uploadToken(Mac);
  let formUploader = new qiniu.form_up.FormUploader(config);
  let putExtra = new qiniu.form_up.PutExtra();

  return (await sync((resolve, reject) => {
    sharp(buffer, { animated: true })
      .webp({ lossless: true, quality: 80 })
      .toBuffer()
      .then(data => {
        formUploader.put(
          uploadToken,
          fileName.join("/"),
          data, //处理后的buffer
          putExtra,
          function (respErr, respBody, respInfo) {
            if (respErr) {
              reject(respErr);
              return;
            }
            if (respInfo.statusCode == 200) {
              resolve({
                file_name: respBody.key.replace(`${fileName[0]}/`, ""),
                file_href: `${process.env.CDN}/${respBody.key}`,
              });
            } else {
              reject("图片上传错误");
            }
          }
        );
      })
      .catch(err => {
        console.log('图片压缩错误报错原因',err);
        reject("图片压缩错误");
      });
  })) as Promise<string | { file_name: string; file_href: string }>;
}
export default upload;
