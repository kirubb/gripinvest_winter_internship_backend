import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import SignupPage from '../SignupPage';
import axios from 'axios';

vi.mock('axios');

describe('SignupPage', () => {
  let alertSpy;

  beforeEach(() => {
    alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});
  });

  afterEach(() => {
    alertSpy.mockRestore();
  });

  it('should submit the form with user data', async () => {
    axios.post.mockResolvedValue({ data: { message: 'Success' } });
    render(<BrowserRouter><SignupPage /></BrowserRouter>);
    
    await userEvent.type(screen.getByLabelText(/First Name/i), 'Test');
    await userEvent.type(screen.getByLabelText(/Email Address/i), 'test@example.com');
    await userEvent.type(screen.getByLabelText(/Password/i), 'Password123!');
    await userEvent.click(screen.getByRole('button', { name: /Sign Up/i }));

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalled();
    });
    
    expect(alertSpy).toHaveBeenCalledWith('Signup successful! Please log in.');
  });

  it('should display an error message if signup fails', async () => {
    axios.post.mockRejectedValue({
      response: { data: { message: 'Email already exists.' } },
    });
    render(<BrowserRouter><SignupPage /></BrowserRouter>);

    // Add these lines to fill the form before submitting
    await userEvent.type(screen.getByLabelText(/First Name/i), 'Test');
    await userEvent.type(screen.getByLabelText(/Email Address/i), 'test@example.com');
    await userEvent.type(screen.getByLabelText(/Password/i), 'Password123!');

    await userEvent.click(screen.getByRole('button', { name: /Sign Up/i }));
    
    expect(await screen.findByText('Email already exists.')).toBeInTheDocument();
  });
});