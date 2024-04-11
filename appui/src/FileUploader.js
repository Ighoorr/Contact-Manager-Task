import React, { useState } from 'react';


const FileUploader = () => {
  const [file, setFile] = useState(null);

  const handleFileChange = async (event) => {
    const selectedFile = event.target.files[0];
  
    if (!selectedFile) {
      console.error('No file selected');
      return;
    }
  
    const reader = new FileReader();
  
    reader.onload = async (e) => {
      const text = e.target.result;
      const lines = text.split('\n'); // Розділяємо текст на рядки
  
      const jsonData = lines.map(line => {
        const values = line.split(','); // Розділяємо рядок на значення за комами
        return {
          Name: values[0],
          DateOfBirth: values[1],
          Married: values[2] === 'true' ? true : false,
          Phone: values[3],
          Salary: parseFloat(values[4])
        };
      });
  
      await sendJsonDataToApi(jsonData);
    };
  
    reader.onerror = (e) => {
      console.error('Error reading file:', e.target.error);
    };
  
    reader.readAsText(selectedFile);
  };
  
  

  const sendJsonDataToApi = async (data) => {
    try {
      const response = await fetch('http://your-api-url.com/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
  
      const responseData = await response.json();
      console.log(responseData); // Опрацьовуємо відповідь сервера
    } catch (error) {
      console.error('Error sending JSON data to API:', error);
    }
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
    </div>
  );
};

export default FileUploader;
