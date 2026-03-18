import React, { useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BriefcaseBusiness,
  Check,
  ChevronDown,
  Globe,
  Link,
  MapPin,
  Plus,
  UserRound,
  X,
} from 'lucide-react';
import { skillsData } from '../data/skillsData';

const experienceOptions = [
  { value: '0', label: 'Fresher (0)' },
  ...Array.from({ length: 15 }, (_, index) => ({
    value: String(index + 1),
    label: `${index + 1} years`,
  })),
];
const suggestedSkills = ['React', 'AWS', 'Python', 'Docker', 'Node.js', 'Figma'];

const skillIcons = {
  React: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg',
  AWS: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-original-wordmark.svg',
  Python: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg',
};

const rolesByCategory = {
  Engineering: ['Software Engineer', 'Frontend Engineer', 'Backend Engineer', 'Cloud Engineer'],
  Design: ['UI/UX Designer', 'Visual Designer'],
  Operations: ['HR', 'Recruiter'],
  Sales: ['Account Executive', 'BD Manager'],
  Other: ['Business Analyst', 'Project Manager'],
};

function buildInitialFormState(initialData) {
  if (!initialData) {
    return {
      jobTitle: '',
      companyName: '',
      companyWebsite: '',
      applyLink: '',
      experienceYears: '',
      workMode: 'Remote',
      workType: '',
      location: '',
      skills: [],
      primaryRole: '',
      aboutRole: '',
    };
  }

  const parsedExperienceYears = String(initialData.experience || '').match(/\d+/)?.[0] || '0';

  return {
    jobTitle: initialData.title || '',
    companyName: initialData.company || '',
    companyWebsite: initialData.companyWebsite || '',
    applyLink: initialData.applyLink || '',
    experienceYears: parsedExperienceYears,
    workMode: initialData.workMode || 'Remote',
    workType: initialData.workType || '',
    location: initialData.location || '',
    skills: initialData.skills || [],
    primaryRole: initialData.primaryRole || '',
    aboutRole: initialData.aboutRole || '',
  };
}

export default function AddExperience({ isOpen, onClose, onSave, initialData = null }) {
  const navigate = useNavigate();
  const isEditing = Boolean(initialData?.id);
  const [formData, setFormData] = useState(() => buildInitialFormState(initialData));
  const [errors, setErrors] = useState({});
  const [skillQuery, setSkillQuery] = useState('');
  const [isSkillInputFocused, setIsSkillInputFocused] = useState(false);
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);
  const skillPanelRef = useRef(null);
  const rolePanelRef = useRef(null);

  const allSkills = useMemo(() => [...new Set(Object.values(skillsData).flat())], []);
  const matchingSkills = useMemo(() => {
    const normalizedQuery = skillQuery.trim().toLowerCase();
    if (normalizedQuery.length < 2) {
      return [];
    }
    return allSkills
      .filter(
        (skill) =>
          skill.toLowerCase().includes(normalizedQuery) && !formData.skills.includes(skill)
      )
      .slice(0, 6);
  }, [allSkills, formData.skills, skillQuery]);

  const canCreateCustomSkill = useMemo(() => {
    const trimmedQuery = skillQuery.trim();
    if (!trimmedQuery) {
      return false;
    }
    return !allSkills.some((skill) => skill.toLowerCase() === trimmedQuery.toLowerCase()) &&
      !formData.skills.some((skill) => skill.toLowerCase() === trimmedQuery.toLowerCase());
  }, [allSkills, formData.skills, skillQuery]);

  if (!isOpen) {
    return null;
  }

  const handleClose = () => {
    onClose();
  };

  const handleChange = (field) => (event) => {
    const value = event.target.value;
    setFormData((currentFormData) => ({ ...currentFormData, [field]: value }));
    setErrors((currentErrors) => ({ ...currentErrors, [field]: '' }));
  };

  const addSkill = (skill) => {
    const normalizedSkill = skill.trim();
    if (!normalizedSkill) {
      return;
    }
    setFormData((currentFormData) => {
      if (currentFormData.skills.some((item) => item.toLowerCase() === normalizedSkill.toLowerCase())) {
        return currentFormData;
      }
      return { ...currentFormData, skills: [...currentFormData.skills, normalizedSkill] };
    });
    setSkillQuery('');
  };

  const removeSkill = (skillToRemove) => {
    setFormData((currentFormData) => ({
      ...currentFormData,
      skills: currentFormData.skills.filter((skill) => skill !== skillToRemove),
    }));
  };

  const handleSkillKeyDown = (event) => {
    if (event.key === 'Enter' || event.key === ',') {
      event.preventDefault();
      if (matchingSkills.length > 0) {
        addSkill(matchingSkills[0]);
      } else if (canCreateCustomSkill) {
        addSkill(skillQuery);
      }
    }
  };

  const validateForm = () => {
    const nextErrors = {};
    if (!formData.jobTitle.trim()) nextErrors.jobTitle = 'Enter your job title.';
    if (!formData.companyName.trim()) nextErrors.companyName = 'Enter the company name.';
    if (!formData.companyWebsite.trim()) nextErrors.companyWebsite = 'Enter the company website.';
    if (!formData.applyLink.trim()) nextErrors.applyLink = 'Enter the apply URL.';
    if (!formData.experienceYears) nextErrors.experienceYears = 'Select years of experience required.';
    if (!formData.workMode) nextErrors.workMode = 'Choose a work mode.';
    if (!formData.workType) nextErrors.workType = 'Choose a work type.';
    if (!formData.location.trim()) nextErrors.location = 'Enter a location.';
    if (!formData.primaryRole) nextErrors.primaryRole = 'Select your primary role.';
    if (!formData.aboutRole.trim()) nextErrors.aboutRole = 'Describe the job role.';
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validateForm()) {
      return;
    }

    const payload = {
      title: formData.jobTitle.trim(),
      company: formData.companyName.trim(),
      location: formData.location.trim(),
      experience: formData.experienceYears === '0' ? 'Fresher (0)' : `${formData.experienceYears} years`,
      applyLink: formData.applyLink.trim(),
      aboutRole: formData.aboutRole.trim(),
      skills: formData.skills,
      primaryRole: formData.primaryRole,
      aboutOpportunity: formData.aboutRole.trim(),
      companyWebsite: formData.companyWebsite.trim(),
      workType: formData.workType,
      workMode: formData.workMode,
    };

    try {
      await onSave(payload);
      handleClose();
      navigate('/jobs');
    } catch {
      setErrors((currentErrors) => ({ ...currentErrors, submit: 'Unable to save this job post right now. Please try again.' }));
    }
  };

  return (
    <div role="dialog" aria-modal="true" aria-labelledby="add-experience-title" onClick={handleClose} style={overlayStyle}>
      <div onClick={(event) => event.stopPropagation()} style={drawerStyle}>
        <div style={headerStyle}>
          <div style={headerCopyStyle}>
            <div style={headerIconStyle}>
              <BriefcaseBusiness size={24} />
            </div>
            <div>
              <div style={eyebrowStyle}>Job Posting</div>
              <h2 id="add-experience-title" style={titleStyle}>{isEditing ? 'Edit Job Post' : 'Add Job Post'}</h2>
              <p style={subtitleStyle}>Add the role details you want to publish on the jobs board.</p>
            </div>
          </div>
          <button type="button" onClick={handleClose} aria-label="Close add job post form" style={closeButtonStyle}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={formStyle}>
          <div style={gridStyle}>
            <Field label="Job Title" error={errors.jobTitle}>
              <InputField icon={BriefcaseBusiness} value={formData.jobTitle} onChange={handleChange('jobTitle')} placeholder="e.g. Senior Frontend Engineer" />
            </Field>
            <Field label="Company Name" error={errors.companyName}>
              <InputField icon={UserRound} value={formData.companyName} onChange={handleChange('companyName')} placeholder="e.g. Peerlist" />
            </Field>
            <Field label="Company Website" error={errors.companyWebsite} fullWidth>
              <InputField icon={Globe} value={formData.companyWebsite} onChange={handleChange('companyWebsite')} placeholder="https://company.com" />
            </Field>
            <Field label="Apply URL" error={errors.applyLink} fullWidth>
              <InputField icon={Link} value={formData.applyLink} onChange={handleChange('applyLink')} placeholder="https://jobs.company.com/apply" />
            </Field>
            <Field label="Years of Experience Required" error={errors.experienceYears}>
              <SelectField value={formData.experienceYears} onChange={handleChange('experienceYears')} options={experienceOptions} placeholder="Select experience" />
            </Field>
            <Field label="Work Mode" error={errors.workMode}>
              <SelectField value={formData.workMode} onChange={handleChange('workMode')} options={['Remote', 'Hybrid', 'In-office']} placeholder="Select work mode" />
            </Field>
            <Field label="Work Type" error={errors.workType}>
              <SelectField value={formData.workType} onChange={handleChange('workType')} options={['Full-time', 'Part-time', 'Internship']} placeholder="Select work type" />
            </Field>
            <Field label="Location" error={errors.location}>
              <InputField icon={MapPin} value={formData.location} onChange={handleChange('location')} placeholder="e.g. Bengaluru or Remote" />
            </Field>
          </div>

          <section style={sectionCardStyle}>
            <div style={sectionHeaderStyle}>
              <div>
                <div style={sectionTitleStyle}>Skills</div>
                <p style={sectionCopyStyle}>Type 2-3 letters to search, or press Enter to add a custom skill.</p>
              </div>
            </div>
            <div ref={skillPanelRef} style={{ position: 'relative' }}>
              <div style={inputShellStyle}>
                <Plus size={18} color="var(--text-secondary)" />
                <input
                  type="text"
                  value={skillQuery}
                  onChange={(event) => setSkillQuery(event.target.value)}
                  onFocus={() => setIsSkillInputFocused(true)}
                  onBlur={() => setTimeout(() => setIsSkillInputFocused(false), 100)}
                  onKeyDown={handleSkillKeyDown}
                  placeholder="Search or add skills"
                  style={inputStyle}
                />
              </div>
              {isSkillInputFocused && (matchingSkills.length > 0 || canCreateCustomSkill) && (
                <div style={floatingPanelStyle}>
                  {matchingSkills.map((skill) => (
                    <button key={skill} type="button" onClick={() => addSkill(skill)} style={listButtonStyle}>
                      <span>{skill}</span>
                      <Check size={16} color="var(--accent-color)" />
                    </button>
                  ))}
                  {canCreateCustomSkill && (
                    <button type="button" onClick={() => addSkill(skillQuery)} style={listButtonStyle}>
                      <span>Add custom skill: {skillQuery.trim()}</span>
                      <Plus size={16} color="var(--accent-color)" />
                    </button>
                  )}
                </div>
              )}
            </div>
            <div style={chipsWrapStyle}>
              {suggestedSkills.map((skill) => {
                const isSelected = formData.skills.includes(skill);
                return (
                  <button
                    key={skill}
                    type="button"
                    onClick={() => addSkill(skill)}
                    style={{
                      ...suggestedChipStyle,
                      border: isSelected ? '1px solid var(--accent-color)' : '1px solid var(--border-color)',
                      background: isSelected ? 'rgba(0, 137, 56, 0.08)' : '#ffffff',
                      color: isSelected ? 'var(--accent-color)' : 'var(--text-secondary)',
                    }}
                  >
                    {skill}
                  </button>
                );
              })}
            </div>
            <div style={chipsWrapStyle}>
              {formData.skills.map((skill) => (
                <span key={skill} style={selectedChipStyle}>
                  {skillIcons[skill] && <img src={skillIcons[skill]} alt="" style={chipIconStyle} />}
                  <span>{skill}</span>
                  <button type="button" onClick={() => removeSkill(skill)} aria-label={`Remove ${skill}`} style={removeChipButtonStyle}>
                    <X size={14} />
                  </button>
                </span>
              ))}
            </div>
          </section>

          <section style={sectionCardStyle}>
            <div style={sectionHeaderStyle}>
              <div>
                <div style={sectionTitleStyle}>Primary Role</div>
                <p style={sectionCopyStyle}>Choose the role category that best matches this job post.</p>
              </div>
            </div>
            <div ref={rolePanelRef} style={{ position: 'relative' }}>
              <button type="button" onClick={() => setIsRoleDropdownOpen((current) => !current)} style={roleTriggerStyle}>
                <span style={{ color: formData.primaryRole ? 'var(--text-primary)' : 'var(--text-secondary)' }}>
                  {formData.primaryRole || 'Select primary role'}
                </span>
                <ChevronDown size={18} color="var(--text-secondary)" />
              </button>
              {isRoleDropdownOpen && (
                <div style={roleDropdownStyle}>
                  {Object.entries(rolesByCategory).map(([category, roles]) => (
                    <div key={category} style={roleGroupStyle}>
                      <div style={roleCategoryStyle}>{category}</div>
                      {roles.map((role) => (
                        <button
                          key={role}
                          type="button"
                          onClick={() => {
                            setFormData((currentFormData) => ({ ...currentFormData, primaryRole: role }));
                            setErrors((currentErrors) => ({ ...currentErrors, primaryRole: '' }));
                            setIsRoleDropdownOpen(false);
                          }}
                          style={{
                            ...roleOptionStyle,
                            background: formData.primaryRole === role ? 'rgba(0, 137, 56, 0.08)' : 'transparent',
                            color: formData.primaryRole === role ? 'var(--accent-color)' : 'var(--text-primary)',
                          }}
                        >
                          {role}
                        </button>
                      ))}
                    </div>
                  ))}
                </div>
              )}
            </div>
            {errors.primaryRole && <div style={errorStyle}>{errors.primaryRole}</div>}
          </section>

          <section style={sectionCardStyle}>
            <div style={sectionHeaderStyle}>
              <div style={sectionTitleStyle}>About Job Role</div>
            </div>
            <textarea
              value={formData.aboutRole}
              onChange={handleChange('aboutRole')}
              placeholder="Describe responsibilities, expectations, and role details"
              style={textareaStyle}
            />
            {errors.aboutRole && <div style={errorStyle}>{errors.aboutRole}</div>}
          </section>

          <div style={footerStyle}>
            {errors.submit && <div style={errorStyle}>{errors.submit}</div>}
            <button type="submit" style={saveButtonStyle}>{isEditing ? 'Update Job' : 'Save'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Field({ label, error, children, fullWidth = false }) {
  return (
    <div style={{ display: 'grid', gap: '8px', gridColumn: fullWidth ? '1 / -1' : 'auto' }}>
      <label style={labelStyle}>{label}</label>
      {children}
      {error && <div style={errorStyle}>{error}</div>}
    </div>
  );
}

function InputField({ icon: Icon, ...props }) {
  return (
    <div style={inputShellStyle}>
      {Icon && <Icon size={18} color="var(--text-secondary)" />}
      <input {...props} style={inputStyle} />
    </div>
  );
}

function SelectField({ icon: Icon, value, onChange, options, placeholder, disabled = false }) {
  return (
    <div style={{ ...inputShellStyle, opacity: disabled ? 0.65 : 1 }}>
      {Icon && <Icon size={18} color="var(--text-secondary)" />}
      <select value={value} onChange={onChange} disabled={disabled} style={selectStyle}>
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={typeof option === 'string' ? option : option.value} value={typeof option === 'string' ? option : option.value}>{typeof option === 'string' ? option : option.label}</option>
        ))}
      </select>
    </div>
  );
}

const overlayStyle = { position: 'fixed', inset: 0, zIndex: 210, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', background: 'rgba(15, 23, 42, 0.42)', backdropFilter: 'blur(12px)' };
const drawerStyle = { width: 'min(920px, 100%)', maxHeight: 'calc(100vh - 40px)', overflowY: 'auto', borderRadius: '28px', border: '1px solid rgba(255, 255, 255, 0.45)', padding: '28px', background: 'linear-gradient(180deg, #ffffff 0%, #f7faf7 100%)', boxShadow: '0 32px 90px rgba(15, 23, 42, 0.2)' };
const headerStyle = { display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px', marginBottom: '24px' };
const headerCopyStyle = { display: 'flex', alignItems: 'flex-start', gap: '16px' };
const headerIconStyle = { width: '56px', height: '56px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '18px', background: 'linear-gradient(135deg, rgba(0, 137, 56, 0.12), rgba(21, 184, 106, 0.18))', color: 'var(--accent-color)', flexShrink: 0 };
const eyebrowStyle = { marginBottom: '6px', color: 'var(--accent-color)', fontSize: '12px', fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase' };
const titleStyle = { margin: 0, fontSize: '28px', lineHeight: 1.15 };
const subtitleStyle = { margin: '8px 0 0', color: 'var(--text-secondary)', fontSize: '15px' };
const closeButtonStyle = { width: '40px', height: '40px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', borderRadius: '999px', border: '1px solid var(--border-color)', background: '#ffffff', color: 'var(--text-secondary)', flexShrink: 0 };
const formStyle = { display: 'grid', gap: '20px' };
const gridStyle = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '18px' };
const sectionCardStyle = { display: 'grid', gap: '14px', padding: '20px', borderRadius: '22px', border: '1px solid var(--border-color)', background: '#ffffff', boxShadow: '0 10px 30px rgba(15, 23, 42, 0.04)' };
const sectionHeaderStyle = { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' };
const sectionTitleStyle = { fontSize: '18px', fontWeight: 700 };
const sectionCopyStyle = { margin: '6px 0 0', color: 'var(--text-secondary)', fontSize: '14px' };
const labelStyle = { fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)' };
const inputShellStyle = { display: 'flex', alignItems: 'center', gap: '10px', minHeight: '50px', padding: '0 14px', borderRadius: '16px', border: '1px solid var(--border-color)', background: '#fdfdfd' };
const inputStyle = { width: '100%', border: 'none', outline: 'none', font: 'inherit', color: 'var(--text-primary)', background: 'transparent' };
const selectStyle = { width: '100%', border: 'none', outline: 'none', font: 'inherit', color: 'var(--text-primary)', background: 'transparent' };
const floatingPanelStyle = { position: 'absolute', top: 'calc(100% + 8px)', left: 0, right: 0, zIndex: 20, display: 'grid', gap: '4px', padding: '8px', borderRadius: '18px', border: '1px solid var(--border-color)', background: '#ffffff', boxShadow: '0 18px 40px rgba(15, 23, 42, 0.12)' };
const listButtonStyle = { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', width: '100%', padding: '10px 12px', borderRadius: '12px', color: 'var(--text-primary)', background: 'transparent', textAlign: 'left' };
const chipsWrapStyle = { display: 'flex', flexWrap: 'wrap', gap: '10px' };
const suggestedChipStyle = { padding: '9px 14px', borderRadius: '999px', fontSize: '13px', fontWeight: 700 };
const selectedChipStyle = { display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '9px 12px', borderRadius: '999px', border: '1px solid rgba(0, 137, 56, 0.18)', background: 'rgba(0, 137, 56, 0.08)', color: 'var(--accent-color)', fontSize: '13px', fontWeight: 700 };
const chipIconStyle = { width: '16px', height: '16px', objectFit: 'contain' };
const removeChipButtonStyle = { display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-color)' };
const roleTriggerStyle = { width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', minHeight: '54px', padding: '0 16px', borderRadius: '16px', border: '1px solid var(--border-color)', background: '#fdfdfd', fontSize: '15px', fontWeight: 600 };
const roleDropdownStyle = { position: 'absolute', top: 'calc(100% + 8px)', left: 0, right: 0, zIndex: 20, maxHeight: '280px', overflowY: 'auto', padding: '10px', borderRadius: '18px', border: '1px solid var(--border-color)', background: '#ffffff', boxShadow: '0 18px 40px rgba(15, 23, 42, 0.12)' };
const roleGroupStyle = { display: 'grid', gap: '6px' };
const roleCategoryStyle = { padding: '10px 8px 2px', color: 'var(--text-muted)', fontSize: '12px', fontWeight: 800, letterSpacing: '0.06em', textTransform: 'uppercase' };
const roleOptionStyle = { width: '100%', padding: '10px 12px', borderRadius: '12px', textAlign: 'left', fontSize: '14px', fontWeight: 600 };
const errorStyle = { color: '#b42318', fontSize: '12px', fontWeight: 600 };
const footerStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px', flexWrap: 'wrap' };
const saveButtonStyle = { minWidth: '140px', padding: '13px 22px', borderRadius: '999px', background: 'linear-gradient(135deg, var(--accent-color), #15b86a)', color: '#ffffff', fontSize: '14px', fontWeight: 800, boxShadow: '0 16px 32px rgba(0, 137, 56, 0.2)' };
const textareaStyle = { width: '100%', minHeight: '140px', resize: 'vertical', padding: '14px 16px', borderRadius: '16px', border: '1px solid var(--border-color)', outline: 'none', font: 'inherit', color: 'var(--text-primary)', background: '#fdfdfd', lineHeight: 1.6 };
