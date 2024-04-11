import React, { useState } from 'react';

//import * as Papa from 'papaparse';

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
  
      const jsonData = [];
  
      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(','); // Розділяємо рядок на значення за комами
  
        if (values.length === 5) { // Перевіряємо, чи кількість значень в рядку відповідає очікуваній кількості полів
          const contact = {
            Name: values[0],
            DateOfBirth: values[1] ? new Date(values[1]) : null,
            Married: values[2] === 'true',
            Phone: values[3],
            Salary: parseFloat(values[4])
          };
  
          jsonData.push(contact);
        } else {
          console.error('Invalid data format at line', i + 1);
        }
      }
  
      if (jsonData.length > 0) {
        await sendJsonDataToApi(jsonData);
      } else {
        console.error('No valid data found in the file');
      }
    };
  
    reader.onerror = (e) => {
      console.error('Error reading file:', e.target.error);
    };
  
    reader.readAsText(selectedFile);
  };
  

  
  

  const sendJsonDataToApi = async (data) => {
    try {
      console.log(data)
      const response = await fetch('https://localhost:44386/api/Contacts/csv/', {
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
      //console.log(error);
      //console.error('Error sending JSON data to API:', error);
    }
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
    </div>
  );
};

export default FileUploader;
