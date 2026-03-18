import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Settings, Bookmark, Briefcase, BadgeCheck, Globe, Gift, BarChart2, Moon, LogOut } from 'lucide-react';

export default function RightSidebar({ user, isDarkMode, onToggleTheme }) {
  const navigate = useNavigate();
  const location = useLocation();
  const isProfilePage = location.pathname === '/profile';
  const settingsLinks = [
    { icon: <Settings className="nav-icon" />, title: 'Settings', subtitle: 'Edit profile, account, notifications, +2 more.' },
    { icon: <Bookmark className="nav-icon" />, title: 'Bookmarks', subtitle: 'Saved projects and posts to visit later.' },
    { icon: <Briefcase className="nav-icon" />, title: 'Job Preferences', subtitle: 'Your availability and role preferences.' },
    { icon: <BadgeCheck className="nav-icon" />, title: 'Verification', subtitle: 'Manage Identity and other verifications.' },
    { icon: <Globe className="nav-icon" />, title: 'Custom Domain', subtitle: 'Use your profile as portfolio on your domain.', tag: 'Not Connected', tagColor: '#ef4444', tagBg: '#fee2e2' },
    { icon: <Gift className="nav-icon" />, title: 'Invite and Earn', subtitle: 'See who joined using your invite link.', tag: 'New', tagColor: 'var(--accent-color)', tagBg: '#dcfce7' },
    { icon: <BarChart2 className="nav-icon" />, title: 'Analytics', subtitle: 'Views, clicks, and who viewed your profile.' },
    { icon: <LogOut className="nav-icon" color="#ef4444" />, title: 'Log Out', subtitle: 'Sign out of your account.', action: () => { localStorage.removeItem('token'); window.location.href = '/login'; } },
  ];

  return (
    <div style={{ padding: '24px 0' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '32px' }}>
        <button onClick={onToggleTheme} style={{ width: 40, height: 40, borderRadius: '50%', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Moon size={20} fill={isDarkMode ? 'currentColor' : 'none'} />
        </button>
        <button style={{ width: 40, height: 40, borderRadius: '50%', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span>✕</span>
        </button>
      </div>

      <div
        onClick={() => navigate('/profile')}
        style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '28px', cursor: 'pointer' }}
      >
        <img src={user.avatar_url} alt={user.full_name} style={{ width: 44, height: 44, borderRadius: '50%', backgroundColor: '#e5e7eb' }} />
        <div>
          <div style={{ fontSize: '15px', fontWeight: 700 }}>{user.full_name}</div>
          <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{user.title}</div>
        </div>
      </div>

      {isProfilePage && (
        <div style={{ display: 'grid', gap: '14px', marginBottom: '28px', padding: '18px', borderRadius: '18px', border: '1px solid var(--border-color)', background: 'var(--surface-color)' }}>
          <div style={{ fontSize: '14px', fontWeight: 800 }}>Profile Analytics</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
            {[
              { label: 'Views', value: '1.2K' },
              { label: 'Clicks', value: '286' },
              { label: 'Followers', value: '148' },
            ].map((item) => (
              <div key={item.label} style={{ padding: '10px', borderRadius: '14px', border: '1px solid var(--border-color)', background: 'rgba(0,0,0,0.02)', textAlign: 'center' }}>
                <div style={{ fontWeight: 800 }}>{item.value}</div>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{item.label}</div>
              </div>
            ))}
          </div>
          <div style={{ height: '88px', borderRadius: '16px', border: '1px solid var(--border-color)', background: 'linear-gradient(180deg, rgba(0, 137, 56, 0.12), rgba(0, 137, 56, 0.02))', position: 'relative', overflow: 'hidden' }}>
            <svg viewBox="0 0 240 88" preserveAspectRatio="none" style={{ width: '100%', height: '100%' }}>
              <path d="M0,64 C30,58 40,20 70,28 C100,36 110,70 140,56 C170,42 180,18 210,24 C225,27 232,34 240,18" fill="none" stroke="var(--accent-color)" strokeWidth="3" />
            </svg>
          </div>
          <button type="button" style={{ padding: '12px 14px', borderRadius: '999px', background: 'linear-gradient(135deg, var(--accent-color), #15b86a)', color: '#fff', fontSize: '14px', fontWeight: 700 }}>
            Analytics Dashboard
          </button>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {settingsLinks.map((link, idx) => (
          <div 
            key={idx} 
            style={{ display: 'flex', gap: '16px', cursor: 'pointer' }}
            onClick={() => link.action && link.action()}
          >
            <div style={{ marginTop: '2px' }}>{link.icon}</div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontWeight: 500, fontSize: '15px' }}>{link.title}</span>
                {link.tag && (
                  <span style={{ fontSize: '11px', fontWeight: 600, color: link.tagColor, backgroundColor: link.tagBg, padding: '2px 6px', borderRadius: '4px' }}>
                    {link.tag}
                  </span>
                )}
              </div>
              <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                {link.subtitle}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
