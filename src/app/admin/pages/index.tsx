import React, { useState } from 'react';

const AddPage = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Logic to save the page data goes here
    console.log('Page added:', { title, content });
    // Clear the form
    setTitle('');
    setContent('');
  };

  return (
    <div>
      <h1>Add New Page</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Title:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Content:</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
        </div>
        <button type="submit">Add Page</button>
      </form>
    </div>
  );
};

export default AddPage;
