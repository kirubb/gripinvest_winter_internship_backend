import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import ProductsPage from '../ProductsPage';
import apiClient from '../../api';
import { UserProvider } from '../../context/UserContext.jsx';

vi.mock('../../api');

describe('ProductsPage', () => {
  it('should filter products when a risk button is clicked', async () => {
    const mockProducts = [
      { id: '1', name: 'Low Risk Bond', risk_level: 'low', annual_yield: 5, tenure_months: 12 },
      { id: '2', name: 'High Risk Fund', risk_level: 'high', annual_yield: 15, tenure_months: 60 },
    ];
    apiClient.get.mockResolvedValue({ data: mockProducts });

    render(
      <UserProvider>
        <BrowserRouter>
          <ProductsPage />
        </BrowserRouter>
      </UserProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Low Risk Bond')).toBeInTheDocument();
      expect(screen.getByText('High Risk Fund')).toBeInTheDocument();
    });

    const highRiskButton = screen.getByRole('button', { name: /High Risk/i });
    await userEvent.click(highRiskButton);
    
    expect(screen.queryByText('Low Risk Bond')).not.toBeInTheDocument();
    expect(screen.getByText('High Risk Fund')).toBeInTheDocument();
  });
});