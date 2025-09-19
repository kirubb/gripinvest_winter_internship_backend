import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import axios from 'axios';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect, vi, afterEach } from 'vitest';
import ForgotPasswordPage from '../ForgotPasswordPage';

// --- Mocks setup ---
vi.mock('axios');

// --- Test Suite ---
describe('ForgotPasswordPage', () => {
  // Clean up mocks after each test to ensure a clean state
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should show a success message when the reset link is sent successfully', async () => {
    const userEmail = 'test@example.com';
    const successMessage = 'Password reset link sent to your email.';
    axios.post.mockResolvedValue({
      data: { message: successMessage },
    });

    render(
      <BrowserRouter>
        <ForgotPasswordPage />
      </BrowserRouter>
    );

    // Simulate user typing their email
    fireEvent.change(screen.getByPlaceholderText('Enter your email address'), {
      target: { value: userEmail },
    });

    // Simulate clicking the submit button
    fireEvent.click(screen.getByRole('button', { name: 'Send Reset Link' }));

    // Wait for the success message to appear in the document
    const messageElement = await screen.findByText(successMessage);
    expect(messageElement).toBeInTheDocument();

    // Verify that axios was called with the correct URL and payload
    expect(axios.post).toHaveBeenCalledWith(
      'http://localhost:3001/api/auth/forgot-password',
      { email: userEmail }
    );
  });

  it('should show an error message if the API call fails', async () => {
    const userEmail = 'nouser@example.com';
    const errorMessage = 'User with that email does not exist.';
    // Mock a rejected promise for the API call
    axios.post.mockRejectedValue({
      response: { data: { message: errorMessage } },
    });

    render(
      <BrowserRouter>
        <ForgotPasswordPage />
      </BrowserRouter>
    );

    // Simulate user input
    fireEvent.change(screen.getByPlaceholderText('Enter your email address'), {
      target: { value: userEmail },
    });

    // Simulate form submission
    fireEvent.click(screen.getByRole('button', { name: 'Send Reset Link' }));

    // Wait for the error message to appear
    const messageElement = await screen.findByText(errorMessage);
    expect(messageElement).toBeInTheDocument();
  });
});