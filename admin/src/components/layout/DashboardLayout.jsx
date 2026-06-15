import { useState, useEffect } from 'react';
import { Outlet, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Sidebar from './Sidebar';
import Header from './Header';
import { motion } from 'framer-motion';

const MOBILE_BP = 768;

const DashboardLayout = () => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();
  const [collapsed, setCollapsed]   = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isMobile, setIsMobile]     = useState(() => window.innerWidth <= MOBILE_BP);

  useEffect(() => {
    const onResize = () => {
      const mobile = window.innerWidth <= MOBILE_BP;
      setIsMobile(mobile);
      if (!mobile) setMobileOpen(false);
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  /* close drawer on nav */
  useEffect(() => { setMobileOpen(false); }, [location.pathname]);

  if (loading) {
    return (
      <div style={{ height:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'#171e19', backgroundImage:'radial-gradient(circle, rgba(183,198,194,0.08) 1px, transparent 1px)', backgroundSize:'32px 32px' }}>
        <div style={{ textAlign:'center' }}>
          <motion.div animate={{ rotate:360 }} transition={{ duration:1, repeat:Infinity, ease:'linear' }}
            style={{ width:44, height:44, margin:'0 auto 1rem', border:'3px solid #272727', borderTopColor:'#ffe17c', borderRadius:'50%' }} />
          <p style={{ fontFamily:"'Satoshi',sans-serif", fontWeight:700, color:'#b7c6c2', fontSize:'0.875rem' }}>Loading…</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  const sidebarWidth = isMobile ? 0 : collapsed ? 72 : 260;

  return (
    <div style={{ display:'flex', minHeight:'100vh', background:'#f5f5f0' }}>

      {/* Mobile overlay */}
      {isMobile && (
        <div
          className={`sidebar-overlay${mobileOpen ? ' active' : ''}`}
          onClick={() => setMobileOpen(false)}
        />
      )}

      <Sidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        mobileOpen={mobileOpen}
        isMobile={isMobile}
        onNavClick={() => setMobileOpen(false)}
      />

      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0,
        marginLeft: sidebarWidth,
        transition: 'margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      }}>
        <Header onMenuClick={() => setMobileOpen(true)} isMobile={isMobile} />
        <div className="page-content" style={{ flex:1, maxWidth:1400, width:'100%', margin:'0 auto' }}>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
