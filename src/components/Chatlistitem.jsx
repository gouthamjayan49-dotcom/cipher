import React from 'react'

const Chatlistitem = ({contact, isActive, onClick}) => {
    return(
        <div onClick={onClick} className='flex flex-row items-center p-2 border-b
         cursor-pointer hover:opacity-80 transition-colors'
        style={{borderColor:'var(--border-ui)', backgroundColor: isActive ?
         'var(--bg-item-active)' : 'var(--bg-sidebar)'}}>
              {/* Profile icon div */}
              <div className='w-12 h-12 rounded-full shrink-0'
              style={{backgroundColor:'var(--bg-item-active)'}}>
                
      
              </div>

              {/*The div holding two divs for the Name and the last message */}
      
              
              <div className='flex flex-col flex-1 ml-4 gap-2 min-w-0'>
                {/* The div for holding the contact name */}
                <div className='leading-tight'>
                  <h1 className='truncate' style={{color:'var(--text-primary)'}}>{contact.name}</h1>
                </div>
                {/* The div for holding the last chat */}
                <div className='leading-tight'>
                  <p className='text-xs truncate' style={{color:'var(--text-secondary)'}}>
                    {contact.lastMessage}</p>
                </div>

              </div>
              {/* The div to include both the unread messages count and final message time */}
              <div className='flex flex-col items-center leading-tight text-xs shrink-0 gap-2'>
                <p style={{color:'var(--text-secondary)'}}>{contact.time}</p>
                {contact.unread>0 &&(
                <div className='text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center'
                style={{backgroundColor:'var(--bubble-sent)', color:'var(--accent-text)'}}>
                      {contact.unread}
                </div>
                )}
              </div>
            </div>

    );
}

export default Chatlistitem