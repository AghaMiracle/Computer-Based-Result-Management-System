import { useState } from 'react';
import { motion } from 'framer-motion';
import { HiOutlineCog6Tooth, HiOutlineShieldCheck, HiOutlineBell, HiOutlineCircleStack } from 'react-icons/hi2';
import toast from 'react-hot-toast';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [selfRegistration, setSelfRegistration] = useState(true);
  const [require2FA, setRequire2FA] = useState(false);
  const [notifications, setNotifications] = useState([true, true, true, false]);

  const tabs = [
    { id: 'general', label: 'General', icon: HiOutlineCog6Tooth },
    { id: 'security', label: 'Security', icon: HiOutlineShieldCheck },
    { id: 'notifications', label: 'Notifications', icon: HiOutlineBell },
    { id: 'backup', label: 'Backup', icon: HiOutlineCircleStack }
  ];

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.025em', marginBottom: '0.25rem' }}>Settings</h1>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Configure platform-wide settings and policies</p>
      </motion.div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0.25rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border)', paddingBottom: '0' }}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              display: 'flex', alignItems: 'center', gap: '0.5rem',
              padding: '0.75rem 1.25rem', border: 'none', background: 'transparent',
              fontSize: '0.875rem', fontWeight: activeTab === tab.id ? 600 : 400,
              color: activeTab === tab.id ? 'var(--primary)' : 'var(--text-muted)',
              cursor: 'pointer', borderBottom: activeTab === tab.id ? '2px solid var(--primary)' : '2px solid transparent',
              transition: 'var(--transition)', marginBottom: '-1px', fontFamily: 'inherit'
            }}
          >
            <tab.icon size={18} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Settings Content */}
      <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="card">
        {activeTab === 'general' && (
          <div>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1.5rem', color: 'var(--text-primary)' }}>General Settings</h3>
            <div style={{ display: 'grid', gap: '1.25rem', maxWidth: 500 }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Platform Name</label>
                <input className="form-input" defaultValue="Student Result Management System" />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Default Grading Scale</label>
                <select className="form-input form-select">
                  <option>5-Point Scale (A=5.0, B=4.0, ...)</option>
                  <option>4-Point Scale (A=4.0, B=3.0, ...)</option>
                </select>
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Max CA Score</label>
                <input className="form-input" type="number" defaultValue="40" />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Max Exam Score</label>
                <input className="form-input" type="number" defaultValue="60" />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--text-primary)' }}>Allow Institution Self-Registration</div>
                  <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>Institutions can register without admin approval</div>
                </div>
                <label style={{ position: 'relative', display: 'inline-block', width: 44, height: 24 }}>
                  <input
                    type="checkbox"
                    checked={selfRegistration}
                    onChange={(e) => setSelfRegistration(e.target.checked)}
                    style={{ opacity: 0, width: 0, height: 0 }}
                  />
                  <span style={{
                    position: 'absolute', cursor: 'pointer', inset: 0,
                    background: selfRegistration ? '#10b981' : 'var(--border)', borderRadius: 24, transition: 'var(--transition)',
                    display: 'flex', alignItems: 'center'
                  }}>
                    <span style={{
                      width: 18, height: 18, background: 'white', borderRadius: '50%',
                      marginLeft: selfRegistration ? 22 : 3, transition: 'var(--transition)'
                    }} />
                  </span>
                </label>
              </div>
              <button className="btn btn-primary" onClick={() => toast.success('Settings saved!')} style={{ width: 'fit-content' }}>Save Changes</button>
            </div>
          </div>
        )}

        {activeTab === 'security' && (
          <div>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1.5rem', color: 'var(--text-primary)' }}>Security Settings</h3>
            <div style={{ display: 'grid', gap: '1.25rem', maxWidth: 500 }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Session Timeout (minutes)</label>
                <input className="form-input" type="number" defaultValue="60" />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Max Login Attempts</label>
                <input className="form-input" type="number" defaultValue="5" />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Password Min Length</label>
                <input className="form-input" type="number" defaultValue="8" />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--text-primary)' }}>Require 2FA for Admins</div>
                  <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>Two-factor authentication for admin accounts</div>
                </div>
                <label style={{ position: 'relative', display: 'inline-block', width: 44, height: 24 }}>
                  <input
                    type="checkbox"
                    checked={require2FA}
                    onChange={(e) => setRequire2FA(e.target.checked)}
                    style={{ opacity: 0, width: 0, height: 0 }}
                  />
                  <span style={{
                    position: 'absolute', cursor: 'pointer', inset: 0,
                    background: require2FA ? '#10b981' : 'var(--border)', borderRadius: 24, transition: 'var(--transition)',
                    display: 'flex', alignItems: 'center'
                  }}>
                    <span style={{
                      width: 18, height: 18, background: 'white', borderRadius: '50%',
                      marginLeft: require2FA ? 22 : 3, transition: 'var(--transition)'
                    }} />
                  </span>
                </label>
              </div>
              <button className="btn btn-primary" onClick={() => toast.success('Security settings saved!')} style={{ width: 'fit-content' }}>Save Changes</button>
            </div>
          </div>
        )}

        {activeTab === 'notifications' && (
          <div>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1.5rem', color: 'var(--text-primary)' }}>Notification Settings</h3>
            <div style={{ display: 'grid', gap: '1rem', maxWidth: 500 }}>
              {['Email on new institution registration', 'Email on result approval', 'Email on account creation', 'System maintenance alerts'].map((item, i) => {
                const isChecked = notifications[i];
                return (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem 0', borderBottom: '1px solid var(--border-light)' }}>
                    <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{item}</span>
                    <label style={{ position: 'relative', display: 'inline-block', width: 44, height: 24 }}>
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={(e) => {
                          const updated = [...notifications];
                          updated[i] = e.target.checked;
                          setNotifications(updated);
                        }}
                        style={{ opacity: 0, width: 0, height: 0 }}
                      />
                      <span style={{
                        position: 'absolute', cursor: 'pointer', inset: 0,
                        background: isChecked ? '#10b981' : 'var(--border)', borderRadius: 24,
                        display: 'flex', alignItems: 'center', transition: 'var(--transition)'
                      }}>
                        <span style={{
                          width: 18, height: 18, background: 'white', borderRadius: '50%',
                          marginLeft: isChecked ? 22 : 3, transition: 'var(--transition)'
                        }} />
                      </span>
                    </label>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === 'backup' && (
          <div>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1.5rem', color: 'var(--text-primary)' }}>Backup & Recovery</h3>
            <div style={{ display: 'grid', gap: '1rem', maxWidth: 500 }}>
              <div className="card" style={{ background: 'var(--bg-primary)' }}>
                <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>Last Backup</div>
                <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>June 4, 2026 at 12:00 AM (Automatic)</div>
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Backup Frequency</label>
                <select className="form-input form-select">
                  <option>Daily</option>
                  <option>Weekly</option>
                  <option>Monthly</option>
                </select>
              </div>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button className="btn btn-primary" onClick={() => toast.success('Backup started!')}>Create Backup Now</button>
                <button className="btn btn-outline">Download Last Backup</button>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Settings;
