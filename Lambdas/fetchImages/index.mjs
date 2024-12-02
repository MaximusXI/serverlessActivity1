import AWS from 'aws-sdk';
import jwt from 'jsonwebtoken'
const dynamoDb = new AWS.DynamoDB.DocumentClient();

export const handler = async (event) => {
  console.log('event is ');
  console.log(event);
  const token = event.token.split(' ')[1];
  const decoded = jwt.verify(token, "mySuperSecretJWTKey123!@#");
  console.log(decoded);
  const params = {
        TableName: 'items',
        KeyConditionExpression: 'email = :email',
        ExpressionAttributeValues: {
            ':email': decoded.email 
        }
    };
    try {
        const result = await dynamoDb.query(params).promise();
        return {
            statusCode: 200,
            body: JSON.stringify(result.Items),
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Error fetching user files: ' + error.message }),
        };
    }
};
