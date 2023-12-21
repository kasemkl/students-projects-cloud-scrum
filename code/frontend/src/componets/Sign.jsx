import { useState } from "react";
import '../styles/sign.css'

function Sign() {
const [formData, setFormData] = useState({
university_id: "",
password: "",
});

const handleChange = (e) => {
setFormData({
...formData,
[e.target.name]: e.target.value,
});
};

const handleSubmit = (e) => {
e.preventDefault();
console.log(JSON.stringify(formData))
fetch('http://127.0.0.1:8000/login/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(formData),
  })
    .then(response => {
      // Check if the request was successful (status code in the range 200-299)
      return response.json();
    })
    .then(data => {
      // Handle the data returned from the server
      console.log('Response data:', data);

      // You can update your React state or UI with the data here
    })
    .catch(error => {
      // Handle errors during the fetch or data parsing
      console.error('Error during fetch:', error);
    });
};


const {
university_id,
password,

} = formData;

return (
  <form onSubmit={handleSubmit}>
    <fieldset>
      <h2>Log in</h2>
      <div className="field">
        <label>
          University ID <sup></sup>
        </label>
        <input
          type="text"
          placeholder="Type your university id..."
          name="university_id"
          value={university_id}
          onChange={handleChange}
        />
      </div>
      <div className="field">
        <label>Password </label>
        <input
          type="password"
          placeholder="Type your password name..."
          name="password"
          value={password}
          onChange={handleChange}
        />
      </div>
      <div className="field">
        <button type="submit">Login</button>
      </div>
    </fieldset>
  </form>
);
}

export default Sign;
