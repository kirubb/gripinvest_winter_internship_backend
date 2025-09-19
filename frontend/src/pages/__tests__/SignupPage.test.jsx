import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import SignupPage from '../SignupPage';
import axios from 'axios';

vi.mock('axios');

describe('SignupPage', () => {
  it('should submit the form with user data', async () => {
    axios.post.mockResolvedValue({ data: { message: 'Success' } });

    render(
      <BrowserRouter>
        <SignupPage />
      </BrowserRouter>
    );
    
    await userEvent.type(screen.getByLabelText(/First Name/i), 'Test');
    await userEvent.type(screen.getByLabelText(/Email Address/i), 'test@example.com');
    await userEvent.type(screen.getByLabelText(/Password/i), 'Password123!');
    await userEvent.click(screen.getByRole('button', { name: /Sign Up/i }));

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith('http://localhost:3001/api/auth/signup', {
        first_name: 'Test',
        email: 'test@example.com',
        password: 'Password123!',
      });
    });
  });
});