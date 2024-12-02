import AWS from 'aws-sdk';
const s3 = new AWS.S3();
const bucketName = 'activity1bucket';
export const handler = async (event) => {
  console.log('THe eventy is:');
  console.log(event);
  const contentType = event.contentType || 'image/jpeg';
  if (!contentType.startsWith('image/')) {
    return { 
      statusCode: 400, 
      body: JSON.stringify({ error: 'Only image uploads are allowed.' }) 
    };
  }
  const params = {
    Bucket: bucketName,
    Key: `${Date.now()}`,
    Expires: 6000,
    ContentType: contentType
  };
  try {
    const url = s3.getSignedUrl('putObject', params);
    return { statusCode: 200, body: JSON.stringify(url) };
  } catch (error) {
    return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
  }
  
};
