import { Link, useLocation } from 'react-router-dom';
import { HiOutlineChevronRight, HiOutlineHome } from 'react-icons/hi2';
import { motion } from 'framer-motion';

const routeLabels = {
  '': 'Dashboard',
  'institutions': 'Institutions',
  'users': 'Users',
  'audit-logs': 'Audit Logs',
  'settings': 'Settings'
};

const Breadcrumb = () => {
  const location = useLocation();
  const pathSegments = location.pathname.split('/').filter(Boolean);

  if (pathSegments.length === 0) return null;

  return (
    <motion.nav
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        fontSize: '0.8125rem',
        color: 'var(--text-muted)',
        marginBottom: '1.25rem'
      }}
    >
      <Link to="/" style={{ color: 'var(--text-muted)', textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
        <HiOutlineHome size={14} />
      </Link>

      {pathSegments.map((segment, index) => {
        const path = '/' + pathSegments.slice(0, index + 1).join('/');
        const isLast = index === pathSegments.length - 1;
        const label = routeLabels[segment] || segment.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());

        return (
          <span key={path} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <HiOutlineChevronRight size={12} />
            {isLast ? (
              <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{label}</span>
            ) : (
              <Link to={path} style={{ color: 'var(--text-muted)', textDecoration: 'none', transition: 'color 0.2s' }}
                onMouseEnter={(e) => e.target.style.color = 'var(--primary)'}
                onMouseLeave={(e) => e.target.style.color = 'var(--text-muted)'}
              >
                {label}
              </Link>
            )}
          </span>
        );
      })}
    </motion.nav>
  );
};

export default Breadcrumb;
