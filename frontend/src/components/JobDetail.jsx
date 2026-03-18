import React, { useEffect, useState } from 'react';
import { useNavigate, useOutletContext, useParams, Navigate } from 'react-router-dom';
import { ArrowLeft, Briefcase, MapPin } from 'lucide-react';

const APPLIED_JOBS_KEY = 'appliedJobIds';
const ACTIVE_JOBS_TAB_KEY = 'activeJobsTab';

export default function JobDetail() {
  const navigate = useNavigate();
  const { jobs = [] } = useOutletContext();
  const { id } = useParams();
  const job = jobs.find((item) => item.id === id);
  const [appliedJobs, setAppliedJobs] = useState(() => {
    try {
      const storedJobs = localStorage.getItem(APPLIED_JOBS_KEY);
      return storedJobs ? JSON.parse(storedJobs) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(APPLIED_JOBS_KEY, JSON.stringify(appliedJobs));
  }, [appliedJobs]);

  const isApplied = job ? appliedJobs.includes(job.id) : false;
  const hasApplyLink = Boolean(job?.applyLink?.trim());
  const isValidApplyLink = (() => {
    if (!hasApplyLink) {
      return false;
    }

    try {
      new URL(job.applyLink);
      return true;
    } catch {
      return false;
    }
  })();

  const handleApply = () => {
    if (!isValidApplyLink) return;
    window.open(job.applyLink, '_blank');
  };

  const handleMarkApplied = () => {
    if (isApplied) {
      setAppliedJobs((currentJobs) => currentJobs.filter((item) => item !== job.id));
      return;
    }

    setAppliedJobs((currentJobs) =>
      currentJobs.includes(job.id) ? currentJobs : [...currentJobs, job.id]
    );
    localStorage.setItem(ACTIVE_JOBS_TAB_KEY, 'applied');
    navigate('/jobs');
  };

  if (!job) {
    return <Navigate to="/jobs" replace />;
  }

  return (
    <section
      style={{
        background: 'var(--card-bg)',
        border: '1px solid var(--border-color)',
        borderRadius: '24px',
        padding: '32px',
        boxShadow: 'var(--shadow-sm)',
      }}
    >
      <button
        type="button"
        onClick={() => navigate('/jobs')}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          marginBottom: '20px',
          padding: '10px 14px',
          borderRadius: '999px',
          border: '1px solid var(--border-color)',
          background: 'white',
          color: 'var(--text-secondary)',
        }}
      >
        <ArrowLeft size={16} /> Back to Jobs
      </button>

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
        <div
          style={{
            width: '48px',
            height: '48px',
            borderRadius: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'var(--accent-color)',
            color: '#fff',
          }}
        >
          <Briefcase size={22} />
        </div>
        <div>
          <h1 style={{ margin: 0, fontSize: '30px' }}>{job.title}</h1>
          <div style={{ marginTop: '4px', color: 'var(--text-secondary)', fontWeight: 600 }}>{job.company}</div>
        </div>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginBottom: '24px' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)' }}>
          <MapPin size={16} />
          <span>{job.location}</span>
        </div>
        <div
          style={{
            padding: '8px 12px',
            borderRadius: '999px',
            border: '1px solid var(--border-color)',
            background: 'white',
            fontSize: '12px',
            fontWeight: 700,
            color: 'var(--text-secondary)',
          }}
        >
          Experience Required: {job.experience}
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <section>
          <h2 style={{ margin: '0 0 10px', fontSize: '18px' }}>Must have skills</h2>
          <ul style={{ margin: 0, paddingLeft: '20px', color: 'var(--text-secondary)', lineHeight: 1.8 }}>
            {(job.mustHaveSkills || job.skills || []).map((skill) => (
              <li
                key={skill}
                style={{
                  fontSize: '14px',
                  fontWeight: 600,
                  color: 'var(--text-secondary)',
                }}
              >
                {skill}
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2 style={{ margin: '0 0 10px', fontSize: '18px' }}>About this Opportunity</h2>
          <p style={{ margin: 0, color: 'var(--text-secondary)', lineHeight: 1.7 }}>
            {job.aboutOpportunity || `Learn more about this role at ${job.company} and apply using the provided application link.`}
          </p>
        </section>

        <section>
          <h2 style={{ margin: '0 0 10px', fontSize: '18px' }}>About the Role</h2>
          <ul style={{ margin: 0, paddingLeft: '20px', color: 'var(--text-secondary)', lineHeight: 1.8 }}>
            {(job.aboutRole || '')
              .split(/\n|, /)
              .map((point) => point.trim())
              .filter(Boolean)
              .map((point) => (
                <li key={point} style={{ fontSize: '14px' }}>
                  {point.charAt(0).toUpperCase() + point.slice(1)}
                </li>
              ))}
          </ul>
        </section>
      </div>

      {hasApplyLink ? (
        <div style={{ marginTop: '28px', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={handleApply}
            disabled={!isValidApplyLink}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              padding: '12px 18px',
              borderRadius: '999px',
              background: !isValidApplyLink ? 'rgba(148, 163, 184, 0.35)' : 'var(--accent-color)',
              color: '#fff',
              fontSize: '14px',
              fontWeight: 700,
              opacity: !isValidApplyLink ? 0.8 : 1,
              cursor: !isValidApplyLink ? 'not-allowed' : 'pointer',
            }}
          >
            {!isValidApplyLink ? 'Application link not available' : 'Apply'}
          </button>

          <button
            type="button"
            onClick={handleMarkApplied}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              padding: '12px 18px',
              borderRadius: '999px',
              border: isApplied ? '1px solid var(--accent-color)' : '1px solid var(--border-color)',
              background: isApplied ? 'rgba(0, 137, 56, 0.08)' : '#ffffff',
              color: isApplied ? 'var(--accent-color)' : 'var(--text-secondary)',
              fontSize: '14px',
              fontWeight: 700,
              opacity: 1,
              cursor: 'pointer',
            }}
          >
            {isApplied ? 'Applied ✓' : 'Mark Applied'}
          </button>
        </div>
      ) : (
        <div style={{ marginTop: '28px', color: 'var(--text-secondary)', fontSize: '14px' }}>
          Application link not available
        </div>
      )}
    </section>
  );
}
