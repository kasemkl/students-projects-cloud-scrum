// MyComponent.jsx
import React, { useEffect, useState } from 'react';
import Card from './Card';
import '../styles/projectslist.css';
import axios from 'axios';

axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';

const client = axios.create({
  baseURL: "http://127.0.0.1:8000",
});

const MyComponent = () => {
  const [data, setData] = useState([]);

  const fetchData = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/sugg-projects/');
      const jsonData = response.data;
      console.log(jsonData);
      setData(jsonData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  useEffect(() => {

    fetchData();
  }, []);

  return (
    <div className='container'>
      <h1>Suggestion Projects List:</h1>
      <div className='projects-list'>
        {data.map((suggProject) => (
          <Card key={suggProject.id} formData={suggProject} />
        ))}
      </div>
    </div>
  );
};

export default MyComponent;
