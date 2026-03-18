import React from 'react';
import { BriefcaseBusiness, ChevronRight, Plus, X } from 'lucide-react';

const steps = [
  {
    id: 'add-experience',
    title: 'Add Job Post',
    description: 'Share a role from your work history to unlock job posting on Peerlist.',
    icon: BriefcaseBusiness,
    actionLabel: 'Add',
    disabled: false,
  },
];

export default function PostJobModal({ isOpen, onClose, onAddExperience }) {
  if (!isOpen) {
    return null;
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="post-job-modal-title"
      onClick={onClose}
      style={overlayStyle}
    >
      <div onClick={(event) => event.stopPropagation()} style={modalStyle}>
        <button type="button" onClick={onClose} aria-label="Close post job modal" style={closeButtonStyle}>
          <X size={18} />
        </button>

        <div style={heroStyle}>
          <div style={heroIconStyle}>
            <BriefcaseBusiness size={24} />
          </div>
          <div>
            <div style={eyebrowStyle}>Job Posting Setup</div>
            <h2 id="post-job-modal-title" style={titleStyle}>
              Posting a job on Peerlist
            </h2>
            <p style={copyStyle}>Complete these steps to start hiring from your Jobs dashboard.</p>
          </div>
        </div>

        <div style={stepsWrapperStyle}>
          {steps.map((step, index) => {
            const Icon = step.icon;

            return (
              <div
                key={step.id}
                style={{
                  ...stepCardStyle,
                  opacity: step.disabled ? 0.68 : 1,
                  background: step.disabled ? 'rgba(255, 255, 255, 0.76)' : '#ffffff',
                }}
              >
                <div style={stepMetaStyle}>
                  <div style={stepBadgeStyle}>Step {index + 1}</div>
                  <div style={stepIconStyle}>
                    <Icon size={18} />
                  </div>
                </div>

                <div>
                  <div style={stepTitleStyle}>{step.title}</div>
                  <p style={stepCopyStyle}>{step.description}</p>
                </div>

                <button
                  type="button"
                  disabled={step.disabled}
                  onClick={step.disabled ? undefined : onAddExperience}
                  style={{
                    ...stepActionStyle,
                    ...(step.disabled ? disabledActionStyle : enabledActionStyle),
                  }}
                >
                  {step.disabled ? (
                    step.actionLabel
                  ) : (
                    <>
                      <Plus size={16} />
                      {step.actionLabel}
                      <ChevronRight size={16} />
                    </>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

const overlayStyle = {
  position: 'fixed',
  inset: 0,
  zIndex: 200,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '24px',
  background: 'rgba(15, 23, 42, 0.38)',
  backdropFilter: 'blur(12px)',
};

const modalStyle = {
  position: 'relative',
  width: 'min(640px, 100%)',
  maxHeight: 'min(520px, calc(100vh - 48px))',
  overflowY: 'auto',
  borderRadius: '28px',
  border: '1px solid rgba(255, 255, 255, 0.4)',
  padding: '32px',
  background: 'linear-gradient(180deg, #f8fbf8 0%, #eef6ef 100%)',
  boxShadow: '0 30px 80px rgba(15, 23, 42, 0.18)',
};

const closeButtonStyle = {
  position: 'absolute',
  top: '18px',
  right: '18px',
  width: '40px',
  height: '40px',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: '999px',
  border: '1px solid rgba(148, 163, 184, 0.28)',
  background: 'rgba(255, 255, 255, 0.85)',
  color: 'var(--text-secondary)',
};

const heroStyle = {
  display: 'flex',
  alignItems: 'flex-start',
  gap: '16px',
  paddingRight: '44px',
  marginBottom: '28px',
};

const heroIconStyle = {
  width: '54px',
  height: '54px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: '18px',
  background: 'linear-gradient(135deg, var(--accent-color), #15b86a)',
  color: '#ffffff',
  flexShrink: 0,
};

const eyebrowStyle = {
  marginBottom: '6px',
  color: 'var(--accent-color)',
  fontSize: '12px',
  fontWeight: 800,
  textTransform: 'uppercase',
  letterSpacing: '0.08em',
};

const titleStyle = {
  margin: 0,
  fontSize: '30px',
  lineHeight: 1.15,
};

const copyStyle = {
  margin: '10px 0 0',
  color: 'var(--text-secondary)',
  fontSize: '15px',
};

const stepsWrapperStyle = {
  display: 'grid',
  gap: '16px',
  minHeight: '220px',
  alignContent: 'center',
};

const stepCardStyle = {
  display: 'grid',
  gridTemplateColumns: 'auto 1fr auto',
  gap: '16px',
  alignItems: 'center',
  margin: '0 auto',
  width: '100%',
  maxWidth: '540px',
  padding: '24px',
  borderRadius: '22px',
  border: '1px solid rgba(15, 23, 42, 0.08)',
  boxShadow: '0 14px 40px rgba(15, 23, 42, 0.06)',
};

const stepMetaStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  gap: '12px',
};

const stepBadgeStyle = {
  padding: '6px 10px',
  borderRadius: '999px',
  background: 'rgba(0, 137, 56, 0.1)',
  color: 'var(--accent-color)',
  fontSize: '11px',
  fontWeight: 800,
  letterSpacing: '0.06em',
  textTransform: 'uppercase',
};

const stepIconStyle = {
  width: '48px',
  height: '48px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: '16px',
  background: 'rgba(0, 137, 56, 0.08)',
  color: 'var(--accent-color)',
};

const stepTitleStyle = {
  fontSize: '18px',
  fontWeight: 700,
};

const stepCopyStyle = {
  margin: '6px 0 0',
  color: 'var(--text-secondary)',
  fontSize: '14px',
  lineHeight: 1.5,
};

const stepActionStyle = {
  minWidth: '128px',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '8px',
  padding: '12px 16px',
  borderRadius: '999px',
  fontSize: '14px',
  fontWeight: 700,
};

const enabledActionStyle = {
  border: '1px solid transparent',
  background: 'linear-gradient(135deg, var(--accent-color), #15b86a)',
  color: '#ffffff',
};

const disabledActionStyle = {
  cursor: 'not-allowed',
  border: '1px solid rgba(148, 163, 184, 0.26)',
  background: 'rgba(248, 250, 252, 0.88)',
  color: 'var(--text-muted)',
};
