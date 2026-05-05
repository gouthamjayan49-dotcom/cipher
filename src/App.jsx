import {useState,useEffect,useRef} from 'react'
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Chatarea from './components/Chatarea';
import Navigationrail from './components/Navigationrail';
import AuthScreen from './components/Authscreen';

const App = ()=>{

  const[view,setView]=useState('chat');
  const [sidebarView, setSidebarView] = useState('list');
  const [contacts,setContacts]=useState([]);
  const [activeContact, setActiveContact] = useState(null);
  const [conversations, setConversations] = useState({});
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const[isSidebarOpen,setIsSidebarOpen]=useState(true);
  const[theme, setTheme] = useState('dark');

  const wsRef = useRef(null);
  const activeContactRef = useRef(null);

  useEffect(()=>{
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme]);

  useEffect(() => {
    activeContactRef.current = activeContact;
  }, [activeContact]);

  useEffect(() => {
    if (!isLoggedIn) return;
    fetch('http://localhost:8000/messages/conversations', {
      credentials: 'include'
    })
    .then(res => res.json())
    .then(data => {
      const realContacts = data.map(c => {
        const myUsername = currentUser;
        const otherUsername = c.participant_1 === myUsername 
          ? c.participant_2 
          : c.participant_1;
        return {
          id: c.id,
          conversationId: c.id,
          name: c.nickname || otherUsername,
          username: otherUsername,
          lastMessage: c.last_message || '',
          time: c.last_message_at ? new Date(c.last_message_at + 'Z').toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '',
          unread: c.unread_count || 0,
          about: ''
        };
      });
      setContacts(realContacts);
    });
  }, [isLoggedIn]);

  useEffect(() => {
    if (!isLoggedIn) return;
    const ws = new WebSocket('ws://localhost:8000/ws');

    ws.onmessage = (e) => {
      const data = JSON.parse(e.data);

      if (data.type === 'message') {
        const myUsername = currentUser;
        const newMsg = {
          id: data.message_id,
          text: data.content,
          fromMe: data.sender_username === myUsername,
          time: new Date(data.created_at + 'Z').toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          status: data.status
        };

        setConversations(prev => ({
          ...prev,
          [String(data.conversation_id)]: [...(prev[String(data.conversation_id)] || []), newMsg]
        }));

        setContacts(prev => {
          const updated = prev.map(c =>
            c.conversationId === data.conversation_id
              ? { 
                  ...c, 
                  lastMessage: data.content, 
                  time: 'just now',
                  unread: String(activeContactRef.current?.conversationId) === String(data.conversation_id)
                    ? 0 
                    : (c.unread || 0) + 1
                }
              : c
          );
          const moved = updated.find(c => c.conversationId === data.conversation_id);
          const rest = updated.filter(c => c.conversationId !== data.conversation_id);
          return moved ? [moved, ...rest] : updated;
        });

        if (String(activeContactRef.current?.conversationId) === String(data.conversation_id)) {
          if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
            wsRef.current.send(JSON.stringify({
              type: 'read',
              conversation_id: data.conversation_id
            }));
          }
        }
      }

      if (data.type === 'read_receipt') {
        setConversations(prev => ({
          ...prev,
          [String(data.conversation_id)]: (prev[String(data.conversation_id)] || []).map(msg => ({
            ...msg,
            status: 'read'
          }))
        }));
      }

      if (data.type === 'message' && data.status === 'delivered') {
        setConversations(prev => ({
          ...prev,
          [String(data.conversation_id)]: (prev[String(data.conversation_id)] || []).map(msg =>
            msg.id === data.message_id ? { ...msg, status: 'delivered' } : msg
          )
        }));
      }
    };

    ws.onerror = (err) => console.error('WebSocket error:', err);
    ws.onclose = () => console.log('WebSocket closed');

    wsRef.current = ws;
    return () => ws.close();
  }, [isLoggedIn]);

  const handleSelectedContact = async (contact) => {
    setView('chat');

    const res = await fetch('http://localhost:8000/messages/conversations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ username: contact.username })
    });
    const data = await res.json();

    const userRes = await fetch(`http://localhost:8000/contacts/search?username=${contact.username}`, {
      credentials: 'include'
    });
    const users = await userRes.json();
    const userInfo = users[0];
    ///////////// NEW UPDATE ///////
    const nicknameRes = await fetch(`http://localhost:8000/contacts/nickname/${contact.username}`, {
  credentials: 'include'
  });
    const nicknameData = await nicknameRes.json();
    const displayName = nicknameData.nickname || contact.username;

    const contactWithConvId = { 
      ...contact, 
      conversationId: data.conversation_id,
      about: userInfo?.about_user || '',
      name:displayName
    };

    setActiveContact(contactWithConvId);

    setContacts(prev => prev.map(c =>
      c.conversationId === data.conversation_id
        ? { ...c, unread: 0 }
        : c
    ));

    const msgRes = await fetch(`http://localhost:8000/messages/conversations/${data.conversation_id}/messages`, {
      credentials: 'include'
    });
    const messages = await msgRes.json();
    const formattedMessages = messages.map(m => ({
      id: m.id,
      text: m.content,
      fromMe: m.sender_username === currentUser,
      time: new Date(m.created_at + 'Z').toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: m.status
    }));

    setConversations(prev => {
      const existingMessages = prev[String(data.conversation_id)] || [];
      const fetchedIds = new Set(formattedMessages.map(m => m.id));
      const uncommittedLiveMessages = existingMessages.filter(m => !fetchedIds.has(m.id));
      
      return {
        ...prev,
        [String(data.conversation_id)]: [...formattedMessages, ...uncommittedLiveMessages]
      };
    });

    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        type: 'read',
        conversation_id: data.conversation_id
      }));
    }
  };

  const handleSendMessage = (text) => {
    if (!activeContact || !text.trim()) return;
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
      alert('Connection lost. Please refresh.');
      return;
    }
    wsRef.current.send(JSON.stringify({
      type: 'message',
      conversation_id: activeContact.conversationId,
      content: text.trim()
    }));
  };

  const handleAddContact = (contact) => {
    setContacts(prev => {
      const exists = prev.find(c => c.conversationId === contact.conversationId);
      if (exists) return prev;
      return [contact, ...prev];
    });
    setSidebarView('list');
  };

  const handleUpdateContactName = (username, newName) => {
  setContacts(prev => prev.map(c =>
    c.username === username ? { ...c, name: newName } : c  // only name changes
  ));
};


  return(
    <>
    {!isLoggedIn 
      ? <AuthScreen onLogin={(username) => {
          setIsLoggedIn(true);
          setCurrentUser(username);
        }} />
      : <div className='flex h-screen w-screen text-white bg-slate-950 overflow-hidden'>
          <Navigationrail setSidebarView={setSidebarView} />
          <Sidebar 
            isSidebarOpen={isSidebarOpen}
            sidebarView={sidebarView} 
            setSidebarView={setSidebarView}
            contacts={contacts}
            activeContact={activeContact}
            onSelectContact={handleSelectedContact}
            onAddContact={handleAddContact}
            currentUser={currentUser}
          />
          <main className='flex-1 flex flex-col relative'>
            <Header 
              view={view} 
              setView={setView}
              isSidebarOpen={isSidebarOpen} 
              setIsSidebarOpen={setIsSidebarOpen}
              activeContact={activeContact} 
            />
            <Chatarea 
              view={view}
              setView={setView}
              activeContact={activeContact}
              messages={activeContact ? (conversations[String(activeContact.conversationId)] || []) : []}
              onSendMessage={handleSendMessage}
              onUpdateContactName={handleUpdateContactName} 
            />
          </main>
        </div>
    }
    </>
  );
}

export default App