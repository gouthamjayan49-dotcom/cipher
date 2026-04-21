import React, { useState } from 'react';
import Orb from './Orb';

const AuthScreen = ({ onLogin }) => {
  const [mode, setMode] = useState(null); // null | 'login' | 'signup'
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = async () => {
  // 1. Check if we are in 'login' or 'signup' mode
  const endpoint = mode === 'login' ? '/auth/login' : '/auth/register';
  

  try {
    const response = await fetch(`http://localhost:8000${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({username,password})
    });

    if (response.ok) {
      const data = await response.json();
      
      // 3. SAVE THE TOKEN! This is what NewContact.jsx is looking for.
      localStorage.setItem('token', data.access_token);
      localStorage.setItem('username', username); // add this
      
      onLogin(); // Proceed to the main app
    } else {
      const errorData = await response.json();
      alert(errorData.detail || "Authentication failed");
    }
  } catch (error) {
    console.error("Connection error:", error);
    alert("Could not connect to the CipherNet backend.");
  }
};

  return (
    <div className='relative w-screen h-screen flex flex-col items-center justify-center overflow-hidden'
      style={{ backgroundColor: '#000000' }}>

      {/* Orb Background */}
      <div className='absolute inset-0 flex items-center justify-center'>
        <div className='w-[600px] h-[600px]'>
          <Orb hue={350} hoverIntensity={1.2} rotateOnHover={true} backgroundColor='#000000' />
        </div>
      </div>

      {/* Content */}
      <div className='relative z-10 flex flex-col items-center gap-8'>

        {/* Title */}
        <div className='flex flex-col items-center gap-2'>
          <h1 className='text-6xl font-bold tracking-widest text-white'>CipherNet</h1>
          <p className='text-sm tracking-widest' style={{ color: '#71767B' }}>
            CONNECT WITHOUT A TRACE
          </p>
        </div>

        {/* Buttons or Form */}
        {mode === null && (
          <div className='flex gap-4 mt-4'>
            <button
              onClick={() => setMode('login')}
              className='px-8 py-3 rounded-xl text-sm font-medium transition-opacity hover:opacity-70'
              style={{ backgroundColor: '#1d66b9', color: '#ffffff' }}>
              Login
            </button>
            <button
              onClick={() => setMode('signup')}
              className='px-8 py-3 rounded-xl text-sm font-medium transition-opacity hover:opacity-70'
              style={{ backgroundColor: '#1D1F23', color: '#E7E9EA' }}>
              Sign Up
            </button>
          </div>
        )}

        {/* Login Form */}
        {mode === 'login' && (
          <div className='flex flex-col gap-4 w-80'>
            <input
              type='text'
              placeholder='@username'
              value={username}
              onChange={e => setUsername(e.target.value)}
              className='px-4 py-3 rounded-xl outline-none text-sm'
              style={{ backgroundColor: '#1D1F23', color: '#E7E9EA' }}
            />
            <input
              type='password'
              placeholder='Password'
              value={password}
              onChange={e => setPassword(e.target.value)}
              className='px-4 py-3 rounded-xl outline-none text-sm'
              style={{ backgroundColor: '#1D1F23', color: '#E7E9EA' }}
            />
            <button
              onClick={handleSubmit}
              className='px-8 py-3 rounded-xl text-sm font-medium transition-opacity hover:opacity-70'
              style={{ backgroundColor: '#1d66b9', color: '#ffffff' }}>
              Login
            </button>
            <button onClick={() => setMode(null)}
              className='text-xs text-center hover:opacity-70'
              style={{ color: '#71767B' }}>
              Back
            </button>
          </div>
        )}

        {/* Sign Up Form */}
        {mode === 'signup' && (
          <div className='flex flex-col gap-4 w-80'>
            <input
              type='text'
              placeholder='Choose a username'
              value={username}
              onChange={e => setUsername(e.target.value)}
              className='px-4 py-3 rounded-xl outline-none text-sm'
              style={{ backgroundColor: '#1D1F23', color: '#E7E9EA' }}
            />
            <input
              type='password'
              placeholder='Password'
              value={password}
              onChange={e => setPassword(e.target.value)}
              className='px-4 py-3 rounded-xl outline-none text-sm'
              style={{ backgroundColor: '#1D1F23', color: '#E7E9EA' }}
            />
            <input
              type='password'
              placeholder='Confirm Password'
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              className='px-4 py-3 rounded-xl outline-none text-sm'
              style={{ backgroundColor: '#1D1F23', color: '#E7E9EA' }}
            />
            <button
              onClick={handleSubmit}
              className='px-8 py-3 rounded-xl text-sm font-medium transition-opacity hover:opacity-70'
              style={{ backgroundColor: '#1d66b9', color: '#ffffff' }}>
              Sign Up
            </button>
            <button onClick={() => setMode(null)}
              className='text-xs text-center hover:opacity-70'
              style={{ color: '#71767B' }}>
              Back
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

export default AuthScreen;