import { useState } from 'react';
// import { useMutation } from '@apollo/client';
// import { LOGIN_USER } from '../utils/mutations';
import './LoginModal.css'; 

// import Auth from '../utils/auth';

// const LoginForm = (props) => {
//   const [formState, setFormState] = useState({ username: '', password: '' });
//   const [login, { error, data }] = useMutation(LOGIN_USER);


const LoginForm = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username && password) {
      onLogin({ username, password });
    } else {
      console.log("Please fill in all fields.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form">
      <div className="input-container">
        <label className="input-label">Username:</label>
        <input
          type="text"
          className="input-field"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
      </div>
      <div className="input-container">
        <label className="input-label">Password:</label>
        <input
          type="password"
          className="input-field"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <div className="buttons-container">
        <button className="modal-button" type="submit">Login</button>
      </div>
    </form>
  );
};

export default LoginForm;