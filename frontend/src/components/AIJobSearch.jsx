import React, { useMemo, useState } from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import JobCard from './JobCard';

const APPLIED_JOBS_KEY = 'appliedJobIds';
const SAVED_JOBS_KEY = 'savedJobIds';

export default function AIJobSearch() {
  const navigate = useNavigate();
  const { jobs = [] } = useOutletContext();
  const [roleQuery, setRoleQuery] = useState('');
  const [locationQuery, setLocationQuery] = useState('');
  const [submittedSearch, setSubmittedSearch] = useState({ role: '', location: '' });
  const [savedJobs, setSavedJobs] = useState(() => {
    try {
      const storedJobs = localStorage.getItem(SAVED_JOBS_KEY);
      return storedJobs ? JSON.parse(storedJobs) : [];
    } catch {
      return [];
    }
  });
  const [appliedJobs, setAppliedJobs] = useState(() => {
    try {
      const storedJobs = localStorage.getItem(APPLIED_JOBS_KEY);
      return storedJobs ? JSON.parse(storedJobs) : [];
    } catch {
      return [];
    }
  });

  const results = useMemo(() => {
    const normalizedRole = submittedSearch.role.trim().toLowerCase();
    const normalizedLocation = submittedSearch.location.trim().toLowerCase();

    if (!normalizedRole && !normalizedLocation) {
      return [];
    }

    return jobs.filter((job) => {
      const matchesRole = !normalizedRole || job.title.toLowerCase().includes(normalizedRole);
      const matchesLocation =
        !normalizedLocation || job.location.toLowerCase().includes(normalizedLocation);

      return matchesRole && matchesLocation;
    });
  }, [jobs, submittedSearch]);

  const runSearch = () => {
    setSubmittedSearch({
      role: roleQuery,
      location: locationQuery,
    });
  };

  const handleApply = (job) => {
    if (!job?.applyLink) {
      return;
    }
    window.open(job.applyLink, '_blank');
    setAppliedJobs((currentJobs) => {
      const nextJobs = currentJobs.includes(job.id) ? currentJobs : [...currentJobs, job.id];
      localStorage.setItem(APPLIED_JOBS_KEY, JSON.stringify(nextJobs));
      return nextJobs;
    });
  };

  const handleSave = (jobId) => {
    setSavedJobs((currentJobs) => {
      const nextJobs = currentJobs.includes(jobId)
        ? currentJobs.filter((item) => item !== jobId)
        : [...currentJobs, jobId];
      localStorage.setItem(SAVED_JOBS_KEY, JSON.stringify(nextJobs));
      return nextJobs;
    });
  };

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
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '18px' }}>
        <div
          style={{
            width: '50px',
            height: '50px',
            borderRadius: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #111827, #1f7a4d)',
            color: '#fff',
          }}
        >
          <Sparkles size={22} />
        </div>
        <div>
          <h1 style={{ margin: 0, fontSize: '28px' }}>Let&apos;s find the perfect job for you with AI job search!</h1>
          <p style={{ margin: '6px 0 0', color: 'var(--text-secondary)' }}>Search jobs by role or location in one step.</p>
        </div>
      </div>

      <div style={{ display: 'grid', gap: '16px', margin: '0 auto 24px', maxWidth: '720px', padding: '24px', borderRadius: '18px', border: '1px solid var(--border-color)', background: 'rgba(0, 0, 0, 0.02)' }}>
        <div style={{ display: 'grid', gap: '8px' }}>
          <label style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)' }}>Search by Job Role</label>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 14px', borderRadius: '14px', border: '1px solid var(--border-color)', background: '#fff' }}>
            <input
              type="text"
              value={roleQuery}
              onChange={(event) => setRoleQuery(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  event.preventDefault();
                  runSearch();
                }
              }}
              placeholder="e.g. Software Engineer, Cloud Engineer"
              style={{ width: '100%', border: 'none', outline: 'none', font: 'inherit', background: 'transparent' }}
            />
          </div>
        </div>

        <div style={{ display: 'grid', gap: '8px' }}>
          <label style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)' }}>Search by Location</label>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 14px', borderRadius: '14px', border: '1px solid var(--border-color)', background: '#fff' }}>
            <input
              type="text"
              value={locationQuery}
              onChange={(event) => setLocationQuery(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  event.preventDefault();
                  runSearch();
                }
              }}
              placeholder="e.g. Bangalore, India"
              style={{ width: '100%', border: 'none', outline: 'none', font: 'inherit', background: 'transparent' }}
            />
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <button
            type="button"
            onClick={runSearch}
            style={{
              minWidth: '140px',
              height: '46px',
              borderRadius: '999px',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              background: 'linear-gradient(135deg, var(--accent-color), #15b86a)',
              color: '#fff',
              fontSize: '14px',
              fontWeight: 700,
            }}
          >
            Search
            <ArrowRight size={18} />
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {results.map((job, index) => (
          <JobCard
            key={job.id}
            job={job}
            featured={index === 0}
            isSaved={savedJobs.includes(job.id)}
            isApplied={appliedJobs.includes(job.id)}
            onOpen={() => navigate(`/jobs/${job.id}`)}
            onApply={() => handleApply(job)}
            onSave={() => handleSave(job.id)}
          />
        ))}

        {(submittedSearch.role || submittedSearch.location) && results.length === 0 && (
          <div
            style={{
              padding: '32px 20px',
              borderRadius: '18px',
              border: '1px solid var(--border-color)',
              textAlign: 'center',
              color: 'var(--text-secondary)',
            }}
          >
            No jobs found
          </div>
        )}
      </div>
    </section>
  );
}
