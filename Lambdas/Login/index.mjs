import AWS from 'aws-sdk';
import bcrypt  from 'bcryptjs'
import jwt from 'jsonwebtoken'
const dynamo = new AWS.DynamoDB.DocumentClient();
const tableName = 'users';
const JWT_SECRET = 'mySuperSecretJWTKey123!@#';
export const handler = async (event) => {
  console.log('event is:');
  console.log(event);
    const email  = event.email;
  const password  = event.password;
  const params = {
    TableName: tableName,
    Key: { email },
  };
  
  
  try {
    const user = await dynamo.get(params).promise();
    if (!user.Item) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Invalid credentials' }),
      };
    }

    const validPassword = await bcrypt.compare(password, user.Item.passwordHash);
    if (!validPassword) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Invalid credentials' }),
      };
    }

    // Generate JWT token
    const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: '1h' });

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Login successful', token }),
    };
  } catch (error) {
    console.error('Error in Login Lambda:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal server error' }),
    };
  }
};
