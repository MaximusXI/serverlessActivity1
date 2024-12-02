import AWS from 'aws-sdk';
import bcrypt  from 'bcryptjs'
import jwt from 'jsonwebtoken'
const dynamoDb = new AWS.DynamoDB.DocumentClient();
const tableName = 'users';
const JWT_SECRET = 'mySuperSecretJWTKey123!@#';
import { v4 as uuidv4 } from 'uuid';
export const handler = async  (event) => {
 
  console.log('event is ');
  console.log(event);
  const token = event.token.split(' ')[1];
  const decoded = jwt.verify(token, "mySuperSecretJWTKey123!@#");
  console.log(decoded);
  
  const params = {
        TableName: 'items',
        Item: {
            email: decoded.email,
            imageId: uuidv4(),
            fileUrl: event.fileUrl,
            uploadedAt: new Date().toISOString()
        }
    };
    try {
        await dynamoDb.put(params).promise();
        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'File metadata saved successfully!' }),
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Error saving file metadata: ' + error.message }),
        };
    }

};
