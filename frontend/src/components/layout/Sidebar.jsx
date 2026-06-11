import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import {
  HiOutlineHome, HiOutlineUsers, HiOutlineUserGroup, HiOutlineBookOpen,
  HiOutlineAcademicCap, HiOutlineCalendarDays, HiOutlineClipboardDocumentCheck,
  HiOutlineChartBar, HiOutlineCog6Tooth, HiOutlineChevronLeft,
  HiOutlineDocumentText, HiOutlineBell, HiOutlineTableCells,
  HiOutlineRectangleGroup, HiOutlineClipboardDocumentList, HiOutlineUser
} from 'react-icons/hi2';

const roleNavItems = {
  institution: [
    { path: '/dashboard', icon: HiOutlineHome, label: 'Dashboard' },
    { path: '/dashboard/students', icon: HiOutlineAcademicCap, label: 'Students' },
    { path: '/dashboard/teachers', icon: HiOutlineUserGroup, label: 'Teachers' },
    { path: '/dashboard/departments', icon: HiOutlineRectangleGroup, label: 'Departments' },
    { path: '/dashboard/courses', icon: HiOutlineBookOpen, label: 'Courses' },
    { path: '/dashboard/sessions', icon: HiOutlineCalendarDays, label: 'Sessions' },
    { path: '/dashboard/grading-scales', icon: HiOutlineTableCells, label: 'Grading Scales' },
    { path: '/dashboard/result-approval', icon: HiOutlineClipboardDocumentCheck, label: 'Result Approval' },
    { path: '/dashboard/broadsheet', icon: HiOutlineTableCells, label: 'Broadsheet' },
    { path: '/dashboard/transcripts', icon: HiOutlineDocumentText, label: 'Transcripts' },
    { path: '/dashboard/notifications', icon: HiOutlineBell, label: 'Notifications' },
  ],
  teacher: [
    { path: '/dashboard', icon: HiOutlineHome, label: 'Dashboard' },
    { path: '/dashboard/my-courses', icon: HiOutlineBookOpen, label: 'My Courses' },
    { path: '/dashboard/result-entry', icon: HiOutlineClipboardDocumentList, label: 'Result Entry' },
    { path: '/dashboard/grade-book', icon: HiOutlineTableCells, label: 'Grade Book' },
    { path: '/dashboard/analytics', icon: HiOutlineChartBar, label: 'Analytics' },
    { path: '/dashboard/profile', icon: HiOutlineUser, label: 'Profile' },
  ],
  student: [
    { path: '/dashboard', icon: HiOutlineHome, label: 'Dashboard' },
    { path: '/dashboard/results', icon: HiOutlineDocumentText, label: 'My Results' },
    { path: '/dashboard/transcript', icon: HiOutlineClipboardDocumentList, label: 'Transcript' },
    { path: '/dashboard/course-registration', icon: HiOutlineBookOpen, label: 'Course Registration' },
    { path: '/dashboard/notifications', icon: HiOutlineBell, label: 'Notifications' },
    { path: '/dashboard/profile', icon: HiOutlineUser, label: 'Profile' },
  ]
};

const roleLabels = { institution: 'Institution Panel', teacher: 'Teacher Portal', student: 'Student Portal' };

const Sidebar = ({ collapsed, setCollapsed }) => {
  const location = useLocation();
  const { user } = useAuth();
  const navItems = roleNavItems[user?.role] || [];

  return (
    <motion.aside
      initial={false}
      animate={{ width: collapsed ? 72 : 260 }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      style={{
        position: 'fixed', left: 0, top: 0, bottom: 0,
        background: 'var(--bg-sidebar)', zIndex: 50,
        display: 'flex', flexDirection: 'column',
        borderRight: '1px solid rgba(255,255,255,0.06)', overflow: 'hidden'
      }}
    >
      <div style={{
        padding: collapsed ? '1.25rem 0.75rem' : '1.25rem 1.5rem',
        display: 'flex', alignItems: 'center', gap: '0.75rem',
        borderBottom: '1px solid rgba(255,255,255,0.06)', minHeight: 72
      }}>
        <div style={{
          width: 40, height: 40, borderRadius: 'var(--radius-sm)',
          background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
        }}>
          <HiOutlineAcademicCap style={{ color: 'white', fontSize: '1.25rem' }} />
        </div>
        <AnimatePresence>
          {!collapsed && (
            <motion.div initial={{ opacity: 0, width: 0 }} animate={{ opacity: 1, width: 'auto' }} exit={{ opacity: 0, width: 0 }}
              transition={{ duration: 0.2 }} style={{ overflow: 'hidden', whiteSpace: 'nowrap' }}
            >
              <div style={{ fontWeight: 700, fontSize: '0.9375rem', color: 'white', lineHeight: 1.2 }}>Result Manager</div>
              <div style={{ fontSize: '0.6875rem', color: 'rgba(255,255,255,0.4)', fontWeight: 500 }}>{roleLabels[user?.role]}</div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <nav style={{ flex: 1, padding: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.25rem', overflowY: 'auto' }}>
        {navItems.map((item) => {
          const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));
          return (
            <NavLink key={item.path} to={item.path}
              style={{
                display: 'flex', alignItems: 'center', gap: '0.75rem',
                padding: collapsed ? '0.75rem' : '0.75rem 1rem',
                borderRadius: 'var(--radius-sm)', textDecoration: 'none',
                color: isActive ? 'white' : 'rgba(255,255,255,0.5)',
                background: isActive ? 'linear-gradient(135deg, rgba(59,130,246,0.2), rgba(5,150,105,0.15))' : 'transparent',
                transition: 'var(--transition)', justifyContent: collapsed ? 'center' : 'flex-start',
                position: 'relative', fontSize: '0.875rem', fontWeight: isActive ? 600 : 400
              }}
              onMouseEnter={(e) => { if (!isActive) { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = 'rgba(255,255,255,0.8)'; } }}
              onMouseLeave={(e) => { if (!isActive) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(255,255,255,0.5)'; } }}
            >
              {isActive && (
                <motion.div layoutId="sidebarIndicator" style={{
                  position: 'absolute', left: 0, top: '50%', transform: 'translateY(-50%)',
                  width: 3, height: 24, borderRadius: '0 4px 4px 0',
                  background: 'linear-gradient(180deg, var(--primary-light), var(--secondary))'
                }} transition={{ type: 'spring', stiffness: 500, damping: 30 }} />
              )}
              <item.icon style={{ fontSize: '1.25rem', flexShrink: 0 }} />
              <AnimatePresence>
                {!collapsed && (
                  <motion.span initial={{ opacity: 0, width: 0 }} animate={{ opacity: 1, width: 'auto' }} exit={{ opacity: 0, width: 0 }}
                    transition={{ duration: 0.2 }} style={{ overflow: 'hidden', whiteSpace: 'nowrap' }}>
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
            </NavLink>
          );
        })}
      </nav>

      <div style={{ padding: '0.75rem', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <button onClick={() => setCollapsed(!collapsed)}
          style={{
            width: '100%', display: 'flex', alignItems: 'center',
            justifyContent: collapsed ? 'center' : 'flex-start', gap: '0.75rem',
            padding: '0.75rem', borderRadius: 'var(--radius-sm)', background: 'transparent',
            border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', fontSize: '0.8125rem'
          }}
        >
          <motion.div animate={{ rotate: collapsed ? 180 : 0 }} transition={{ duration: 0.3 }}>
            <HiOutlineChevronLeft style={{ fontSize: '1.125rem' }} />
          </motion.div>
          <AnimatePresence>
            {!collapsed && <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>Collapse</motion.span>}
          </AnimatePresence>
        </button>
      </div>
    </motion.aside>
  );
};

export default Sidebar;
