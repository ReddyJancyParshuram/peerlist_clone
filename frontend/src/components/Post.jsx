import React, { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { ArrowUpRight, BarChart3, Link2, MessageSquare, Share2, ThumbsUp } from 'lucide-react';

export default function Post({ post, onUpdatePost }) {
  const timeStr = formatDistanceToNow(new Date(post.created_at), { addSuffix: true });
  const videoSrc = post.video || post.video_url || '';
  const [showCommentInput, setShowCommentInput] = useState(false);
  const [commentText, setCommentText] = useState('');
  const liked = post.liked ?? false;
  const shared = post.shared ?? false;
  const pollOptions = post.poll?.options ?? [];
  const selectedPollOption = post.selected_poll_option ?? null;

  const handleLike = () => {
    onUpdatePost?.(post.id, (currentPost) => ({
      ...currentPost,
      liked: !liked,
      likes: (currentPost.likes ?? 0) + (liked ? -1 : 1),
    }));
  };

  const handleComment = () => {
    setShowCommentInput((currentValue) => !currentValue);
  };

  const handleShare = () => {
    onUpdatePost?.(post.id, (currentPost) => ({
      ...currentPost,
      shared: !shared,
      shares: (currentPost.shares ?? 0) + (shared ? -1 : 1),
    }));
  };

  const handleCommentSubmit = () => {
    if (!commentText.trim()) {
      return;
    }

    onUpdatePost?.(post.id, (currentPost) => ({
      ...currentPost,
      comments: (currentPost.comments ?? 0) + 1,
      comment_items: [
        ...(currentPost.comment_items ?? []),
        {
          id: `${post.id}-${Date.now()}`,
          author: 'You',
          content: commentText.trim(),
        },
      ],
    }));
    setCommentText('');
  };

  const handlePollVote = (index) => {
    onUpdatePost?.(post.id, (currentPost) => {
      const currentSelectedOption = currentPost.selected_poll_option ?? null;

      return {
        ...currentPost,
        selected_poll_option: currentSelectedOption === index ? null : index,
        poll: currentPost.poll
          ? {
              ...currentPost.poll,
              options: currentPost.poll.options.map((option, optionIndex) => {
                if (optionIndex === currentSelectedOption && currentSelectedOption !== index) {
                  return { ...option, votes: Math.max(0, option.votes - 1) };
                }

                if (optionIndex === index) {
                  return {
                    ...option,
                    votes: option.votes + (currentSelectedOption === index ? -1 : 1),
                  };
                }

                return option;
              }),
            }
          : null,
      };
    });
  };

  const totalPollVotes = pollOptions.reduce((total, option) => total + option.votes, 0);

  return (
    <article className="feed-post-card">
      <div className="feed-post-header">
        <img
          src={post.author.avatar_url}
          alt={post.author.username}
          className="feed-post-avatar"
        />

        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="feed-post-author-row">
            <span className="feed-post-author">{post.author.full_name}</span>
            <span className="feed-post-follow">Follow</span>
          </div>
          <div className="feed-post-meta">
            @{post.author.username} • {timeStr}
          </div>
          <div className="feed-post-title">{post.author.title}</div>
        </div>
      </div>

      {post.content && <div className="feed-post-content">{post.content}</div>}

      {post.image_url && (
        <div className="feed-post-media">
          <img src={post.image_url} alt={post.image_name || 'Post visual'} className="feed-post-image" />
        </div>
      )}

      {videoSrc && (
        <div className="feed-post-media">
          <video controls src={videoSrc} className="feed-post-video">
            {post.video_type ? <source src={videoSrc} type={post.video_type} /> : <source src={videoSrc} type="video/mp4" />}
          </video>
        </div>
      )}

      {post.link_url && (
        <a href={post.link_url} target="_blank" rel="noreferrer" className="feed-post-link-card">
          <div className="feed-post-link-icon">
            <Link2 size={18} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div className="feed-post-link-title">Shared link</div>
            <div className="feed-post-link-url">{post.link_url}</div>
          </div>
          <ArrowUpRight size={16} className="feed-post-link-arrow" />
        </a>
      )}

      {post.poll && (
        <div className="feed-post-poll">
          <div className="feed-post-poll-title">{post.poll.question}</div>
          <div className="feed-post-poll-options">
            {pollOptions.map((option, index) => {
              const percentage = totalPollVotes > 0 ? Math.round((option.votes / totalPollVotes) * 100) : 0;

              return (
                <button
                  key={option.label}
                  type="button"
                  className={`feed-post-poll-option${selectedPollOption === index ? ' selected' : ''}`}
                  onClick={() => handlePollVote(index)}
                >
                  <span>{option.label}</span>
                  <span>{percentage}%</span>
                </button>
              );
            })}
          </div>
          <div className="feed-post-poll-meta">
            <BarChart3 size={14} /> {totalPollVotes} vote{totalPollVotes === 1 ? '' : 's'}
          </div>
        </div>
      )}

      <div className="feed-post-actions">
        <button type="button" onClick={handleLike} className={`feed-post-action${liked ? ' active' : ''}`}>
          <ThumbsUp size={18} /> {post.likes ?? 0}
        </button>
        <button type="button" onClick={handleComment} className="feed-post-action">
          <MessageSquare size={18} /> {post.comments ?? 0}
        </button>
        <button type="button" onClick={handleShare} className={`feed-post-action${shared ? ' active' : ''}`}>
          <Share2 size={18} /> {post.shares ?? 0}
        </button>
      </div>

      {showCommentInput && (
        <div className="feed-post-comments">
          <div className="feed-post-comment-composer">
            <input
              type="text"
              className="feed-post-comment-input"
              placeholder="Write a comment"
              value={commentText}
              onChange={(event) => setCommentText(event.target.value)}
            />
            <button type="button" className="feed-post-comment-submit" onClick={handleCommentSubmit}>
              Comment
            </button>
          </div>

          {(post.comment_items ?? []).length > 0 && (
            <div className="feed-post-comment-list">
              {(post.comment_items ?? []).map((comment) => (
                <div key={comment.id} className="feed-post-comment-item">
                  <div className="feed-post-comment-author">{comment.author}</div>
                  <div className="feed-post-comment-body">{comment.content}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </article>
  );
}
