'use client';

import { useState } from 'react';
import styles from './PostForm.module.css';
import { Post } from '../types';

type PostFormProps = {
  addPost: (post: Post) => void;
};

export default function PostForm({ addPost }: PostFormProps) {
  const [content, setContent] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!content.trim()) {
      setError('Post content cannot be empty.');
      return;
    }

    try {
      const res = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content }),
      });

      if (!res.ok) {
        throw new Error('Failed to create post');
      }

      const newPost = await res.json();
      addPost(newPost);
      setContent('');
    } catch (error) { 
      setError('Error creating post');
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.postForm}>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="What's on your mind?"
        className={styles.textarea}
      />
      <button type="submit" className={styles.button}>Post</button>
      {error && <p className={styles.error}>{error}</p>}
    </form>
  );
}
