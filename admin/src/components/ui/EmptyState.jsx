import { motion } from 'framer-motion';

const EmptyState = ({
  icon = '📭',
  title = 'No data found',
  description = 'There are no items to display at the moment.',
  action,
  actionLabel = 'Get Started'
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="card"
    style={{
      textAlign: 'center',
      padding: '4rem 2rem',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '0.75rem'
    }}
  >
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: 'spring', damping: 15, delay: 0.2 }}
      style={{ fontSize: '3.5rem', lineHeight: 1 }}
    >
      {icon}
    </motion.div>
    <h3 style={{
      fontSize: '1.125rem',
      fontWeight: 700,
      color: 'var(--text-primary)',
      marginTop: '0.5rem'
    }}>
      {title}
    </h3>
    <p style={{
      color: 'var(--text-muted)',
      fontSize: '0.875rem',
      maxWidth: 400,
      lineHeight: 1.6
    }}>
      {description}
    </p>
    {action && (
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="btn btn-primary"
        onClick={action}
        style={{ marginTop: '0.75rem' }}
      >
        {actionLabel}
      </motion.button>
    )}
  </motion.div>
);

export default EmptyState;
