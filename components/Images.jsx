import { useEffect, useState } from 'react';
import axios from 'axios';

export default function Images() {
  const [images, setImages] = useState([]);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const token = localStorage.getItem('jwtToken');
        const response = await axios.post('https://uko8r49c8d.execute-api.us-east-1.amazonaws.com/Dev/fetchImages',
            {
                token: `Bearer ${token}`
            });
        const parsedData = JSON.parse(response.data.body); // Parse the body
        setImages(parsedData);  // Set the parsed response
      } catch (error) {
        alert('Error: ' + error.message);
      }
    };
    fetchImages();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-xl w-full">
        <h2 className="text-2xl font-bold mb-4">Your Uploaded Images</h2>
        <div className="grid grid-cols-2 gap-4">
          {images.map((image) => (
            <img
              key={image.imageId}
              src={image.fileUrl} // Use fileUrl from the response
              alt="Uploaded"
              className="w-full h-40 object-cover"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
