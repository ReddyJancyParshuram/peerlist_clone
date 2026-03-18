import React, { useMemo, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { FileText } from 'lucide-react';
import CreatePost from './CreatePost';
import Post from './Post';

export default function Feed({ user }) {
  const outletContext = useOutletContext();
  const currentUser = user ?? outletContext?.user;
  const posts = outletContext?.posts ?? [];
  const setPosts = outletContext?.setPosts;
  const [activeTab, setActiveTab] = useState('NEWEST');

  const getEngagementScore = (post) => {
    const likes = post.likes ?? 0;
    const comments = post.comment_items?.length ?? post.comments ?? 0;
    const shares = post.shares ?? 0;

    return likes + comments + shares;
  };

  const isTrendingPost = (post) => {
    const likes = post.likes ?? 0;
    const comments = post.comment_items?.length ?? post.comments ?? 0;
    const shares = post.shares ?? 0;

    return likes > 0 && comments > 0 && shares > 0;
  };

  const visiblePosts = useMemo(() => {
    if (activeTab === 'TRENDING') {
      return [...posts]
        .filter(isTrendingPost)
        .sort((leftPost, rightPost) => getEngagementScore(rightPost) - getEngagementScore(leftPost));
    }

    if (activeTab === 'FOLLOWING') {
      return posts.filter((post) => post.author?.username === currentUser?.username);
    }

    return [...posts].sort(
      (leftPost, rightPost) => new Date(rightPost.created_at).getTime() - new Date(leftPost.created_at).getTime()
    );
  }, [activeTab, currentUser?.username, posts]);

  const emptyState = useMemo(() => {
    if (activeTab === 'TRENDING') {
      return {
        title: 'No trending posts yet',
        copy: 'Posts need likes, comments, and shares before they appear here.',
      };
    }

    if (activeTab === 'FOLLOWING') {
      return {
        title: 'No posts from your network yet',
        copy: 'Posts from people you follow will appear here.',
      };
    }

    return {
      title: 'No posts yet',
      copy: 'Create the first update with text, media, or a quick poll.',
    };
  }, [activeTab]);

  const handlePostCreated = (newPost) => {
    setPosts?.((currentPosts) => [newPost, ...currentPosts]);
  };

  const handlePostUpdate = (postId, updater) => {
    setPosts?.((currentPosts) =>
      currentPosts.map((post) => {
        if (post.id !== postId) {
          return post;
        }

        return typeof updater === 'function' ? updater(post) : { ...post, ...updater };
      })
    );
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <div className="feed-header">
        <div className="feed-title">Scroll</div>
        <div className="feed-tabs">
          {['NEWEST', 'TRENDING', 'FOLLOWING'].map((tab) => (
            <button
              key={tab}
              type="button"
              className={`tab${activeTab === tab ? ' active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>
        <button style={{ border: '1px solid var(--border-color)', borderRadius: '50%', width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <FileText size={18} />
        </button>
      </div>

      <CreatePost onPostCreated={handlePostCreated} user={currentUser} />

      <div style={{ display: 'flex', flexDirection: 'column', paddingBottom: '24px' }}>
        {visiblePosts.map((post) => (
          <Post key={post.id} post={post} onUpdatePost={handlePostUpdate} />
        ))}
        {visiblePosts.length === 0 && (
          <div className="feed-empty-state">
            <div className="feed-empty-title">{emptyState.title}</div>
            <div className="feed-empty-copy">{emptyState.copy}</div>
          </div>
        )}
      </div>
    </div>
  );
}
