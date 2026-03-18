import React, { useMemo, useState } from 'react';
import { FolderPlus, Github, Linkedin, MapPin, Pencil, Plus } from 'lucide-react';
import { useOutletContext } from 'react-router-dom';

const tabs = ['WORK', 'RESUME', 'COLLECTIONS', 'ARTICLES', 'POSTS'];
const showcasePlatforms = [
  { name: 'GitHub', icon: Github },
  { name: 'LinkedIn', icon: Linkedin },
  { name: 'Add Project', icon: FolderPlus },
];

export default function Profile() {
  const { user, updateUserProfile } = useOutletContext();
  const [activeTab, setActiveTab] = useState('WORK');
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [authModal, setAuthModal] = useState({ open: false, platform: null });
  const [projectModalOpen, setProjectModalOpen] = useState(false);
  const [projects, setProjects] = useState([]);
  const [projectForm, setProjectForm] = useState({ name: '', link: '', description: '' });
  const [formData, setFormData] = useState({
    full_name: user.full_name || '',
    bio: user.bio || 'Building useful things, sharing work, and exploring new opportunities.',
    location: user.location || 'India',
  });
  const [saveError, setSaveError] = useState('');

  const joinedDate = useMemo(() => {
    const value = user.created_at ? new Date(user.created_at) : new Date();
    return value.toLocaleDateString(undefined, { month: 'long', year: 'numeric' });
  }, [user.created_at]);

  const handleSave = async (event) => {
    event.preventDefault();
    setSaveError('');
    try {
      await updateUserProfile(formData);
      setIsEditOpen(false);
    } catch {
      setSaveError('Unable to update profile right now. Please try again.');
    }
  };

  const handleWorkCardClick = (platform) => {
    if (platform === 'GitHub' || platform === 'LinkedIn') {
      setAuthModal({ open: true, platform });
      return;
    }

    if (platform === 'Add Project') {
      setProjectModalOpen(true);
    }
  };

  const handleProjectSave = (event) => {
    event.preventDefault();
    if (!projectForm.name.trim() || !projectForm.link.trim() || !projectForm.description.trim()) {
      return;
    }

    setProjects((current) => [
      {
        id: `project-${Date.now()}`,
        name: projectForm.name.trim(),
        link: projectForm.link.trim(),
        description: projectForm.description.trim(),
      },
      ...current,
    ]);
    setProjectForm({ name: '', link: '', description: '' });
    setProjectModalOpen(false);
  };

  return (
    <>
      <section style={sectionStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '20px', alignItems: 'flex-start', flexWrap: 'wrap', marginBottom: '28px' }}>
          <div style={{ display: 'flex', gap: '18px', alignItems: 'flex-start' }}>
            <img src={user.avatar_url} alt={user.full_name} style={{ width: '88px', height: '88px', borderRadius: '24px', background: '#e5e7eb' }} />
            <div>
              <h1 style={{ margin: 0, fontSize: '30px' }}>{user.full_name}</h1>
              <div style={{ marginTop: '8px', color: 'var(--text-secondary)', maxWidth: '560px' }}>{user.bio || 'Building useful things, sharing work, and exploring new opportunities.'}</div>
              <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', marginTop: '14px', color: 'var(--text-secondary)', fontSize: '14px' }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}><MapPin size={15} /> {user.location || 'India'}</span>
                <span>Joined {joinedDate}</span>
              </div>
            </div>
          </div>

          <button type="button" onClick={() => setIsEditOpen(true)} style={editButtonStyle}>
            <Pencil size={16} />
            Edit Profile
          </button>
        </div>

        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '24px' }}>
          {tabs.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              style={{
                padding: '8px 12px',
                borderRadius: '999px',
                border: activeTab === tab ? '1px solid var(--accent-color)' : '1px solid var(--border-color)',
                background: activeTab === tab ? 'rgba(0, 137, 56, 0.08)' : 'var(--surface-color)',
                color: activeTab === tab ? 'var(--accent-color)' : 'var(--text-secondary)',
                fontSize: '12px',
                fontWeight: 800,
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        {activeTab === 'WORK' ? (
          <div style={{ display: 'grid', gap: '18px' }}>
            <div>
              <h2 style={{ margin: 0, fontSize: '22px' }}>Showcase your work from:</h2>
              <p style={{ margin: '8px 0 0', color: 'var(--text-secondary)' }}>Connect your profiles or add standout projects manually.</p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px' }}>
              {showcasePlatforms.map((platform) => {
                const Icon = platform.icon;
                return (
                  <div key={platform.name} onClick={() => handleWorkCardClick(platform.name)} style={workCardStyle}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={workIconStyle}>
                        <Icon size={20} />
                      </div>
                      <div style={{ fontWeight: 700 }}>{platform.name}</div>
                    </div>
                    <button type="button" onClick={(event) => { event.stopPropagation(); handleWorkCardClick(platform.name); }} style={plusButtonStyle}>
                      <Plus size={16} />
                    </button>
                  </div>
                );
              })}
            </div>

            {projects.length > 0 && (
              <div style={{ display: 'grid', gap: '14px', marginTop: '6px' }}>
                <div style={{ fontSize: '18px', fontWeight: 700 }}>Added Projects</div>
                {projects.map((project) => (
                  <div key={project.id} style={{ padding: '18px', borderRadius: '18px', border: '1px solid var(--border-color)', background: 'var(--surface-color)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px', alignItems: 'flex-start' }}>
                      <div>
                        <div style={{ fontSize: '18px', fontWeight: 700 }}>{project.name}</div>
                        <a href={project.link} target="_blank" rel="noreferrer" style={{ marginTop: '6px', display: 'inline-block', color: 'var(--accent-color)', fontWeight: 600 }}>
                          {project.link}
                        </a>
                      </div>
                    </div>
                    <p style={{ margin: '10px 0 0', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{project.description}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div style={placeholderStyle}>{activeTab} content coming soon.</div>
        )}
      </section>

      {isEditOpen && (
        <ModalShell onClose={() => setIsEditOpen(false)}>
          <div style={{ marginBottom: '18px' }}>
            <h3 style={{ margin: 0, fontSize: '24px' }}>Edit Profile</h3>
            <p style={{ margin: '8px 0 0', color: 'var(--text-secondary)' }}>Update your basic profile details.</p>
          </div>
          <form onSubmit={handleSave} style={{ display: 'grid', gap: '16px' }}>
            <ProfileField label="Name">
              <input value={formData.full_name} onChange={(event) => setFormData((current) => ({ ...current, full_name: event.target.value }))} style={inputStyle} />
            </ProfileField>
            <ProfileField label="Bio">
              <textarea value={formData.bio} onChange={(event) => setFormData((current) => ({ ...current, bio: event.target.value }))} style={textareaStyle} />
            </ProfileField>
            <ProfileField label="Location">
              <input value={formData.location} onChange={(event) => setFormData((current) => ({ ...current, location: event.target.value }))} style={inputStyle} />
            </ProfileField>
            {saveError && <div style={{ color: '#b42318', fontSize: '13px', fontWeight: 600 }}>{saveError}</div>}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button type="button" onClick={() => setIsEditOpen(false)} style={cancelButtonStyle}>Cancel</button>
              <button type="submit" style={primaryButtonStyle}>Save Changes</button>
            </div>
          </form>
        </ModalShell>
      )}

      {authModal.open && (
        <AuthModal platform={authModal.platform} onClose={() => setAuthModal({ open: false, platform: null })} />
      )}

      {projectModalOpen && (
        <ModalShell onClose={() => setProjectModalOpen(false)} dark>
          <div style={{ marginBottom: '18px' }}>
            <h3 style={{ margin: 0, fontSize: '24px', color: '#f8fafc' }}>Add Project</h3>
            <p style={{ margin: '8px 0 0', color: '#94a3b8' }}>Share a project that represents your best work.</p>
          </div>
          <form onSubmit={handleProjectSave} style={{ display: 'grid', gap: '16px' }}>
            <ProfileField label="Project Name" dark>
              <input value={projectForm.name} onChange={(event) => setProjectForm((current) => ({ ...current, name: event.target.value }))} style={darkInputStyle} />
            </ProfileField>
            <ProfileField label="Project Link" dark>
              <input value={projectForm.link} onChange={(event) => setProjectForm((current) => ({ ...current, link: event.target.value }))} style={darkInputStyle} />
            </ProfileField>
            <ProfileField label="Description" dark>
              <textarea value={projectForm.description} onChange={(event) => setProjectForm((current) => ({ ...current, description: event.target.value }))} style={darkTextareaStyle} />
            </ProfileField>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button type="button" onClick={() => setProjectModalOpen(false)} style={darkCancelButtonStyle}>Cancel</button>
              <button type="submit" style={primaryButtonStyle}>Save Project</button>
            </div>
          </form>
        </ModalShell>
      )}
    </>
  );
}

function AuthModal({ platform, onClose }) {
  const redirectUrl = platform === 'LinkedIn'
    ? 'https://www.linkedin.com/oauth/v2/authorization'
    : 'https://github.com/login/oauth/authorize';
  const Icon = platform === 'LinkedIn' ? Linkedin : Github;

  return (
    <ModalShell onClose={onClose} dark>
      <div style={{ display: 'grid', gap: '18px', textAlign: 'center' }}>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <div style={{ width: '64px', height: '64px', borderRadius: '20px', background: 'rgba(34, 197, 94, 0.14)', color: '#4ade80', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon size={28} />
          </div>
        </div>
        <div>
          <h3 style={{ margin: 0, fontSize: '24px', color: '#f8fafc' }}>Connect {platform}</h3>
          <p style={{ margin: '8px 0 0', color: '#94a3b8', lineHeight: 1.6 }}>Authorize Peerlist-style access to import your {platform} work into your profile.</p>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
          <button type="button" onClick={onClose} style={darkCancelButtonStyle}>Cancel</button>
          <button type="button" onClick={() => { window.location.href = redirectUrl; }} style={primaryButtonStyle}>Authorize</button>
        </div>
      </div>
    </ModalShell>
  );
}

function ModalShell({ children, onClose, dark = false }) {
  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: dark ? 'rgba(2, 6, 23, 0.7)' : 'rgba(15, 23, 42, 0.45)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', zIndex: 220 }}>
      <div onClick={(event) => event.stopPropagation()} style={{ width: 'min(560px, 100%)', borderRadius: '24px', border: dark ? '1px solid #334155' : '1px solid var(--border-color)', background: dark ? '#0f172a' : 'var(--surface-color)', padding: '24px', boxShadow: '0 24px 60px rgba(15, 23, 42, 0.18)' }}>
        {children}
      </div>
    </div>
  );
}

function ProfileField({ label, children, dark = false }) {
  return (
    <label style={{ display: 'grid', gap: '8px' }}>
      <span style={{ fontSize: '14px', fontWeight: 700, color: dark ? '#e2e8f0' : 'var(--text-primary)' }}>{label}</span>
      {children}
    </label>
  );
}

const sectionStyle = {
  background: 'var(--card-bg)',
  border: '1px solid var(--border-color)',
  borderRadius: '24px',
  padding: '32px',
  boxShadow: 'var(--shadow-sm)',
};

const workCardStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '12px',
  padding: '18px',
  borderRadius: '18px',
  border: '1px solid var(--border-color)',
  background: 'var(--surface-color)',
  cursor: 'pointer',
};

const workIconStyle = {
  width: '42px',
  height: '42px',
  borderRadius: '14px',
  background: 'rgba(0, 137, 56, 0.08)',
  color: 'var(--accent-color)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

const plusButtonStyle = {
  width: '32px',
  height: '32px',
  borderRadius: '999px',
  border: '1px solid var(--border-color)',
  background: 'var(--surface-color)',
  color: 'var(--text-primary)',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
};

const editButtonStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '8px',
  padding: '12px 16px',
  borderRadius: '999px',
  border: '1px solid var(--border-color)',
  background: 'var(--surface-color)',
  color: 'var(--text-primary)',
  fontSize: '14px',
  fontWeight: 700,
};

const placeholderStyle = {
  padding: '28px',
  borderRadius: '18px',
  border: '1px solid var(--border-color)',
  color: 'var(--text-secondary)',
  textAlign: 'center',
};

const inputStyle = {
  width: '100%',
  minHeight: '48px',
  padding: '0 14px',
  borderRadius: '14px',
  border: '1px solid var(--border-color)',
  background: 'var(--surface-color)',
  color: 'var(--text-primary)',
  font: 'inherit',
  outline: 'none',
};

const textareaStyle = {
  width: '100%',
  minHeight: '120px',
  padding: '14px',
  borderRadius: '14px',
  border: '1px solid var(--border-color)',
  background: 'var(--surface-color)',
  color: 'var(--text-primary)',
  font: 'inherit',
  outline: 'none',
  resize: 'vertical',
};

const darkInputStyle = {
  ...inputStyle,
  border: '1px solid #334155',
  background: '#111827',
  color: '#f8fafc',
};

const darkTextareaStyle = {
  ...textareaStyle,
  border: '1px solid #334155',
  background: '#111827',
  color: '#f8fafc',
};

const cancelButtonStyle = {
  padding: '11px 16px',
  borderRadius: '999px',
  border: '1px solid var(--border-color)',
  background: 'var(--surface-color)',
  color: 'var(--text-secondary)',
  fontWeight: 700,
};

const darkCancelButtonStyle = {
  padding: '11px 16px',
  borderRadius: '999px',
  border: '1px solid #475569',
  background: '#1e293b',
  color: '#cbd5e1',
  fontWeight: 700,
};

const primaryButtonStyle = {
  padding: '11px 18px',
  borderRadius: '999px',
  background: 'linear-gradient(135deg, var(--accent-color), #15b86a)',
  color: '#fff',
  fontWeight: 700,
};
