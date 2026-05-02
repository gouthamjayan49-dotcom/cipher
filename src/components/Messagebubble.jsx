import React from 'react';
import { Check, CheckCheck, User, Bot, Trash2 } from 'lucide-react';

const Messagebubble=({message})=>{

    const StatusIcon = () => {
  if (!message.fromMe) return null;
  if (message.status === 'read') return <CheckCheck size={12} style={{color:'#ffffff'}} />;
  return <Check size={12} style={{color:'#ffffff', opacity:0.6}} />;
};

    return(
        <>
        
        <div className={`w-full flex ${ message.fromMe ? 'justify-end':'justify-start'}`}>
            <div className={`max-w-[70%] bg-[#3D5A6E] p-3 cipher-md 
            ${message.fromMe
            ? 'rounded-2xl rounded-tr-none'
            : 'rounded-2xl rounded-tl-none'
            }`}
            style={{
            backgroundColor:message.fromMe? 'var(--bubble-sent)':'var(--bubble-received)',
            color: message.fromMe ? 'var(--accent-text)' : 'var(--text-primary)'}}>

               <p className='text-sm break-words'>{message.text}</p>

            <div className='text-[10px] text-right mt-1 items-center justify-end gap-1 flex'
            style={{color:'var(--accent-text)', opacity:0.7}}>
                <span>{message.time}</span>
                <StatusIcon />

            </div>

            </div>

        </div> 
        </>
    );
}
export default Messagebubble;