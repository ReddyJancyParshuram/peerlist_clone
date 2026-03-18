import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import LeftSidebar from './components/LeftSidebar';
import RightSidebar from './components/RightSidebar';
import Feed from './components/Feed';
import Launchpad from './components/Launchpad';
import ProductDetail from './components/ProductDetail';
import Jobs from './components/Jobs';
import JobDetail from './components/JobDetail';
import AIJobSearch from './components/AIJobSearch';
import Profile from './components/Profile';
import Login from './components/Login';
import { jobsData } from './data/jobsData';
import { initialLaunchpadProducts } from './data/launchpadProducts';
import { samplePosts } from './data/samplePosts';

import api from './lib/api';

const THEME_STORAGE_KEY = 'theme';

function MainLayout() {
  const [user, setUser] = useState(null);
  const [products, setProducts] = useState(initialLaunchpadProducts);
  const [posts, setPosts] = useState(
    samplePosts.map((post) => ({
      id: post.id,
      author: {
        full_name: post.author.name,
        username: post.author.username,
        title: 'Tech maker',
        avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${post.author.username}`,
      },
      content: post.content,
      likes: post.likes,
      liked: false,
      shares: post.shares,
      shared: false,
      comments: post.comments.length,
      comment_items: post.comments.map((comment, index) => ({
        id: `${post.id}-comment-${index}`,
        author: post.author.name,
        content: comment,
      })),
      created_at: new Date().toISOString(),
      selected_poll_option: null,
    }))
  );
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const [authError, setAuthError] = useState('');
  const [createdJobs, setCreatedJobs] = useState([]);
  const [isDarkMode, setIsDarkMode] = useState(() => localStorage.getItem(THEME_STORAGE_KEY) === 'dark');
  const isAuthenticated = !!localStorage.getItem('token');
  const jobs = useMemo(() => [...createdJobs, ...jobsData], [createdJobs]);

  useEffect(() => {
    localStorage.setItem(THEME_STORAGE_KEY, isDarkMode ? 'dark' : 'light');
    document.body.classList.toggle('dark', isDarkMode);
  }, [isDarkMode]);

  const toggleTheme = useCallback(() => {
    setIsDarkMode((current) => !current);
  }, []);

  const upvoteProduct = (id) => {
    setProducts((currentProducts) =>
      currentProducts.map((product) =>
        product.id === id ? { ...product, upvotes: product.upvotes + 1 } : product
      )
    );
  };

  const loadJobs = useCallback(async () => {
    try {
      const res = await api.get('/jobs');
      const normalizedJobs = Array.isArray(res.data)
        ? res.data.map((job) => ({ ...job, id: String(job.id) }))
        : [];
      setCreatedJobs(normalizedJobs);
    } catch {
      setCreatedJobs([]);
    }
  }, []);

  const addCreatedJob = useCallback(async (job) => {
    const res = await api.post('/jobs', job);
    const savedJob = { ...res.data, id: String(res.data.id) };
    setCreatedJobs((currentJobs) => [savedJob, ...currentJobs.filter((item) => item.id !== savedJob.id)]);
    return savedJob;
  }, []);

  const updateCreatedJob = useCallback(async (jobId, job) => {
    const res = await api.put(`/jobs/${jobId}`, job);
    const savedJob = { ...res.data, id: String(res.data.id) };
    setCreatedJobs((currentJobs) =>
      currentJobs.map((item) => (item.id === savedJob.id ? savedJob : item))
    );
    return savedJob;
  }, []);

  const deleteCreatedJob = useCallback(async (jobId) => {
    await api.delete(`/jobs/${jobId}`);
    setCreatedJobs((currentJobs) => currentJobs.filter((item) => item.id !== String(jobId)));
  }, []);

  const updateUserProfile = useCallback(async (profile) => {
    const res = await api.put('/users/me', profile);
    setUser(res.data);
    return res.data;
  }, []);

  useEffect(() => {
    if (!isAuthenticated) {
      return;
    }

    loadJobs();
  }, [isAuthenticated, loadJobs]);
  
  useEffect(() => {
    if (!isAuthenticated) {
      setIsLoadingUser(false);
      setUser(null);
      return;
    }

    let isMounted = true;

    const loadUser = async () => {
      setIsLoadingUser(true);
      setAuthError('');

      try {
        const res = await api.get('/users/me');

        if (isMounted) {
          setUser(res.data);
        }
      } catch (err) {
        if (!isMounted) {
          return;
        }

        if (err.response?.status === 401) {
          localStorage.removeItem('token');
          setUser(null);
          window.location.href = '/login';
          return;
        }

        setAuthError('Unable to reach the backend. Check `VITE_API_BASE_URL` or confirm FastAPI is running on `http://127.0.0.1:8000`.');
      } finally {
        if (isMounted) {
          setIsLoadingUser(false);
        }
      }
    };

    loadUser();

    return () => {
      isMounted = false;
    };
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (isLoadingUser) {
    return <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading...</div>;
  }

  if (authError) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', textAlign: 'center' }}>
        <div>
          <div style={{ fontSize: '18px', fontWeight: 600, marginBottom: '8px' }}>Connection problem</div>
          <div style={{ color: 'var(--text-secondary)', maxWidth: '420px' }}>{authError}</div>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="layout-grid">
      <aside className="column left-column">
        <LeftSidebar user={user} />
      </aside>
      
      <main className="column center-column">
        <Outlet
          context={{
            user,
            products,
            upvoteProduct,
            posts,
            setPosts,
            updateUserProfile,
            jobs,
            createdJobs,
            addCreatedJob,
            updateCreatedJob,
            deleteCreatedJob,
          }}
        />
      </main>
      
      <aside className="column right-column">
        <RightSidebar user={user} isDarkMode={isDarkMode} onToggleTheme={toggleTheme} />
      </aside>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <div className="app-container">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Feed />} />
            <Route path="launchpad" element={<Launchpad />} />
            <Route path="launchpad/:id" element={<ProductDetail />} />
            <Route path="jobs" element={<Jobs />} />
            <Route path="jobs/:id" element={<JobDetail />} />
            <Route path="ai-job-search" element={<AIJobSearch />} />
            <Route path="profile" element={<Profile />} />
          </Route>
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
