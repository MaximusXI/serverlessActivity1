import AWS from 'aws-sdk';
import bcrypt  from 'bcryptjs'
const dynamo = new AWS.DynamoDB.DocumentClient();
const tableName = 'users';
export const handler = async (event) => {
  console.log('event is:');
  console.log(event);
    const email  = event.email;
  const password  = event.password;
  
  try {
        // Check if user already exists
        const params = {
            TableName: tableName,
            Key: { email: email },
        };

        const result = await dynamo.get(params).promise();

        if (result.Item) {
            // User already exists
            return {
                statusCode: 400,
                body: JSON.stringify({ message: "User already registered" }),
            };
        }
  }catch(error) {
    return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
  }
  
  
  
  const hashedPassword = await bcrypt.hash(password, 5);
  const params2 = {
    TableName: tableName,
    Item: { email, passwordHash: hashedPassword }
  };
  try {
    await dynamo.put(params2).promise();
    return { statusCode: 200, body: JSON.stringify({ message: 'User registered successfully' }) };
  } catch (error) {
    return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
  }
};
