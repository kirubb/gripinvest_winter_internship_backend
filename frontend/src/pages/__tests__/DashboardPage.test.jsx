
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import { UserProvider } from '../../context/UserContext.jsx';
import DashboardPage from '../DashboardPage';
import apiClient from '../../api';

vi.mock('../../api');

describe('DashboardPage', () => {
  it('should fetch and display the user portfolio', async () => {
    const mockPortfolio = [
      { id: 'inv-1', product_name: 'Test Bond', amount: 5000, expected_return: 200, status: 'active', invested_at: new Date().toISOString() },
      { id: 'inv-2', product_name: 'Test Fund', amount: 10000, expected_return: 1500, status: 'active', invested_at: new Date().toISOString() },
    ];
    apiClient.get.mockResolvedValue({ data: mockPortfolio });

    render(
      <UserProvider>
        <BrowserRouter>
          <DashboardPage />
        </BrowserRouter>
      </UserProvider>
    );

    // Use findByText which automatically waits for the element to appear
    expect(await screen.findByText('Test Bond')).toBeInTheDocument();
    expect(await screen.findByText('$10000.00')).toBeInTheDocument();
    expect(screen.getByText('+200.00 return')).toBeInTheDocument();
  });
});