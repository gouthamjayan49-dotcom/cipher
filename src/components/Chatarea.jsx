import React,{useState,useRef,useEffect} from 'react';
import Messagebubble from './Messagebubble';
import Contactprofile from './Contactprofile';
import NewContact from './NewContact';
import { Send, Smile, Paperclip,ArrowLeft,User,Phone,Check } from 'lucide-react';

const Chatarea = ({ view, setView, activeContact, messages, onSendMessage, }) => {
    const[inputText,setInputText]=useState('');
    const handleSend=()=>{
        onSendMessage(inputText);
        setInputText('');
    }
const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
        handleSend();
    }
};
    const bottomRef = useRef(null);
    useEffect(()=>{
        bottomRef.current?.scrollIntoView({behavior:'smooth'});
    },[messages])
    return (
        <>
        {view === 'chat' &&(
        <div className='flex-1 flex flex-col h-full overflow-hidden'
        style={{backgroundColor:'var(--bg-app)'}}>

            <div className='flex-1 overflow-y-auto p-6 space-y-4 flex flex-col
            [&::-webkit-scrollbar]:w-1.5
            [&::-webkit-scrollbar-track]:bg-transparent
            [&::-webkit-scrollbar-thumb]:rounded-full'
            style={{scrollbarColor:'var(--scrollbar) transparent'}}
            >
                {
                    messages.length==0 ? (
                        <div className='flex-1 flex items-center justify-center'
                    style={{ color: 'var(--text-secondary)' }}>
                    <p className='text-sm'>No messages yet. Say hello! 👋</p>
                  </div>
                    ):(
                        messages.map(msg=>(
                            <Messagebubble key={msg.id}
                            message={msg} />
                        ))
                    )
                }
                
                 <div ref={bottomRef} />   
            </div>

            <div className='p-4'
            style={{backgroundColor:'var(--bg-app)'}}>
                <div className='flex items-center gap-3 rounded-2xl px-4 py-3 border'
                style={{
                    backgroundColor:'var(--bg-item-hover)',
                    borderColor:'var(--border-ui)'
                }}>
                    <Smile size={22} style={{color:'var(--text-secondary)'}} />
                    <input 
                        type="text" 
                        value={inputText}
                        onChange={e=>setInputText(e.target.value)}
                        placeholder="Message..." 
                        className='bg-transparent flex-1 outline-none'
                        style={{color:'var(--text-primary)'}}
                        onKeyDown={handleKeyDown}
                    />
                    <Send size={19} className='cursor-pointer'
                    style={{color:'var(--text-primary)'}}
                    onClick={handleSend} />
                </div>
            </div>
        </div>
        )}

        {view ==='profile' &&(
            <Contactprofile activeContact={activeContact} />
        )}

  {view === 'edit' && (
  <div className='flex-1 flex flex-col p-6 gap-6'
    style={{ backgroundColor: 'var(--bg-app)' }}>

    {/* Current Username — read only */}
    <div className="flex items-center gap-3 border-b pb-2"
      style={{ borderColor: 'var(--border-ui)' }}>
      <p className='text-xs font-medium' style={{ color: 'var(--text-secondary)' }}>Username</p>
      <p className='text-sm' style={{ color: 'var(--text-primary)' }}>
        {activeContact?.name}
      </p>
    </div>

    {/* Nickname — editable */}
    <div className="flex items-center gap-3 border-b pb-2"
      style={{ borderColor: 'var(--border-ui)' }}>
      <p className='text-xs font-medium' style={{ color: 'var(--text-secondary)' }}>Nickname</p>
      <input
        type="text"
        placeholder="Add a nickname..."
        className="outline-none bg-transparent w-full text-sm"
        style={{ color: 'var(--text-primary)' }}
      />
    </div>

    {/* Save Button */}
    <div className="flex justify-end">
      <button
        className="p-3 rounded-full transition-opacity hover:opacity-70"
        style={{ backgroundColor: 'var(--bg-item-hover)' }}>
        <Check size={22} style={{ color: 'var(--text-primary)' }} />
      </button>
    </div>

  </div>
)}
        </>
    );
};

export default Chatarea;