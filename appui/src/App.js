import logo from './logo.svg';
import './App.css';
import React, { Component }  from 'react';
import FileUploader from './FileUploader';
import ContactsTable from './ContactsTable';

function App() {
  return (
    <div className="App">
      
      <FileUploader />
      <ContactsTable />
    </div>
  );
}

export default App;
