// ImageForm.js
import React, { useState } from 'react';

const ImageForm = () => {
  const [image, setImage] = useState(null);

  const handleImageChange = (event) => {
    setImage(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append('photo', image);
    console.log(formData)
    try {
      const response = await fetch('http://127.0.0.1:8000/profile/', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Response:', data);
        // Handle success, e.g., show a success message or redirect
      } else {
        console.error('Error uploading image:', response.statusText);
        // Handle error, e.g., show an error message
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      // Handle other types of errors
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="image">Choose an image:</label>
      <input type="file" id="image" onChange={handleImageChange} accept="image/*" />
      <button type="submit">Upload</button>
    </form>
  );
};

export default ImageForm;
