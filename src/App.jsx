
import {Menu,X,Search,Phone,Video,MoreVertical,Send,Paperclip,SquarePen} from 'lucide-react';
import {useState,useEffect,useRef} from 'react'
import Sidebar from './components/Sidebar';//new line
import Header from './components/Header';
import Chatarea from './components/Chatarea';
import Navigationrail from './components/Navigationrail';
import AuthScreen from './components/Authscreen';


const App = ()=>{

  const[view,setView]=useState('chat');
  const [sidebarView, setSidebarView] = useState('list');

  const [contacts,setContacts]=useState([]);
  // activeContact: whichever contact is currently open in the chat area (or null)
  const [activeContact, setActiveContact] = useState(null);
  
  // conversations: all messages, keyed by contact id
  const [conversations, setConversations] = useState({});

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const[isSidebarOpen,setIsSidebarOpen]=useState(true);
  const[theme, setTheme] = useState('dark')

  const wsRef = useRef(null);

  
  useEffect(()=>{
  document.documentElement.setAttribute('data-theme', theme)
  }, [theme])


  useEffect(() => {
  if (!isLoggedIn) return;
  
  const token = localStorage.getItem('token');
  fetch('http://localhost:8000/messages/conversations', {
    headers: { 'Authorization': `Bearer ${token}` }
  })
  .then(res => res.json())
  .then(data => {
    const realContacts = data.map(c => {
      const myUsername = localStorage.getItem('username');
      const otherUsername = c.participant_1 === myUsername 
        ? c.participant_2 
        : c.participant_1;
      return {
        id: c.id,
        conversationId: c.id,
        name: otherUsername,
        username: otherUsername,
        lastMessage: c.last_message || '',
        time: c.last_message_at ? new Date(c.last_message_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '',
        unread: c.unread_count || 0,
        about: ''
      };
    });
    setContacts(realContacts);
  });
}, [isLoggedIn]);

  useEffect(() => {
  if (!isLoggedIn) return;
  const token = localStorage.getItem('token');
  const ws = new WebSocket(`ws://localhost:8000/ws?token=${token}`);

  ws.onmessage = (e) => {
    const data = JSON.parse(e.data);

    if (data.type === 'message') {
      const myUsername = localStorage.getItem('username');
      const newMsg = {
        id: data.message_id,
        text: data.content,
        fromMe: data.sender_username === myUsername,
        time: new Date(data.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        status: data.status
      };

      setConversations(prev => ({
        ...prev,
        [data.conversation_id]: [...(prev[data.conversation_id] || []), newMsg]
      }));

      setContacts(prev => {
        const updated = prev.map(c =>
          c.conversationId === data.conversation_id
            ? { ...c, lastMessage: data.content, time: 'just now' }
            : c
        );
        const moved = updated.find(c => c.conversationId === data.conversation_id);
        const rest = updated.filter(c => c.conversationId !== data.conversation_id);
        return moved ? [moved, ...rest] : updated;
      });
    }
  };

  ws.onerror = (err) => console.error('WebSocket error:', err);
  ws.onclose = () => console.log('WebSocket closed');

  wsRef.current = ws;
  return () => ws.close();
}, [isLoggedIn]);

 const handleSelectedContact = async (contact) => {
  setView('chat');

  const token = localStorage.getItem('token');
  const res = await fetch('http://localhost:8000/messages/conversations', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ username: contact.username })
  });

  const data = await res.json();

  const contactWithConvId = { ...contact, conversationId: data.conversation_id };
  setActiveContact(contactWithConvId);

  if (!conversations[data.conversation_id]) {
    setConversations(prev => ({
      ...prev,
      [data.conversation_id]: []
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
  const handleAddContact = (contact)=>{
    const newEntry ={
      id:Date.now(),
      name:contact.name,
      about:'',
      lastMessage:'',
      time:'',
      unread:0
    }
    setContacts(prev=>[newEntry,...prev]);
    setSidebarView('list');
  };
  return(
    <>
    {!isLoggedIn 
      ? <AuthScreen onLogin={() => setIsLoggedIn(true)} />
    :<div className='flex h-screen w-screen text-white bg-slate-950 overflow-hidden'>
      <Navigationrail setSidebarView={setSidebarView} />

      
      <Sidebar isSidebarOpen={isSidebarOpen}
      sidebarView={sidebarView} 
      setSidebarView={setSidebarView}
      contacts={contacts}
      activeContact={activeContact}
      onSelectContact={handleSelectedContact}
      onAddContact={handleAddContact}
       />
      <main className='flex-1 flex flex-col relative'>
        <Header view={view} 
        setView={setView}
        isSidebarOpen={isSidebarOpen} 
        setIsSidebarOpen={setIsSidebarOpen}
        activeContact={activeContact} />
        
        <Chatarea view={view}
        setView={setView}
        activeContact={activeContact}
        messages={activeContact ? (conversations[activeContact.conversationId] || []) : []}
        onSendMessage={handleSendMessage} />
      </main>

    </div>
}
    </>

  );
  
}
    export default App