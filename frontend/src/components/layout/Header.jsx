import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HiOutlineBell, HiOutlineArrowRightOnRectangle,
  HiOutlineMagnifyingGlass, HiOutlineBars3,
} from 'react-icons/hi2';

const Header = ({ onMenuClick, isMobile }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [profileOpen, setProfileOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = e => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setProfileOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const roleColor = { institution: '#ffe17c', teacher: '#b7c6c2', student: '#fff', admin: '#ffe17c' };

  return (
    <header style={{
      height: 68, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: isMobile ? '0 1rem' : '0 1.5rem',
      background: '#ffe17c', borderBottom: '2px solid #000',
      position: 'sticky', top: 0, zIndex: 40, gap: '0.75rem',
    }}>

      {/* Hamburger — mobile */}
      {isMobile && (
        <button onClick={onMenuClick}
          style={{ background:'#000', border:'2px solid #000', borderRadius:'0.5rem', padding:'0.375rem', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'2px 2px 0px #000', flexShrink:0 }}>
          <HiOutlineBars3 style={{ color:'#ffe17c', fontSize:'1.25rem' }} />
        </button>
      )}

      {/* Search — hide on small mobile, show from md */}
      <div className={isMobile ? 'header-search-wrap' : ''} style={{
        display: isMobile ? 'none' : 'flex',
        alignItems: 'center', gap: '0.625rem',
        background: '#fff', border: '2px solid #000', borderRadius: '0.625rem',
        padding: '0.5rem 1rem', width: isMobile ? '100%' : 280,
        boxShadow: '3px 3px 0px #000', flex: isMobile ? 1 : 'none',
        transition: 'all 0.2s',
      }}>
        <HiOutlineMagnifyingGlass style={{ color:'#000', fontSize:'1.125rem', flexShrink:0 }} />
        <input type="text" placeholder="Search anything..."
          style={{ border:'none', outline:'none', background:'transparent', fontFamily:"'Satoshi',sans-serif", fontSize:'0.875rem', fontWeight:500, color:'#000', width:'100%', minWidth:0 }}
        />
        {!isMobile && (
          <kbd style={{ background:'#ffe17c', border:'2px solid #000', borderRadius:'0.25rem', padding:'0.125rem 0.375rem', fontFamily:"'Cabinet Grotesk',sans-serif", fontSize:'0.625rem', fontWeight:800, color:'#000', whiteSpace:'nowrap' }}>⌘K</kbd>
        )}
      </div>

      {/* Mobile: search icon only */}
      {isMobile && (
        <button style={{ width:38, height:38, borderRadius:'0.5rem', border:'2px solid #000', background:'#fff', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', color:'#000', boxShadow:'2px 2px 0px #000', flexShrink:0 }}>
          <HiOutlineMagnifyingGlass size={17} />
        </button>
      )}

      {/* Right side */}
      <div style={{ display:'flex', alignItems:'center', gap:'0.5rem', marginLeft:'auto' }}>
        {/* Notifications */}
        <button
          onClick={() => navigate('/dashboard/notifications')}
          style={{ width:38, height:38, borderRadius:'0.5rem', border:'2px solid #000', background:'#fff', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', color:'#000', position:'relative', boxShadow:'2px 2px 0px #000', transition:'all 0.2s', flexShrink:0 }}
          onMouseEnter={e=>{e.currentTarget.style.transform='translate(1px,1px)';e.currentTarget.style.boxShadow='1px 1px 0px #000';}}
          onMouseLeave={e=>{e.currentTarget.style.transform='translate(0,0)';e.currentTarget.style.boxShadow='2px 2px 0px #000';}}
        >
          <HiOutlineBell size={17} />
          <span style={{ position:'absolute', top:6, right:6, width:7, height:7, borderRadius:'50%', background:'#dc2626', border:'2px solid #ffe17c' }} />
        </button>

        <div style={{ width:2, height:28, background:'#000', flexShrink:0 }} />

        {/* Profile */}
        <div ref={dropdownRef} style={{ position:'relative' }}>
          <button onClick={() => setProfileOpen(!profileOpen)}
            style={{
              display:'flex', alignItems:'center', gap:'0.5rem',
              padding: isMobile ? '0.375rem 0.5rem' : '0.375rem 0.75rem',
              border:'2px solid #000', borderRadius:'0.5rem',
              background: profileOpen ? '#000' : '#fff',
              cursor:'pointer', boxShadow:'2px 2px 0px #000',
              transition:'all 0.2s cubic-bezier(0.175,0.885,0.32,1.275)',
            }}
            onMouseEnter={e=>{if(!profileOpen){e.currentTarget.style.transform='translate(1px,1px)';e.currentTarget.style.boxShadow='1px 1px 0px #000';}}}
            onMouseLeave={e=>{if(!profileOpen){e.currentTarget.style.transform='translate(0,0)';e.currentTarget.style.boxShadow='2px 2px 0px #000';}}}
          >
            <div style={{ width:30, height:30, borderRadius:'50%', background:profileOpen?'#ffe17c':'#171e19', border:'2px solid #000', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:"'Cabinet Grotesk',sans-serif", color:profileOpen?'#000':roleColor[user?.role]||'#fff', fontSize:'0.6875rem', fontWeight:800 }}>
              {user?.firstName?.[0]}{user?.lastName?.[0]}
            </div>
            {!isMobile && (
              <div style={{ textAlign:'left' }}>
                <div style={{ fontFamily:"'Cabinet Grotesk',sans-serif", fontSize:'0.8125rem', fontWeight:800, color:profileOpen?'#fff':'#000', lineHeight:1.2 }}>
                  {user?.firstName} {user?.lastName}
                </div>
                <div style={{ fontFamily:"'Satoshi',sans-serif", fontSize:'0.625rem', fontWeight:500, color:profileOpen?'#b7c6c2':'#666', textTransform:'capitalize' }}>
                  {user?.role}
                </div>
              </div>
            )}
          </button>

          <AnimatePresence>
            {profileOpen && (
              <motion.div
                initial={{ opacity:0, y:-8, scale:0.95 }}
                animate={{ opacity:1, y:0, scale:1 }}
                exit={{ opacity:0, y:-8, scale:0.95 }}
                transition={{ duration:0.15 }}
                style={{ position:'absolute', right:0, top:'calc(100% + 0.5rem)', width:200, background:'#fff', border:'2px solid #000', borderRadius:'0.75rem', boxShadow:'4px 4px 0px #000', overflow:'hidden', zIndex:50 }}
              >
                <div style={{ padding:'0.75rem 1rem', borderBottom:'1px solid rgba(0,0,0,0.1)' }}>
                  <div style={{ fontFamily:"'Satoshi',sans-serif", fontSize:'0.8125rem', fontWeight:500, color:'#555' }}>Signed in as</div>
                  <div style={{ fontFamily:"'Cabinet Grotesk',sans-serif", fontSize:'0.875rem', fontWeight:800, color:'#000', marginTop:2, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{user?.email}</div>
                </div>
                <button
                  onClick={async () => { await logout(); navigate('/login'); }}
                  style={{ width:'100%', display:'flex', alignItems:'center', gap:'0.75rem', padding:'0.75rem 1rem', border:'none', background:'transparent', cursor:'pointer', color:'#dc2626', fontFamily:"'Satoshi',sans-serif", fontSize:'0.875rem', fontWeight:700, transition:'background 0.15s' }}
                  onMouseEnter={e=>e.currentTarget.style.background='#fee2e2'}
                  onMouseLeave={e=>e.currentTarget.style.background='transparent'}
                >
                  <HiOutlineArrowRightOnRectangle size={16} /> Sign Out
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
};

export default Header;
