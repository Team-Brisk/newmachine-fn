"use client"
import axios from 'axios';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'
import './login.scss'; // Import the SCSS file

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter()
  useEffect(() => {
    const token = localStorage.getItem("token-nemachine");
    const user = localStorage.getItem("user-nemachine");
    if (!token ||  !user) {
      localStorage.clear();
      router.push("/login");
    }
  }, [router]);
  const handleSubmit = async (event: any) => {
    event.preventDefault();

    try {
      const response = await axios.post('http://159.65.216.202:9999/auth/login', {
        username,
        password
      });
      localStorage.setItem('user-nemachine', JSON.stringify(response.data.user));
      localStorage.setItem('token-nemachine', response.data.token);
      console.log('Login successful:', response.data);
      router.push('/machine'); // Redirect to the dashboard page on successful login
    } catch (error: any) {

    }
  };

  return (
    <div className="min-h-screen">
      <div className="form-container">
        <h1 className="title">Login</h1>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="username" className="block text-sm font-medium">Username</label>
            <input type="text" id="username" value={username} onChange={(e) => setUsername(e.target.value)} className="input-field" />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium">Password</label>
            <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} className="input-field" />
          </div>
          <button type="submit" className="btn-primary">Log in</button>
        </form>
      </div>
    </div>
  );
}
