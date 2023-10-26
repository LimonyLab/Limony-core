// src/components/Chat/SendMessageForm.js
import React, { useState } from 'react';
import styled from 'styled-components';

const Form = styled.form`
  display: flex;
  margin-top: 1em;
`;

const Input = styled.input`
  flex-grow: 1;
  border: 1px solid rgb(0, 123, 255);
  border-radius: 4px;
  padding: 0.5em;
  margin-right: 0.5em;
  width: 100%;
  height: 50px;
  box-shadow: 0px 0px 5px rgba(0,0,0,0.1);
  font-size: 16px;
`;

const Button = styled.button`
  background-color: #007BFF;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 0.5em 1em;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #0056b3;
  }
`;

const Textarea = styled.textarea`
  flex-grow: 1;
  border: 1px solid rgb(0, 123, 255);
  border-radius: 4px;
  padding: 0.5em;
  margin-right: 0.5em;
  width: 100%;
  height: 50px;
  box-shadow: 0px 0px 5px rgba(0,0,0,0.1);
  font-size: 16px;
  resize: vertical; // Allows users to resize the textarea vertically
`;



function SendMessageForm({ onSend }) {
  const [message, setMessage] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    onSend(message);
    setMessage('');
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type your message..."
      />
      <Button type="submit">Send</Button>
    </Form>
  );
}

export default SendMessageForm;
