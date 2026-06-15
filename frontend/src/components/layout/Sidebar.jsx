import { NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import {
  HiOutlineHome, HiOutlineUserGroup, HiOutlineBookOpen,
  HiOutlineAcademicCap, HiOutlineCalendarDays, HiOutlineClipboardDocumentCheck,
  HiOutlineChartBar, HiOutlineChevronLeft, HiOutlineDocumentText, HiOutlineBell,
  HiOutlineTableCells, HiOutlineRectangleGroup, HiOutlineClipboardDocumentList,
  HiOutlineUser, HiOutlineBolt, HiOutlineXMark,
} from 'react-icons/hi2';

const roleNavItems = {
  institution: [
    { path: '/dashboard',                    icon: HiOutlineHome,                     label: 'Dashboard' },
    { path: '/dashboard/students',           icon: HiOutlineAcademicCap,              label: 'Students' },
    { path: '/dashboard/teachers',           icon: HiOutlineUserGroup,                label: 'Teachers' },
    { path: '/dashboard/departments',        icon: HiOutlineRectangleGroup,           label: 'Departments' },
    { path: '/dashboard/courses',            icon: HiOutlineBookOpen,                 label: 'Courses' },
    { path: '/dashboard/sessions',           icon: HiOutlineCalendarDays,             label: 'Sessions' },
    { path: '/dashboard/grading-scales',     icon: HiOutlineTableCells,               label: 'Grading Scales' },
    { path: '/dashboard/result-approval',    icon: HiOutlineClipboardDocumentCheck,   label: 'Result Approval' },
    { path: '/dashboard/broadsheet',         icon: HiOutlineTableCells,               label: 'Broadsheet' },
    { path: '/dashboard/transcripts',        icon: HiOutlineDocumentText,             label: 'Transcripts' },
    { path: '/dashboard/notifications',      icon: HiOutlineBell,                     label: 'Notifications' },
  ],
  teacher: [
    { path: '/dashboard',               icon: HiOutlineHome,                    label: 'Dashboard' },
    { path: '/dashboard/my-courses',    icon: HiOutlineBookOpen,                label: 'My Courses' },
    { path: '/dashboard/result-entry',  icon: HiOutlineClipboardDocumentList,   label: 'Result Entry' },
    { path: '/dashboard/grade-book',    icon: HiOutlineTableCells,              label: 'Grade Book' },
    { path: '/dashboard/analytics',     icon: HiOutlineChartBar,                label: 'Analytics' },
    { path: '/dashboard/profile',       icon: HiOutlineUser,                    label: 'Profile' },
  ],
  student: [
    { path: '/dashboard',                        icon: HiOutlineHome,                    label: 'Dashboard' },
    { path: '/dashboard/results',                icon: HiOutlineDocumentText,             label: 'My Results' },
    { path: '/dashboard/transcript',             icon: HiOutlineClipboardDocumentList,    label: 'Transcript' },
    { path: '/dashboard/course-registration',    icon: HiOutlineBookOpen,                 label: 'Course Registration' },
    { path: '/dashboard/notifications',          icon: HiOutlineBell,                     label: 'Notifications' },
    { path: '/dashboard/profile',                icon: HiOutlineUser,                     label: 'Profile' },
  ],
};

const roleLabels = {
  institution: 'Institution Panel',
  teacher:     'Teacher Portal',
  student:     'Student Portal',
};

const Sidebar = ({ collapsed, setCollapsed, mobileOpen, isMobile, onNavClick }) => {
  const location = useLocation();
  const { user } = useAuth();
  const navItems = roleNavItems[user?.role] || [];

  const showLabel = isMobile ? true : !collapsed;

  const sidebarStyle = isMobile
    ? {
        position: 'fixed', left: 0, top: 0, bottom: 0, width: 272,
        zIndex: 50, background: '#111611', borderRight: '2px solid #000',
        display: 'flex', flexDirection: 'column', overflow: 'hidden',
        transform: mobileOpen ? 'translateX(0)' : 'translateX(-100%)',
        transition: 'transform 0.28s cubic-bezier(0.4, 0, 0.2, 1)',
      }
    : {
        position: 'fixed', left: 0, top: 0, bottom: 0,
        width: collapsed ? 72 : 260,
        zIndex: 50, background: '#111611', borderRight: '2px solid #000',
        display: 'flex', flexDirection: 'column', overflow: 'hidden',
        transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      };

  return (
    <div style={sidebarStyle}>
      {/* ── Logo ── */}
      <div style={{
        padding: showLabel ? '1.125rem 1.125rem' : '1.125rem 0.75rem',
        display: 'flex', alignItems: 'center', gap: '0.75rem',
        borderBottom: '2px solid #000', minHeight: 68, background: '#171e19',
        justifyContent: showLabel ? 'flex-start' : 'center',
      }}>
        <div style={{ width:34, height:34, flexShrink:0, background:'#ffe17c', border:'2px solid #000', borderRadius:'0.5rem', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'2px 2px 0px #000' }}>
          <HiOutlineBolt style={{ color:'#000', fontSize:'1rem' }} />
        </div>
        {showLabel && (
          <div style={{ flex:1, overflow:'hidden', whiteSpace:'nowrap' }}>
            <div style={{ fontFamily:"'Cabinet Grotesk',sans-serif", fontWeight:800, fontSize:'0.9375rem', color:'#fff', lineHeight:1.2, letterSpacing:'-0.02em' }}>Result Manager</div>
            <div style={{ fontFamily:"'Satoshi',sans-serif", fontSize:'0.6875rem', color:'#b7c6c2', fontWeight:500 }}>{roleLabels[user?.role]}</div>
          </div>
        )}
        {/* Close button – mobile only */}
        {isMobile && (
          <button onClick={onNavClick}
            style={{ background:'none', border:'none', color:'#b7c6c2', cursor:'pointer', padding:4, display:'flex', marginLeft:'auto', flexShrink:0 }}>
            <HiOutlineXMark style={{ fontSize:'1.375rem' }} />
          </button>
        )}
      </div>

      {/* ── Navigation ── */}
      <nav style={{ flex:1, padding:'0.625rem', display:'flex', flexDirection:'column', gap:'0.2rem', overflowY:'auto' }}>
        {navItems.map(item => {
          const isActive = location.pathname === item.path ||
            (item.path !== '/dashboard' && location.pathname.startsWith(item.path));
          return (
            <NavLink
              key={item.path} to={item.path}
              onClick={isMobile ? onNavClick : undefined}
              style={{
                display: 'flex', alignItems: 'center', gap: '0.75rem',
                padding: showLabel ? '0.625rem 0.875rem' : '0.75rem',
                justifyContent: showLabel ? 'flex-start' : 'center',
                borderRadius: '0.5rem', textDecoration: 'none',
                color: isActive ? '#000' : '#b7c6c2',
                background: isActive ? '#ffe17c' : 'transparent',
                border: isActive ? '2px solid #000' : '2px solid transparent',
                boxShadow: isActive ? '3px 3px 0px #000' : 'none',
                transition: 'all 0.15s',
                fontFamily: "'Satoshi',sans-serif", fontSize: '0.875rem', fontWeight: isActive ? 700 : 500,
              }}
              onMouseEnter={e => { if (!isActive) { e.currentTarget.style.background='rgba(183,198,194,0.1)'; e.currentTarget.style.color='#fff'; e.currentTarget.style.border='2px solid rgba(183,198,194,0.3)'; }}}
              onMouseLeave={e => { if (!isActive) { e.currentTarget.style.background='transparent'; e.currentTarget.style.color='#b7c6c2'; e.currentTarget.style.border='2px solid transparent'; }}}
            >
              <item.icon style={{ fontSize:'1.125rem', flexShrink:0 }} />
              {showLabel && <span style={{ whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{item.label}</span>}
            </NavLink>
          );
        })}
      </nav>

      {/* ── Collapse button – desktop only ── */}
      {!isMobile && (
        <div style={{ padding:'0.625rem', borderTop:'2px solid #000' }}>
          <button onClick={() => setCollapsed(!collapsed)}
            style={{
              width:'100%', display:'flex', alignItems:'center',
              justifyContent: showLabel ? 'flex-start' : 'center', gap:'0.75rem',
              padding:'0.625rem 0.75rem', borderRadius:'0.5rem',
              background:'transparent', border:'2px solid transparent',
              color:'#b7c6c2', cursor:'pointer',
              fontFamily:"'Satoshi',sans-serif", fontSize:'0.8125rem', fontWeight:500,
              transition:'all 0.15s',
            }}
            onMouseEnter={e=>{e.currentTarget.style.background='rgba(255,225,124,0.1)';e.currentTarget.style.color='#ffe17c';e.currentTarget.style.border='2px solid rgba(255,225,124,0.3)';}}
            onMouseLeave={e=>{e.currentTarget.style.background='transparent';e.currentTarget.style.color='#b7c6c2';e.currentTarget.style.border='2px solid transparent';}}
          >
            <motion.div animate={{ rotate: collapsed ? 180 : 0 }} transition={{ duration: 0.3 }}>
              <HiOutlineChevronLeft style={{ fontSize:'1.125rem' }} />
            </motion.div>
            {showLabel && <span>Collapse</span>}
          </button>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
