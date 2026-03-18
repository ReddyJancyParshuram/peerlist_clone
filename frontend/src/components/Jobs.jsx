import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { Briefcase, Bot, Plus, Search } from 'lucide-react';
import PostJobModal from './PostJobModal';
import AddExperience from './AddExperience';
import JobCard from './JobCard';

const APPLIED_JOBS_KEY = 'appliedJobIds';
const SAVED_JOBS_KEY = 'savedJobIds';
const ACTIVE_JOBS_TAB_KEY = 'activeJobsTab';

export default function Jobs() {
  const navigate = useNavigate();
  const { user, jobs = [], createdJobs = [], addCreatedJob, updateCreatedJob, deleteCreatedJob } = useOutletContext();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSkill, setSelectedSkill] = useState('All');
  const [activeTab, setActiveTab] = useState(() => localStorage.getItem(ACTIVE_JOBS_TAB_KEY) || 'recommended');
  const [isPostJobModalOpen, setIsPostJobModalOpen] = useState(false);
  const [isAddExperienceOpen, setIsAddExperienceOpen] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [formKey, setFormKey] = useState(0);
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

  useEffect(() => {
    localStorage.setItem(APPLIED_JOBS_KEY, JSON.stringify(appliedJobs));
  }, [appliedJobs]);

  useEffect(() => {
    localStorage.setItem(SAVED_JOBS_KEY, JSON.stringify(savedJobs));
  }, [savedJobs]);

  useEffect(() => {
    localStorage.setItem(ACTIVE_JOBS_TAB_KEY, activeTab);
  }, [activeTab]);

  const skillOptions = useMemo(() => ['All', ...new Set(jobs.flatMap((job) => job.skills || []))], [jobs]);

  const filteredJobs = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();
    const eligibleJobs = jobs.filter((job) => {
      const hasApplyLink = typeof job.applyLink === 'string' && job.applyLink.trim().length > 0;
      const matchesQuery =
        !normalizedQuery ||
        job.title.toLowerCase().includes(normalizedQuery) ||
        job.company.toLowerCase().includes(normalizedQuery) ||
        job.location.toLowerCase().includes(normalizedQuery) ||
        (job.skills || []).some((skill) => skill.toLowerCase().includes(normalizedQuery));
      const matchesSkill = selectedSkill === 'All' || (job.skills || []).includes(selectedSkill);
      return hasApplyLink && matchesQuery && matchesSkill;
    });

    if (activeTab === 'recommended') return eligibleJobs.slice(0, 3);
    if (activeTab === 'saved') return eligibleJobs.filter((job) => savedJobs.includes(job.id));
    if (activeTab === 'applied') return eligibleJobs.filter((job) => appliedJobs.includes(job.id));
    return eligibleJobs;
  }, [activeTab, appliedJobs, jobs, savedJobs, searchQuery, selectedSkill]);

  const openCreateForm = () => {
    setEditingJob(null);
    setFormKey((current) => current + 1);
    setIsPostJobModalOpen(false);
    setIsAddExperienceOpen(true);
  };

  const openEditForm = (job) => {
    setEditingJob(job);
    setFormKey((current) => current + 1);
    setIsPostJobModalOpen(false);
    setIsAddExperienceOpen(true);
  };

  const handleSaveToggle = (jobId) => {
    setSavedJobs((currentJobs) =>
      currentJobs.includes(jobId)
        ? currentJobs.filter((item) => item !== jobId)
        : [...currentJobs, jobId]
    );
  };

  const handleApply = (job) => {
    if (!job?.applyLink) {
      return;
    }
    window.open(job.applyLink, '_blank');
    setAppliedJobs((currentJobs) =>
      currentJobs.includes(job.id) ? currentJobs : [...currentJobs, job.id]
    );
  };

  const handleJobSaved = async (payload) => {
    if (editingJob?.id) {
      await updateCreatedJob(editingJob.id, payload);
      return;
    }
    await addCreatedJob(payload);
  };

  const handleDelete = async (job) => {
    await deleteCreatedJob(job.id);
    setSavedJobs((currentJobs) => currentJobs.filter((item) => item !== job.id));
    setAppliedJobs((currentJobs) => currentJobs.filter((item) => item !== job.id));
  };

  return (
    <>
      <section style={{ background: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: '24px', padding: '32px', boxShadow: 'var(--shadow-sm)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', marginBottom: '20px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--accent-color)', color: '#fff' }}>
              <Briefcase size={22} />
            </div>
            <div>
              <h1 style={{ margin: 0, fontSize: '28px' }}>Jobs</h1>
              <p style={{ margin: '6px 0 0', color: 'var(--text-secondary)' }}>Explore curated engineering roles from product-first tech teams.</p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={() => navigate('/ai-job-search')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 16px',
                borderRadius: '999px',
                border: '1px solid var(--border-color)',
                background: '#fff',
                color: 'var(--text-primary)',
                fontSize: '14px',
                fontWeight: 700,
              }}
            >
              <Bot size={16} />
              AI Job Search
            </button>
            <button
              type="button"
              onClick={() => setIsPostJobModalOpen(true)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 16px',
                borderRadius: '999px',
                background: 'linear-gradient(135deg, var(--accent-color), #15b86a)',
                color: '#fff',
                fontSize: '14px',
                fontWeight: 700,
                boxShadow: '0 18px 34px rgba(0, 137, 56, 0.18)',
              }}
            >
              <Plus size={16} />
              Post a Job
            </button>
          </div>
        </div>

        {createdJobs.length > 0 && (
          <div style={{ display: 'grid', gap: '10px', marginBottom: '24px', padding: '16px 18px', borderRadius: '18px', border: '1px solid rgba(0, 137, 56, 0.14)', background: 'linear-gradient(135deg, rgba(0, 137, 56, 0.08), rgba(21, 184, 106, 0.03))' }}>
            <div style={{ fontSize: '13px', fontWeight: 800, color: 'var(--accent-color)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Latest Job Post</div>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
              <div>
                <div style={{ fontSize: '18px', fontWeight: 700 }}>{createdJobs[0].title}</div>
                <div style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>{createdJobs[0].company} • {createdJobs[0].location} • {createdJobs[0].primaryRole}</div>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {(createdJobs[0].skills || []).slice(0, 4).map((skill) => (
                  <span key={skill} style={{ padding: '6px 10px', borderRadius: '999px', background: '#fff', border: '1px solid rgba(0, 137, 56, 0.14)', fontSize: '12px', fontWeight: 700, color: 'var(--accent-color)' }}>{skill}</span>
                ))}
              </div>
            </div>
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px', padding: '18px', borderRadius: '18px', border: '1px solid var(--border-color)', background: 'rgba(0, 0, 0, 0.02)' }}>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {[
              { id: 'recommended', label: 'RECOMMENDED' },
              { id: 'all', label: 'ALL JOBS' },
              { id: 'saved', label: 'SAVED' },
              { id: 'applied', label: 'APPLIED' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                style={{
                  padding: '8px 12px',
                  borderRadius: '999px',
                  border: activeTab === tab.id ? '1px solid var(--accent-color)' : '1px solid var(--border-color)',
                  background: activeTab === tab.id ? 'rgba(0, 137, 56, 0.08)' : '#fff',
                  color: activeTab === tab.id ? 'var(--accent-color)' : 'var(--text-secondary)',
                  fontSize: '12px',
                  fontWeight: 700,
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 14px', borderRadius: '14px', border: '1px solid var(--border-color)', background: '#fff' }}>
            <Search size={18} color="var(--text-secondary)" />
            <input type="text" value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} placeholder="Search roles, companies, locations, or skills" style={{ width: '100%', border: 'none', outline: 'none', font: 'inherit', background: 'transparent' }} />
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {skillOptions.map((skill) => (
              <button
                key={skill}
                type="button"
                onClick={() => setSelectedSkill(skill)}
                style={{
                  padding: '8px 12px',
                  borderRadius: '999px',
                  border: selectedSkill === skill ? '1px solid var(--accent-color)' : '1px solid var(--border-color)',
                  background: selectedSkill === skill ? 'rgba(0, 137, 56, 0.08)' : '#fff',
                  color: selectedSkill === skill ? 'var(--accent-color)' : 'var(--text-secondary)',
                  fontSize: '12px',
                  fontWeight: 700,
                }}
              >
                {skill}
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {filteredJobs.map((job, index) => (
            <JobCard
              key={job.id}
              job={job}
              featured={index === 0}
              isSaved={savedJobs.includes(job.id)}
              isApplied={appliedJobs.includes(job.id)}
              onOpen={() => navigate(`/jobs/${job.id}`)}
              onApply={() => handleApply(job)}
              onSave={() => handleSaveToggle(job.id)}
              onEdit={job.author_id === user?.id ? () => openEditForm(job) : undefined}
              onDelete={job.author_id === user?.id ? () => handleDelete(job) : undefined}
            />
          ))}

          {filteredJobs.length === 0 && (
            <div style={{ padding: '32px 20px', borderRadius: '18px', border: '1px solid var(--border-color)', textAlign: 'center', color: 'var(--text-secondary)' }}>
              {activeTab === 'saved' || activeTab === 'applied' ? 'No jobs found' : 'No jobs available to apply right now'}
            </div>
          )}
        </div>
      </section>

      <PostJobModal isOpen={isPostJobModalOpen} onClose={() => setIsPostJobModalOpen(false)} onAddExperience={openCreateForm} />

      <AddExperience
        key={formKey}
        isOpen={isAddExperienceOpen}
        onClose={() => {
          setIsAddExperienceOpen(false);
          setEditingJob(null);
        }}
        onSave={handleJobSaved}
        initialData={editingJob}
      />
    </>
  );
}
