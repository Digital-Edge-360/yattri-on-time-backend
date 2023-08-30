const fs = require('fs')
const S3 = require('aws-sdk/clients/s3')

const bucketName = process.env.AWS_BUCKET_NAME
const region = process.env.AWS_BUCKET_REGION
const accessKeyId = process.env.AWS_BUCKET_ACCESS_KEY
const secretAccessKey = process.env.AWS_BUCKET_SECRET_KEY

const s3 = new S3({
  region,
  accessKeyId,
  secretAccessKey
})

// uploads a file to s3
function uploadFile(file) {

  // creating fileStream
  const fileStream = fs.createReadStream(file.path)
 
  // creating uploading param
  const uploadParams = {
    Bucket: bucketName,
    Body: fileStream,
    Key: file.filename,
    ContentType:file.mimetype,
  }

  // returning results after uploading to the bucket
  return s3.upload(uploadParams).promise()
}

// downloads a file from s3
function getFileStream(fileKey) {
    const downloadParams = {
      Key: fileKey,
      Bucket: bucketName
    }
  
    return s3.getObject(downloadParams).createReadStream()
  }
  



function deleteFile(addverisement){

    const imagePath = addverisement.image;

    const objectKey = imagePath.split("/")[3];

    const deleteParams = {
        Bucket: bucketName,
        Key: objectKey
    }

    return s3.deleteObject(deleteParams).promise();

}



function updateObjected(addverisement){

}


module.exports = {
    uploadFile,
    getFileStream,
    deleteFile
}