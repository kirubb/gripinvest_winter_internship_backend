import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import { UserProvider, useUser } from '../../context/UserContext.jsx'; // Import useUser
import ProfilePage from '../ProfilePage';
import apiClient from '../../api';

// 1. Mock the API as before
vi.mock('../../api');

// 2. Mock the useUser hook
vi.mock('../../context/UserContext.jsx', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useUser: vi.fn(), // Mock the hook
  };
});

// Define a valid mock user for the initial state
const mockUser = {
  first_name: 'Test',
  last_name: 'User',
  email: 'test@example.com',
  risk_appetite: 'moderate',
  balance: 10000, // Initial balance
};

describe('ProfilePage', () => {
  it('should allow a user to add funds to their balance', async () => {
    // Set up the mock return value for useUser BEFORE rendering
    useUser.mockReturnValue({
      user: mockUser,
      updateUser: vi.fn(), // Mock the update function
      loading: false, // Crucially set loading to false
    });

    // Mock the API response for the PUT request
    apiClient.put.mockResolvedValue({ 
      data: { 
        user: { ...mockUser, balance: 10500 }, // Updated user data
        token: 'new-token' 
      } 
    });

    render(
      // We no longer need the real UserProvider since we are mocking useUser
      // But we keep it simple by wrapping the page directly:
      <BrowserRouter>
        <ProfilePage />
      </BrowserRouter>
    );

    // Now the component will render the forms, and these elements will be found:
    const balanceInput = screen.getByLabelText(/Amount to add/i); // Use a more specific label part
    const fundsButton = screen.getByRole('button', { name: /Add Funds/i });

    await userEvent.type(balanceInput, '500');
    await userEvent.click(fundsButton);

    await waitFor(() => {
      // Check that the API was called with the correct numeric value
      expect(apiClient.put).toHaveBeenCalledWith('/user/profile', { addBalance: 500 });
    });

    // Check for the success message
    expect(await screen.findByText(/Balance added successfully!/i)).toBeInTheDocument();
  });
});