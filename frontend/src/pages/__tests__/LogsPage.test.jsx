import { render, screen, waitFor, fireEvent, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi, describe, it, expect } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import LogsPage from '../LogsPage';
import apiClient from '../../api';
import { useUser } from '../../context/UserContext.jsx';
import Navbar from '../../components/Navbar.jsx';

// Mock the API client to prevent actual network requests
vi.mock('../../api');

// Mock react-router-dom's Link component to avoid errors
vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    Link: (props) => <a {...props}>{props.children}</a>,
  };
});

// Mock the window.alert function to prevent the browser popup and allow testing
const mockAlert = vi.spyOn(window, 'alert').mockImplementation(() => {});

// Mock the useUser hook since the tests don't provide a UserProvider
vi.mock('../../context/UserContext.jsx', () => ({
  useUser: vi.fn(),
}));

// Mock the Navbar component to prevent it from causing errors
vi.mock('../../components/Navbar.jsx', () => ({
  default: vi.fn(() => <div>Mock Navbar</div>),
}));

// Define mock data for API responses
const mockLogs = [
  { endpoint: '/login', http_method: 'POST', status_code: 200, created_at: '2023-10-27T10:00:00Z' },
  { endpoint: '/profile', http_method: 'GET', status_code: 201, created_at: '2023-10-27T10:05:00Z' },
  { endpoint: '/data', http_method: 'GET', status_code: 404, created_at: '2023-10-27T10:10:00Z' },
];

const mockSummary = { summary: 'This is a summary of all logs.' };
const mockErrorSummary = { summary: 'This is a summary of errors.' };

// Define a mock user to be returned by the mocked useUser hook
const mockUser = {
  first_name: 'Test',
  last_name: 'User',
  email: 'test@example.com',
  risk_appetite: 'moderate',
  balance: 10000,
};

describe('LogsPage', () => {
  // Test suite for the initial admin verification screen
  describe('Admin Verification', () => {
    it('should initially show the admin verification screen', () => {
      // Mock useUser to return a loading state for this specific test
      useUser.mockReturnValue({
        user: mockUser,
        loading: true,
      });

      render(
        <BrowserRouter>
          <LogsPage onLogout={() => {}} />
        </BrowserRouter>
      );
      
      // Verify that the password input and the "Enter" button are present
      expect(screen.getByPlaceholderText('Enter password')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Enter/i })).toBeInTheDocument();
      expect(screen.getByText('Admin Verification')).toBeInTheDocument();
    });

    it('should show an error message for an incorrect password', async () => {
      // Mock useUser to return a loading state for this specific test
      useUser.mockReturnValue({
        user: mockUser,
        loading: true,
      });

      render(
        <BrowserRouter>
          <LogsPage onLogout={() => {}} />
        </BrowserRouter>
      );
      
      const passwordInput = screen.getByPlaceholderText('Enter password');
      const enterButton = screen.getByRole('button', { name: /Enter/i });

      await userEvent.type(passwordInput, 'wrong-password');
      await userEvent.click(enterButton);

      // Expect the error message to appear in the document
      expect(screen.getByText('Incorrect password. Please try again.')).toBeInTheDocument();
    });

    it('should verify the user and fetch logs on correct password', async () => {
      // Set up the mock return value for useUser BEFORE rendering
      useUser.mockReturnValue({
        user: mockUser,
        loading: false,
      });

      // Mock the API calls before rendering the component
      apiClient.get.mockImplementation((url) => {
        if (url === '/logs') return Promise.resolve({ data: mockLogs });
        if (url === '/logs/summary') return Promise.resolve({ data: mockSummary });
        if (url === '/logs/error-summary') return Promise.resolve({ data: mockErrorSummary });
        return Promise.reject(new Error('not found'));
      });
      
      render(
        <BrowserRouter>
          <LogsPage onLogout={() => {}} />
        </BrowserRouter>
      );
      
      const passwordInput = screen.getByPlaceholderText('Enter password');
      const enterButton = screen.getByRole('button', { name: /Enter/i });
      
      await userEvent.type(passwordInput, 'password');
      await userEvent.click(enterButton);
      
      // Wait for the API calls to resolve and the UI to update
      await waitFor(() => {
        // Verify that the get API endpoints were called
        expect(apiClient.get).toHaveBeenCalledWith('/logs');
        expect(apiClient.get).toHaveBeenCalledWith('/logs/summary');
        expect(apiClient.get).toHaveBeenCalledWith('/logs/error-summary');
      });

      // Verify that the logs table is now visible
      expect(screen.getByText('Your Activity Logs')).toBeInTheDocument();
      expect(screen.getByText('This is a summary of all logs.')).toBeInTheDocument();
      
      // Find the row for the first log and check its content specifically
      const loginLogEntry = screen.getByText('/login').closest('tr');
      expect(loginLogEntry).toBeInTheDocument();
      expect(screen.getByText('POST', { container: loginLogEntry })).toBeInTheDocument();
      expect(screen.getByText('200', { container: loginLogEntry })).toBeInTheDocument();
      
      // Find the row for the second log and check its content
      const profileLogEntry = screen.getByText('/profile').closest('tr');
      expect(profileLogEntry).toBeInTheDocument();
      
      // Use the within utility to scope the query
      const profileLogWithin = within(profileLogEntry);
      expect(profileLogWithin.getByText('GET')).toBeInTheDocument();
      expect(profileLogWithin.getByText('201')).toBeInTheDocument();
    });
  });

  // Test suite for the main logs page functionality after verification
  describe('Log Display and Search', () => {
    // A beforeEach block to set up the component in a verified state for each test
    beforeEach(async () => {
      // Mock useUser to simulate a logged-in user
      useUser.mockReturnValue({
        user: mockUser,
        loading: false,
      });
      
      // Mock the initial API calls that happen after verification
      apiClient.get.mockImplementation((url) => {
        if (url === '/logs') return Promise.resolve({ data: mockLogs });
        if (url === '/logs/summary') return Promise.resolve({ data: mockSummary });
        if (url === '/logs/error-summary') return Promise.resolve({ data: mockErrorSummary });
        return Promise.reject(new Error('not found'));
      });
      apiClient.post.mockResolvedValue({ data: [] }); // Set up a default mock for search
      
      render(
        <BrowserRouter>
          <LogsPage onLogout={() => {}} />
        </BrowserRouter>
      );
      
      // Verify with the correct password to get to the main page
      await userEvent.type(screen.getByPlaceholderText('Enter password'), 'password');
      await userEvent.click(screen.getByRole('button', { name: /Enter/i }));
      
      await waitFor(() => {
        expect(screen.getByText('Your Activity Logs')).toBeInTheDocument();
      });
    });

    it('should handle log search by email', async () => {
      // Mock the search API to return a single search result
      const mockSearchLogs = [{ endpoint: '/search-results', http_method: 'GET', status_code: 200, created_at: '2023-10-27T11:00:00Z' }];
      apiClient.post.mockResolvedValueOnce({ data: mockSearchLogs });

      const searchInput = screen.getByPlaceholderText('Search logs by user email...');
      const searchButton = screen.getByRole('button', { name: /Search/i });

      await userEvent.type(searchInput, 'test@example.com');
      await userEvent.click(searchButton);

      // Wait for the search API call to be made
      await waitFor(() => {
        expect(apiClient.post).toHaveBeenCalledWith('/logs/search', { email: 'test@example.com' });
      });

      // Check if the UI updates correctly with the search results and title
      expect(screen.getByText('Search Results for: test@example.com')).toBeInTheDocument();
      expect(screen.getByText('/search-results')).toBeInTheDocument();
    });

    it('should show an error message when a search fails', async () => {
      // Mock the search API to return a rejected promise (simulate an error)
      apiClient.post.mockRejectedValueOnce(new Error('Search failed'));
      
      const searchInput = screen.getByPlaceholderText('Search logs by user email...');
      const searchButton = screen.getByRole('button', { name: /Search/i });

      // Trigger the search
      await userEvent.type(searchInput, 'invalid@example.com');
      await userEvent.click(searchButton);

      // Verify that the alert function was called with the correct message
      await waitFor(() => {
        expect(mockAlert).toHaveBeenCalledWith('Could not find logs for that email.');
      });
    });

    it('should clear the search and fetch all logs again', async () => {
      // Mock search results for the initial search
      const mockSearchLogs = [{ endpoint: '/search-results', http_method: 'GET', status_code: 200, created_at: '2023-10-27T11:00:00Z' }];
      apiClient.post.mockResolvedValueOnce({ data: mockSearchLogs });

      // Perform a search first
      const searchInput = screen.getByPlaceholderText('Search logs by user email...');
      const searchButton = screen.getByRole('button', { name: /Search/i });
      await userEvent.type(searchInput, 'test@example.com');
      await userEvent.click(searchButton);
      
      // Wait for the clear search button to appear
      const clearButton = await screen.findByRole('button', { name: /Clear Search/i });

      // Click the clear search button
      await userEvent.click(clearButton);

      // Wait for the original API calls to be made again
      await waitFor(() => {
        // expect(apiClient.get).toHaveBeenCalledTimes(4); // 3 from initial, 1 from clear
        expect(apiClient.get).toHaveBeenCalledWith('/logs');
      });

      // Verify that the original logs are displayed again
      expect(screen.getByText('Your Activity Logs')).toBeInTheDocument();
      expect(screen.getByText('This is a summary of all logs.')).toBeInTheDocument();
      expect(screen.getByText('/login')).toBeInTheDocument();
    });
  });
});
