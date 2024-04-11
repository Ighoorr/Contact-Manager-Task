import React, { useState, useEffect } from 'react';
function ContactsTable() {
  const [contacts, setContacts] = useState([]);
  const [filter, setFilter] = useState('');
  const [sortBy, setSortBy] = useState(null);
  const [sortAsc, setSortAsc] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch('https://localhost:44386/api/Contacts/');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setContacts(data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortBy(field);
      setSortAsc(true);
    }
  };

  const handleEdit = (id, updatedContact) => {
    if (!validateContact(updatedContact)) {
      alert('Invalid format');
      return;
    }
    
    fetch(`https://localhost:44386/api/Contacts/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedContact),
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        setContacts(contacts.map(contact => {
          if (contact.id === id) {
            return { ...contact, ...updatedContact };
          }
          return contact;
        }));
      })
      .catch(error => {
        console.error('Error updating contact:', error);
      });
  };
  

  const handleDelete = (id) => {
    fetch(`https://localhost:44386/api/Contacts/${id}`, {
      method: 'DELETE',
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        setContacts(contacts.filter(contact => contact.id !== id));
      })
      .catch(error => {
        console.error('Error deleting contact:', error);
      });
  };
  const sortedContacts = contacts.sort((a, b) => {
    if (sortBy) {
      const fieldA = typeof a[sortBy] === 'string' ? a[sortBy].toLowerCase() : a[sortBy];
      const fieldB = typeof b[sortBy] === 'string' ? b[sortBy].toLowerCase() : b[sortBy];
      if (fieldA < fieldB) {
        return sortAsc ? -1 : 1;
      }
      if (fieldA > fieldB) {
        return sortAsc ? 1 : -1;
      }
      return 0;
    }
    return 0;
  });

  const filteredContacts = sortedContacts.filter(contact => {
    return (
      contact.name.toLowerCase().includes(filter.toLowerCase()) ||
      contact.dateOfBirth.toLowerCase().includes(filter.toLowerCase()) ||
      (contact.married ? 'Yes' : 'No').toLowerCase().includes(filter.toLowerCase()) ||
      contact.phone.toLowerCase().includes(filter.toLowerCase()) ||
      contact.salary.toString().toLowerCase().includes(filter.toLowerCase())
    );
  });
  const validateContact = (contact) => {
    if (!contact.name || !contact.dateOfBirth || !contact.phone || !contact.salary) {
      console.error('All fields are required');
      return false;
    }
      const phoneRegEx = /^\d{10}$/;
    if (!contact.phone.match(phoneRegEx)) {
      console.error('Invalid phone number:', contact.phone);
      return false;
    }
      if (isNaN(contact.salary)) {
      console.error('Invalid salary:', contact.salary);
      return false;
    }
      return true;
  };
 

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Contacts</h2>
      <input className="form-control mb-4" type="text" value={filter} onChange={handleFilterChange} placeholder="Filter contacts..." />
      <table className="table">
        <thead>
          <tr>
            <th onClick={() => handleSort('name')}>Name</th>
            <th onClick={() => handleSort('dateOfBirth')}>Date of Birth</th>
            <th onClick={() => handleSort('married')}>Married</th>
            <th onClick={() => handleSort('phone')}>Phone</th>
            <th onClick={() => handleSort('salary')}>Salary</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredContacts.map(contact => (
            <tr key={contact.id}>
              <td contentEditable suppressContentEditableWarning={true} onBlur={(e) => handleEdit(contact.id, { ...contact, name: e.target.innerText })}>{contact.name}</td>
              <td contentEditable suppressContentEditableWarning={true} onBlur={(e) => handleEdit(contact.id, { ...contact, dateOfBirth: e.target.innerText })}>{contact.dateOfBirth}</td>
              <td contentEditable suppressContentEditableWarning={true} onBlur={(e) => handleEdit(contact.id, { ...contact, married: e.target.innerText.toLowerCase() === 'yes' ? true : false })}>{contact.married ? 'Yes' : 'No'}</td>
              <td contentEditable suppressContentEditableWarning={true} onBlur={(e) => handleEdit(contact.id, { ...contact, phone: e.target.innerText })}>{contact.phone}</td>
              <td contentEditable suppressContentEditableWarning={true} onBlur={(e) => handleEdit(contact.id, { ...contact, salary: e.target.innerText })}>{contact.salary}</td>
              <td>
                <button className="btn btn-danger" onClick={() => handleDelete(contact.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div id="myBlock">
     
       <p>ЩОБ СОРТУВАТИ ТРЕБА НАЖАТИ ПО НАЗВІ КОЛОНКИ</p>
       <p>після завантаження даних треба оновити</p>
  
      </div>
    </div>
    
  );
  

}

export default ContactsTable;




