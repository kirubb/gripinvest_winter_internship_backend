import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import ResetPasswordPage from '../ResetPasswordPage';
import axios from 'axios';

vi.mock('axios');

describe('ResetPasswordPage', () => {
  it('should render the form and submit a new password', async () => {
    axios.post.mockResolvedValue({ data: { message: 'Password has been reset successfully.' } });

    render(
      <MemoryRouter initialEntries={['/reset-password/fake-token']}>
        <Routes>
          <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByRole('heading', { name: /Reset Your Password/i })).toBeInTheDocument();

    await userEvent.type(screen.getByPlaceholderText(/Enter your new password/i), 'NewPassword123!');
    await userEvent.click(screen.getByRole('button', { name: /Set New Password/i }));

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith('http://localhost:3001/api/auth/reset-password', {
        token: 'fake-token',
        password: 'NewPassword123!',
      });
    });

    expect(await screen.findByText(/Password has been reset successfully./i)).toBeInTheDocument();
  });
});