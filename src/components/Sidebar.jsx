import React,{useState} from 'react';
import {SquarePen,ArrowLeft,Search,UserPlus,User,Check,ChevronDown,Phone,LogOut,Pen} from 'lucide-react';
import Chatlistitem from './Chatlistitem';
import Contactslist from './Contactslist';
import NewContact from './NewContact';
import { use } from 'react';

const Sidebar = ({isSidebarOpen,sidebarView, setSidebarView,contacts,activeContact,onSelectContact,
  onAddContact})=>{
    const[about,setAbout]=useState('');
    const [editingUsername, setEditingUsername] = useState(false);
    return(
        <aside
       className={`border-r transition-all duration-300 overflow-hidden flex flex-col
      ${isSidebarOpen ? 'w-100' : 'w-0'}`}
      style={{backgroundColor:'var(--bg-sidebar)', borderColor:'var(--border-ui)'}}
      >
        {sidebarView ==='list' && (
          <>
        <header className='h-16 border-b flex flex-row px-6 items-center justify-between text-[#2D1F1A]'
        style={{borderColor:'var(--border-ui)', color:'var(--text-primary)'}}>
          <h1 className='text-3xl '>cipher</h1>
          <button onClick={()=>setSidebarView('NewChat')} 
          className='p-2 rounded-lg transition-colors hover:opacity-70'>
            <SquarePen size={20} />
          </button>
        </header>
          <div className='flex flex-col flex-1 overflow-hidden w-full h-full overflow-y-auto
            [&::-webkit-scrollbar]:w-1.5
[&::-webkit-scrollbar-track]:bg-transparent
[&::-webkit-scrollbar-thumb]:rounded-full'
style={{
   scrollbarColor: 'var(--scrollbar) transparent'
}}>
            {contacts.map(contact=>(
              <Chatlistitem
              key={contact.id}
              contact={contact}
              isActive={activeContact?.id=== contact.id}
              onClick={()=>onSelectContact(contact)} />
            ))}
            
          </div>
          </>
          )}

          {sidebarView === 'NewChat' && (
            <>
            <header className='h-45 border-b flex flex-col gap-2'
            style={{backgroundColor:'var(--bg-app)', borderColor:'var(--border-ui)'}}>
              <div className='p-3 gap-3 flex flex-row items-center'
              style={{color:'var(--text-primary)'}}>
                <button className='hover:opacity-70 p-2 rounded-full' onClick={()=>setSidebarView('list')}>
                  <ArrowLeft size={22} />
                </button>
                <h1>
                  New Chat
                </h1>
              </div>

              <div className='relative w-full flex justify-center items-center'>
                {/* The Icon (Pinned to the left) */}
                  <Search 
                    className='absolute left-7'
                    style={{color:'var(--text-secondary)'}}
                    size={18} 
                  />
  
                {/* The Input Field */}
              <input 
              type="text"
              placeholder="Search name or number..."
              className='w-90 rounded-lg py-2 pl-10 pr-4
                outline-none border border-transparent focus:border-blue-600/50 transition-all text-sm'
                style={{backgroundColor:'var(--bg-item-hover)', color:'var(--text-primary)'}}
              />
            </div>

            <div className='p-3 hover:opacity-70'>
              <button className='flex gap-3 p-2'
              style={{color:'var(--text-primary)'}}
              onClick={()=>{setSidebarView('NewContact')}}>
              <UserPlus size={22} />
              <h1>New Contact</h1>
              </button>
              

            </div>
            </header>
            <div className='flex flex-col flex-1 overflow-hidden w-full h-full overflow-y-auto
            [&::-webkit-scrollbar]:w-1.5
            [&::-webkit-scrollbar-track]:bg-transparent
            [&::-webkit-scrollbar-thumb]:rounded-full'
            style={{
            scrollbarColor: 'var(--scrollbar) transparent'
            }}>
            
            {contacts.map(contact => (
        <Contactslist
        key={contact.id}
        contact={contact}
        onClick={() => {
            onSelectContact(contact);
            setSidebarView('list');
        }}
    />
))}

            </div>
            </>

          )}
      {sidebarView === 'NewContact' && (
      <>
      <header className='h-16 border-b flex flex-row px-6 items-center gap-4 shrink-0'
        style={{ backgroundColor: 'var(--bg-app)', borderColor: 'var(--border-ui)' }}>
            <button className='hover:opacity-70 p-2 rounded-full transition-colors'
            onClick={() => setSidebarView('NewChat')}>
                <ArrowLeft size={22} style={{ color: 'var(--text-primary)' }} />
            </button>
            <h1 className='text-lg font-semibold' style={{ color: 'var(--text-primary)' }}>
                New Contact
            </h1>
        </header>
        <NewContact onAddContact={onAddContact} contacts={contacts} />
      </>
)}

      {sidebarView === 'profile'&& (
        <>
        <header className='h-16 border-b flex flex-row px-6 items-center gap-4 shrink-0'
        style={{ backgroundColor: 'var(--bg-app)', borderColor: 'var(--border-ui)' }}>
            <button className='hover:opacity-70 p-2 rounded-full transition-colors'
            onClick={() => setSidebarView('list')}>
                <ArrowLeft size={22} style={{ color: 'var(--text-primary)' }} />
            </button>
            <h1 className='text-lg font-semibold' style={{ color: 'var(--text-primary)' }}>
                Edit Profile
            </h1>
        </header>
        <div className='flex flex-col flex-1 p-6 gap-6 overflow-y-auto'>

          {/* Avatar */}
          <div className='flex justify-center py-4'>
            <div className='w-24 h-24 rounded-full flex items-center justify-center cursor-pointer hover:opacity-70'
              style={{ backgroundColor: 'var(--bg-item-active)' }}>
              <span className='text-2xl font-semibold' style={{ color: 'var(--text-primary)' }}>
                U
              </span>
            </div>
          </div>

          {/* Username */}
          <div className='flex flex-col gap-1 border-b pb-4' style={{ borderColor: 'var(--border-ui)' }}>
  <p className='text-xs' style={{ color: 'var(--text-secondary)' }}>Username</p>
  <div className='flex items-center justify-between'>

    {editingUsername 
      ? <input autoFocus className='outline-none bg-transparent text-sm' style={{ color: 'var(--text-primary)' }} />
      : <p className='text-sm' style={{ color: 'var(--text-primary)' }}>@username</p>
    }
    <Pen size={14} style={{ color: 'var(--text-secondary)' }} onClick={()=>setEditingUsername(true)} />
  </div>
</div>

          {/* About */}
          <div className='flex flex-col gap-1 border-b pb-4' style={{ borderColor: 'var(--border-ui)' }}>
  <p className='text-xs' style={{ color: 'var(--text-secondary)' }}>About</p>
  <div className='flex items-center gap-2'>
    <input
      type='text'
      placeholder='Write something about yourself...'
      value={about}
      onChange={e => setAbout(e.target.value)}
      className='outline-none bg-transparent text-sm flex-1'
      style={{ color: 'var(--text-primary)' }}
    />
    <Check size={16} className='cursor-pointer hover:opacity-70' 
      style={{ color: 'var(--text-secondary)' }} />
  </div>
</div>

          {/* Logout */}
          <div className='mt-auto'>
            <button className='w-full flex items-center gap-3 p-4 rounded-2xl hover:opacity-70 transition-opacity'
              style={{ color: '#FF3B30' }}>
              <LogOut size={18} />
              <span className='text-sm font-medium'>Log Out</span>
            </button>
          </div>
          

        </div>
        
        </>
      )}


      </aside>
    );
};
export default Sidebar;