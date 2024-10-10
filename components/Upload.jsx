import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; 
export default function Upload() {
  const [file, setFile] = useState(null);
  const navigate = useNavigate();
  const handleUpload = async () => {
    try {
        const token = localStorage.getItem('jwtToken');
        const presignedUrlResponse  = await axios.post('https://uko8r49c8d.execute-api.us-east-1.amazonaws.com/Dev/preurl',{},{
            headers:{
                'Authorization':`Bearer ${token}`
            }
        }); 
      const responseBody = JSON.parse(presignedUrlResponse.data.body);
      console.log(responseBody);
      const presignedUrl = responseBody.split('?')[0];
      console.log('Link is :'+presignedUrl)
      const uploadResponse = await axios.put(responseBody, file,{
        headers:{
            'Content-Type': file.type,
            //'Authorization' : `Bearer ${token}`
        }
      });
      //alert('File uploaded successfully!');

      if (uploadResponse.status === 200) {
        // Upload file info to DynamoDB
        await axios.post('https://uko8r49c8d.execute-api.us-east-1.amazonaws.com/Dev/uploadmetadata', {
          //email: userEmail, // Store the user's email with the file
          filename: file.name, // Store the file name
          fileUrl: presignedUrl, // Store the pre-signed URL or S3 path
          token: `Bearer ${token}`
        }, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        alert('File uploaded successfully!');
        //fetchUserFiles(); // Refresh the list of user files
      }


    } catch (error) {
      alert('Error: ' + error.message);
    }
  };

  const handleSignOut = () => {
    localStorage.removeItem('jwtToken'); // Clear the token
    navigate('/login'); // Navigate to the login page
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navigation Bar */}
      <nav className="bg-white shadow-lg p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-700">Image Upload</h1>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            onClick={() => navigate('/gallery')} // navigate to gallery page
          >
            Go to Gallery
          </button>
          <button
              className="bg-red-500 text-black px-4 py-2 rounded hover:bg-red-600"
              onClick={handleSignOut} // sign out action
            >
              Sign Out
            </button>
        </div>
      </nav>

      {/* Upload Section */}
      <div className="flex items-center justify-center mt-10">
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm">
          <h2 className="text-2xl font-bold mb-4">Upload Image</h2>
          <input
            type="file"
            className="w-full p-2 border border-gray-300 rounded"
            onChange={(e) => setFile(e.target.files[0])}
          />
          <button
            className="w-full bg-green-500 hover:bg-green-600 text-white p-2 mt-4 rounded"
            onClick={handleUpload}
          >
            Upload
          </button>
        </div>
      </div>
    </div>
  );
}
