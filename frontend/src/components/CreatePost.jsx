import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowUpRight, Image, Link2, ListChecks, Send, Video, X } from 'lucide-react';

const emptyPoll = {
  question: '',
  options: ['', '', ''],
};

const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'avif'];
const videoExtensions = ['mp4', 'webm', 'mov', 'ogg', 'm4v'];

const getUrlExtension = (value) => {
  const sanitizedValue = value.split('?')[0].split('#')[0];
  const segments = sanitizedValue.split('.');
  return segments.length > 1 ? segments.pop().toLowerCase() : '';
};

const getMediaTypeFromUrl = (value) => {
  const extension = getUrlExtension(value.trim());

  if (imageExtensions.includes(extension)) {
    return 'image';
  }

  if (videoExtensions.includes(extension)) {
    return 'video';
  }

  return '';
};

export default function CreatePost({ onPostCreated, user }) {
  const imageInputRef = useRef(null);
  const videoInputRef = useRef(null);
  const [content, setContent] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [selectedImagePreviewUrl, setSelectedImagePreviewUrl] = useState('');
  const [selectedVideoPreviewUrl, setSelectedVideoPreviewUrl] = useState('');
  const [mediaUrl, setMediaUrl] = useState('');
  const [showMediaUrlInput, setShowMediaUrlInput] = useState(false);
  const [showPollComposer, setShowPollComposer] = useState(false);
  const [pollDraft, setPollDraft] = useState(emptyPoll);

  const mediaUrlType = useMemo(() => getMediaTypeFromUrl(mediaUrl), [mediaUrl]);

  useEffect(() => {
    return () => {
      if (selectedImagePreviewUrl) {
        URL.revokeObjectURL(selectedImagePreviewUrl);
      }
      if (selectedVideoPreviewUrl) {
        URL.revokeObjectURL(selectedVideoPreviewUrl);
      }
    };
  }, [selectedImagePreviewUrl, selectedVideoPreviewUrl]);

  const isPollValid =
    pollDraft.question.trim() && pollDraft.options.every((option) => option.trim());

  const canSubmit =
    content.trim() || selectedImage || selectedVideo || (showMediaUrlInput && mediaUrl.trim()) || (showPollComposer && isPollValid);

  const normalizedMediaUrl = mediaUrl.trim();
  const showLinkPreview = showMediaUrlInput && normalizedMediaUrl && !mediaUrlType;

  const clearFileInputs = () => {
    if (imageInputRef.current) {
      imageInputRef.current.value = '';
    }
    if (videoInputRef.current) {
      videoInputRef.current.value = '';
    }
  };

  const clearMedia = () => {
    if (selectedImagePreviewUrl) {
      URL.revokeObjectURL(selectedImagePreviewUrl);
    }
    if (selectedVideoPreviewUrl) {
      URL.revokeObjectURL(selectedVideoPreviewUrl);
    }
    setSelectedImage(null);
    setSelectedVideo(null);
    setSelectedImagePreviewUrl('');
    setSelectedVideoPreviewUrl('');
    setMediaUrl('');
    setShowMediaUrlInput(false);
    clearFileInputs();
  };

  const resetPollComposer = () => {
    setShowPollComposer(false);
    setPollDraft(emptyPoll);
  };

  const activateImageUpload = () => {
    clearMedia();
    resetPollComposer();
    imageInputRef.current?.click();
  };

  const activateVideoUpload = () => {
    clearMedia();
    resetPollComposer();
    videoInputRef.current?.click();
  };

  const activateMediaUrl = () => {
    clearMedia();
    resetPollComposer();
    setShowMediaUrlInput(true);
  };

  const activatePollComposer = () => {
    clearMedia();
    setShowPollComposer(true);
    setPollDraft(emptyPoll);
  };

  const resetComposer = () => {
    setContent('');
    clearMedia();
    resetPollComposer();
  };

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    clearMedia();
    resetPollComposer();
    setSelectedImage(file);
    setSelectedImagePreviewUrl(URL.createObjectURL(file));
  };

  const handleVideoChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    clearMedia();
    resetPollComposer();
    setSelectedVideo(file);
    setSelectedVideoPreviewUrl(URL.createObjectURL(file));
  };

  const handlePollOptionChange = (index, value) => {
    setPollDraft((currentPoll) => ({
      ...currentPoll,
      options: currentPoll.options.map((option, optionIndex) =>
        optionIndex === index ? value : option
      ),
    }));
  };

  const submitPost = () => {
    if (!canSubmit) {
      return;
    }

    const stableImageUrl = selectedImage ? URL.createObjectURL(selectedImage) : null;
    const stableVideoUrl = selectedVideo ? URL.createObjectURL(selectedVideo) : null;

    onPostCreated({
      id: Date.now().toString(),
      content: content.trim(),
      created_at: new Date().toISOString(),
      author: {
        full_name: user?.full_name || 'You',
        username: user?.username || 'maker',
        title: user?.title || 'Building in public',
        avatar_url: user?.avatar_url || 'https://api.dicebear.com/7.x/avataaars/svg?seed=fallback',
      },
      image_url: stableImageUrl || (mediaUrlType === 'image' ? normalizedMediaUrl : null),
      video: stableVideoUrl || (mediaUrlType === 'video' ? normalizedMediaUrl : null),
      video_url: stableVideoUrl || (mediaUrlType === 'video' ? normalizedMediaUrl : null),
      video_type: selectedVideo?.type || (mediaUrlType === 'video' ? 'video/mp4' : null),
      link_url: showLinkPreview ? normalizedMediaUrl : null,
      image_name: selectedImage?.name || (mediaUrlType === 'image' ? 'Linked image' : null),
      video_name: selectedVideo?.name || (mediaUrlType === 'video' ? 'Linked video' : null),
      poll:
        showPollComposer && isPollValid
          ? {
              question: pollDraft.question.trim(),
              options: pollDraft.options.map((option) => ({
                label: option.trim(),
                votes: 0,
              })),
            }
          : null,
      likes: 0,
      liked: false,
      comments: 0,
      shares: 0,
      shared: false,
      comment_items: [],
      selected_poll_option: null,
    });

    resetComposer();
  };

  return (
    <section className="composer-card">
      <div className="composer-top">
        <img
          src={user?.avatar_url || 'https://api.dicebear.com/7.x/avataaars/svg?seed=fallback'}
          alt="Avatar"
          className="composer-avatar"
        />

        <div className="composer-main">
          <textarea
            className="composer-textarea"
            placeholder="Share an update, launch, or insight with your network"
            value={content}
            onChange={(event) => setContent(event.target.value)}
          />

          {showMediaUrlInput && (
            <div className="composer-preview">
              <div className="composer-poll-box">
                <div className="composer-inline-header">
                  <div className="composer-section-title">Media URL</div>
                  <button type="button" className="composer-inline-dismiss" onClick={clearMedia}>
                    <X size={16} />
                  </button>
                </div>
                <input
                  type="text"
                  className="composer-input"
                  placeholder="Paste any image, video, or website URL"
                  value={mediaUrl}
                  onChange={(event) => setMediaUrl(event.target.value)}
                />
                <div className="composer-helper-copy">
                  Direct media links render previews. Any other URL becomes a link preview post.
                </div>
              </div>
            </div>
          )}

          {(selectedImagePreviewUrl || selectedVideoPreviewUrl || (showMediaUrlInput && mediaUrlType) || showLinkPreview) && (
            <div className="composer-preview">
              {(selectedImagePreviewUrl || mediaUrlType === 'image') && (
                <div className="composer-preview-media">
                  <img
                    src={selectedImagePreviewUrl || normalizedMediaUrl}
                    alt={selectedImage?.name || 'Preview'}
                    className="composer-preview-image"
                  />
                  <div className="composer-preview-label">
                    {selectedImage ? `Image: ${selectedImage.name}` : 'Image preview from URL'}
                  </div>
                </div>
              )}

              {(selectedVideoPreviewUrl || mediaUrlType === 'video') && (
                <div className="composer-preview-media">
                  <video src={selectedVideoPreviewUrl || normalizedMediaUrl} controls className="composer-preview-video" />
                  <div className="composer-preview-label">
                    {selectedVideo ? `Video: ${selectedVideo.name}` : 'Video preview from URL'}
                  </div>
                </div>
              )}

              {showLinkPreview && (
                <a href={normalizedMediaUrl} target="_blank" rel="noreferrer" className="composer-link-preview">
                  <div className="composer-link-preview-icon">
                    <Link2 size={18} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="composer-link-preview-title">Link preview</div>
                    <div className="composer-link-preview-url">{normalizedMediaUrl}</div>
                  </div>
                  <ArrowUpRight size={16} />
                </a>
              )}
            </div>
          )}

          {showPollComposer && (
            <div className="composer-poll-box">
              <div className="composer-inline-header">
                <div className="composer-section-title">Create Poll</div>
                <button type="button" className="composer-inline-dismiss" onClick={resetPollComposer}>
                  <X size={16} />
                </button>
              </div>

              <input
                type="text"
                className="composer-input"
                placeholder="Poll question"
                value={pollDraft.question}
                onChange={(event) =>
                  setPollDraft((currentPoll) => ({
                    ...currentPoll,
                    question: event.target.value,
                  }))
                }
              />

              {pollDraft.options.map((option, index) => (
                <input
                  key={index}
                  type="text"
                  className="composer-input"
                  placeholder={`Option ${index + 1}`}
                  value={option}
                  onChange={(event) => handlePollOptionChange(index, event.target.value)}
                />
              ))}

              <div className="composer-secondary-actions">
                <button type="button" className="composer-secondary-button" onClick={resetPollComposer}>
                  Cancel
                </button>
              </div>
            </div>
          )}

          <div className="composer-actions">
            <div className="composer-tool-row">
              <input
                ref={imageInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                style={{ display: 'none' }}
              />
              <input
                ref={videoInputRef}
                type="file"
                accept="video/*"
                onChange={handleVideoChange}
                style={{ display: 'none' }}
              />

              <button type="button" className={`composer-tool${selectedImage ? ' active' : ''}`} onClick={activateImageUpload}>
                <Image size={18} /> Image
              </button>
              <button type="button" className={`composer-tool${selectedVideo ? ' active' : ''}`} onClick={activateVideoUpload}>
                <Video size={18} /> Video
              </button>
              <button type="button" className={`composer-tool${showMediaUrlInput ? ' active' : ''}`} onClick={activateMediaUrl}>
                <Link2 size={18} /> Media URL
              </button>
              <button
                type="button"
                className={`composer-tool${showPollComposer ? ' active' : ''}`}
                onClick={activatePollComposer}
              >
                <ListChecks size={18} /> Poll
              </button>
            </div>

            <button
              type="button"
              className="btn-primary composer-submit"
              onClick={submitPost}
              disabled={!canSubmit}
            >
              <Send size={16} /> Post
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
