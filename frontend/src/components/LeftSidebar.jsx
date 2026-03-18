import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Rocket, FileText, Briefcase, MessageSquare, Search, Megaphone } from 'lucide-react';

export default function LeftSidebar({ user }) {
  return (
    <div style={{ padding: '24px 0', position: 'sticky', top: 0 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '0 12px', marginBottom: '32px' }}>
        <div style={{ backgroundColor: 'var(--accent-color)', color: 'white', fontWeight: 'bold', padding: '4px 8px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '32px', height: '32px', fontSize: '20px' }}>P</div>
        <div style={{ fontSize: '24px', fontWeight: 'bold', letterSpacing: '-0.5px' }}>Peerlist</div>
      </div>

      <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <NavLink to="/" end className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}>
          <Home className="nav-icon" />
          <span>Scroll</span>
        </NavLink>
        <NavLink to="/launchpad" className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}>
          <Rocket className="nav-icon" />
          <span>Launchpad</span>
        </NavLink>
        <div className="nav-item">
          <FileText className="nav-icon" />
          <span>Articles</span>
        </div>
        <NavLink to="/jobs" className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}>
          <Briefcase className="nav-icon" />
          <span>Jobs</span>
        </NavLink>
        <div className="nav-item">
          <MessageSquare className="nav-icon" />
          <span>Inbox</span>
        </div>
        <div className="nav-item">
          <Search className="nav-icon" />
          <span>Search</span>
        </div>
        <div className="nav-item">
          <Megaphone className="nav-icon" />
          <span>Advertise</span>
        </div>
      </nav>

      <div style={{ marginTop: 'auto', paddingTop: '100px', paddingBottom: '20px', paddingLeft: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
          <img 
            src={user.avatar_url || "https://api.dicebear.com/7.x/avataaars/svg?seed=fallback"} 
            alt="Profile" 
            style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#e5e7eb' }}
          />
          <div>
            <div style={{ fontWeight: '600', fontSize: '14px' }}>{user.full_name}</div>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>0 followers • 0 following →</div>
          </div>
        </div>
      </div>
    </div>
  );
}
