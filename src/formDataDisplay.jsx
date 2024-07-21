import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './formDataDisplay.css'
import { useRef } from 'react';
const FormDataDisplay = () => {
  const [formData, setFormData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [invisible,setVisible] = useState(true)
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://backend-1s67.onrender.com/api/form/all');
        setFormData(response.data);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

    const inputRef = useRef(null);
  
    const handleButtonClick = () => {
      console.log(inputRef.current.value);
      if(inputRef.current.value == "admin"){
        setVisible(false)

      }
    };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }
  return (
    <div className="gaming-form-data">
      {invisible ? (
        <>
        <div className="row">
          <h2>Authentication</h2>
          <label htmlFor="password">Password</label>
          <input type="password" ref={inputRef} name="password" id="password" />
          <button onClick={handleButtonClick}>Submit</button>
          </div>
        </>
      ) : (
        <>
          <h2>Database</h2>
          <ul>
            {formData.map((item) => (
              <li key={item._id}>
                <div className="table-row">
                  <p><span className="label">Email:</span> {item.email}</p>
                  <p><span className="label">Name:</span> {item.name}</p>
                  <p><span className="label">Number:</span> {item.number}</p>
                  <p><span className="label">Country:</span> {item.country}</p>
                  <p><span className="label">City:</span> {item.city}</p>
                </div>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
  
};

export default FormDataDisplay;
