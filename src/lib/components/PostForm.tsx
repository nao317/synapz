'use client';

import { useState, useRef } from 'react';
import styles from './PostForm.module.css';
import { Button } from './Button';
import { Post } from '../types';

type PostFormProps = {
  addPost: (post: Post) => void;
};

export default function PostForm({ addPost }: PostFormProps) {
  const [content, setContent] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!content.trim() && !image) {
      setError('Post content or image cannot be empty.');
      return;
    }

    try {
      let imageUrl = '';
      if (image) {
        const formData = new FormData();
        formData.append('file', image);

        const res = await fetch('/api/posts/image', {
          method: 'POST',
          body: formData,
        });

        if (!res.ok) {
          throw new Error('Failed to upload image');
        }

        const data = await res.json();
        imageUrl = data.url;
      }

      const res = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content, image: imageUrl }),
      });

      if (!res.ok) {
        throw new Error('Failed to create post');
      }

      const newPost = await res.json();
      addPost(newPost);
      setContent('');
      setImage(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      setError('Error creating post');
      console.error(error);
    }
  };

  const triggerFileSelect = () => fileInputRef.current?.click();

  return (
    <form onSubmit={handleSubmit} className={styles.postForm}>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="いまなにしてる？"
        className={styles.textarea}
      />
      <div className={styles.formActions}>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className={styles.fileInput}
          ref={fileInputRef}
          style={{ display: 'none' }}
        />
        <Button type="button" onClick={triggerFileSelect} className={styles.attachButton}>
          画像
        </Button>
        {image && <span className={styles.fileName}>{image.name}</span>}
        <Button type="submit" className={styles.button}>投稿</Button>
      </div>
      {error && <p className={styles.error}>{error}</p>}
    </form>
  );
}
