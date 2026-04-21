import React, { useState, useEffect } from 'react'
import { Search, Check } from 'lucide-react';
import Contactslist from './Contactslist';

const NewContact = ({ onAddContact }) => {
  const [username, setUsername] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    const searchUsers = async () => {
      if (username.length < 2) return setSuggestions([]);
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:8000/contacts/search?username=${username}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setSuggestions(data);
      }
    };
    const timer = setTimeout(searchUsers, 300);
    return () => clearTimeout(timer);
  }, [username]);

  const handleSave = async () => {
    if (!selected) return;
    const token = localStorage.getItem('token');

    // Add to contacts on backend
    await fetch(`http://localhost:8000/contacts/?contact_username=${selected.username}`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` }
    });

    // Create or get conversation
    const res = await fetch('http://localhost:8000/messages/conversations', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username: selected.username })
    });
    const data = await res.json();

    onAddContact({
      id: data.conversation_id,
      conversationId: data.conversation_id,
      name: selected.username,
      username: selected.username,
      about: selected.about_user || '',
      lastMessage: '',
      time: '',
      unread: 0
    });
  };

  return (
    <div className='flex flex-col h-full' style={{ backgroundColor: 'var(--bg-app)' }}>

      <div className="flex flex-col gap-2 px-5 pt-4">
        <p className='text-xs font-medium' style={{ color: 'var(--text-secondary)' }}>
          Search by username
        </p>
        <div className="flex items-center gap-3 rounded-xl px-4 py-3"
          style={{ backgroundColor: 'var(--bg-item-hover)' }}>
          <Search size={18} style={{ color: 'var(--text-secondary)' }} />
          <input
            type="text"
            placeholder="@username"
            value={username}
            onChange={e => { setUsername(e.target.value); setSelected(null); }}
            className="outline-none bg-transparent w-full text-sm"
            style={{ color: 'var(--text-primary)' }}
          />
        </div>
      </div>

      {selected && (
        <div className='px-5 pt-4'>
          <button
            onClick={handleSave}
            className='w-full py-3 rounded-xl text-sm font-medium transition-opacity hover:opacity-70'
            style={{ backgroundColor: 'var(--bubble-sent)', color: 'var(--accent-text)' }}>
            Start conversation with {selected.username}
          </button>
        </div>
      )}

      <div className='overflow-y-auto flex-1 mt-2'>
        {suggestions.map(c => (
          <Contactslist
            key={c.id}
            contact={{
              ...c,
              name: c.username,
              about: c.about_user || 'Available'
            }}
            onClick={() => setSelected(c)}
          />
        ))}
      </div>

    </div>
  );
}

export default NewContact;