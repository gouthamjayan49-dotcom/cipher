
import {Menu,X,Search,Phone,Video,MoreVertical,Send,Paperclip,SquarePen} from 'lucide-react';
import {useState,useEffect} from 'react'
import Sidebar from './components/Sidebar';//new line
import Header from './components/Header';
import Chatarea from './components/Chatarea';
import Navigationrail from './components/Navigationrail';





const initialContacts= [
  {id:1, name:'Govardhan Gopu', phone:'+91 1234567899', about:'Hey there, Iam using cipher.', 
    lastMessage:'See you tomorrow',time: '12:34 PM', unread: 2 },
    { id: 2, name: 'Bob Martinez',     phone: '+1 202-555-0182', about: 'Available',                     lastMessage: 'Haha okay 😂',            time: '11:10 AM', unread: 0 },
  { id: 3, name: 'Carol White',      phone: '+44 7700 900123', about: 'Busy – do not disturb',         lastMessage: 'Can we reschedule?',      time: 'Yesterday', unread: 1 },
  { id: 4, name: 'David Lee',        phone: '+91 98765 43210', about: 'Living life one day at a time', lastMessage: 'Sounds good!',            time: 'Yesterday', unread: 0 },
  { id: 5, name: 'Eva Brown',        phone: '+49 1512 3456789', about: 'Coffee addict ☕',             lastMessage: 'I will send the file now', time: 'Monday',    unread: 3 },
  { id: 6, name: 'Frank Ocean',      phone: '+1 310-555-0199', about: 'Music is life 🎵',              lastMessage: 'Nice!',                   time: 'Sunday',    unread: 0 },
  { id: 7, name: 'Grace Kim',        phone: '+82 10-1234-5678', about: '안녕하세요!',                   lastMessage: 'Did you get my message?', time: 'Saturday',  unread: 1 }
]


// Each conversation is stored by contact id.
// Each message has: id, text, fromMe (true = sent by user), time, status ('sent'|'delivered'|'read')
const initialConversations = {
  1: [
    { id: 1, text: 'Hey Alice! Are we still on for tomorrow?', fromMe: true,  time: '12:30 PM', status: 'read' },
    { id: 2, text: 'Yes of course! Looking forward to it 😊',   fromMe: false, time: '12:32 PM', status: 'read' },
    { id: 3, text: 'See you tomorrow!',                          fromMe: false, time: '12:34 PM', status: 'read' },
  ],
  2: [
    { id: 1, text: 'Bob did you watch the game?',   fromMe: true,  time: '11:05 AM', status: 'read' },
    { id: 2, text: 'Yes bro it was insane!!!',       fromMe: false, time: '11:08 AM', status: 'read' },
    { id: 3, text: 'Haha okay 😂',                   fromMe: false, time: '11:10 AM', status: 'read' },
  ],
  3: [],
  4: [],
  5: [],
  6: [],
  7: [],
};




const App = ()=>{

  const[isSidebarOpen,setIsSidebarOpen]=useState(true);
  const[theme, setTheme] = useState('dark')
  useEffect(()=>{
  document.documentElement.setAttribute('data-theme', theme)
  }, [theme])



  const[view,setView]=useState('chat');
  const [sidebarView, setSidebarView] = useState('list');

  const [contacts,setContacts]=useState(initialContacts);
  // activeContact: whichever contact is currently open in the chat area (or null)
  const [activeContact, setActiveContact] = useState(null);
  
  // conversations: all messages, keyed by contact id
  const [conversations, setConversations] = useState(initialConversations);

  const handleSelectedContact = (contact)=>{
  setActiveContact(contact);
  setView('chat');
  if(!conversations[contact.id]){
    setConversations(prev=>({
       ...prev,[contact.id]:[]
    }));
  }
  }
  
  //called when user sends a message
  const handleSendMessage=(text)=>{
    if(!activeContact || !text.trim()) return;
    const newMessage = {
      id:Date.now(),
      text:text.trim(),
      fromMe:true,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status:'sent'
    };
    setConversations(prev => ({
      ...prev,
      [activeContact.id]: [...(prev[activeContact.id] || []), newMessage],
    }));
    setContacts(prev => {
  const updated = prev.map(c =>
    c.id === activeContact.id
      ? { ...c, lastMessage: text.trim(), time: 'just now' }
      : c
  );
  const moved = updated.find(c => c.id === activeContact.id);
  const rest = updated.filter(c => c.id !== activeContact.id);
  return [moved, ...rest];
});
  }

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
    <div className='flex h-screen w-screen text-white bg-slate-950 overflow-hidden'>
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
        messages={activeContact ? (conversations[activeContact.id] || []) : []}
        onSendMessage={handleSendMessage} />
      </main>

    </div>

  );
  
}
    export default App