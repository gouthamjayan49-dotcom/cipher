import React from 'react'

const Contactslist=({contact, onClick})=>{
  const initials = contact.name.split(' ').map(n => n[0]).join('').toUpperCase();
    return(
        <div onClick={onClick} className='flex flex-row items-center p-4 border-b cursor-pointer hover:opacity-80 transition-colors'
        style={{borderColor:'var(--border-ui)', backgroundColor:'var(--bg-sidebar)'}}>
              {/* Profile icon div */}
              <div className='w-12 h-12 rounded-full shrink-0 flex items-center justify-center'
              style={{backgroundColor:'var(--bg-item-active)'}}>
                <span className='text-sm font-semibold' style={{color:'var(--text-primary)'}}>
              {initials}
              </span>
      
              </div>

              {/*The div holding two divs for the Name and the last message */}
      
              
              <div className='flex flex-col flex-1 ml-4 gap-2'>
                {/* The div for holding the contact name */}
                <div className='leading-tight truncate'>
                  <h1 style={{color:'var(--text-primary)'}}>{contact.name}</h1>
                </div>
                {/* The div for holding the last chat */}
                <div className='leading-tight truncate'>
                  <p className='text-xs' style={{color:'var(--text-secondary)'}}>
                  {contact.about}</p>
                </div>

              </div>
              
            </div>

    );
}
export default Contactslist;