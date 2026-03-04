import React from 'react';
import { MessageSquare,Settings,CircleUser} from 'lucide-react';
const Navigationrail=({setSidebarView})=>{
    return(
       <aside className='flex flex-col h-screen w-16 border-r justify-between overflow-hidden'
       style={{backgroundColor:'var(--bg-app)', borderColor:'var(--border-ui)'}}>
    {/* TOP SECTION */}
    <div className='flex flex-col gap-8 items-center pt-2'>
        <div className='p-3 rounded-2xl cursor-pointer transition-colors hover:opacity-70'
        style={{color:'var(--text-primary)'}}>
            <MessageSquare size={24} />
        </div>
    </div>

    {/* BOTTOM SECTION */}
    <div className='flex flex-col gap-6 items-center pb-6'>
        <div className='p-3 text-blue-500 hover:opacity-70 cursor-pointer transition-colors'
        style={{color:'var(--text-primary)'}}>
            <Settings size={24} />
        </div>
        <div className='text-slate-600 hover:text-red-500 cursor-pointer transition-colors' 
        onClick={()=> setSidebarView('profile')}>
            <CircleUser size={24}  />
        </div>
    </div>
</aside>
    );
};
export default Navigationrail;