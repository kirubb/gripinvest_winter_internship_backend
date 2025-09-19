import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { UserProvider } from '../../context/UserContext.jsx';
import ProductDetailPage from '../ProductDetailPage';
import apiClient from '../../api';

vi.mock('../../api');

describe('ProductDetailPage', () => {
  it('should allow a user to make an investment', async () => {
    const mockProduct = {
      id: 'prod-1',
      name: 'Test Product',
      description: 'A great product.',
      annual_yield: 10,
      risk_level: 'moderate',
      min_investment: 100,
    };
    // Mock the initial GET request to fetch the product
    apiClient.get.mockResolvedValue({ data: mockProduct });
    // Mock the POST request for making the investment
    apiClient.post.mockResolvedValue({ data: { message: 'Success' } });

    render(
      <UserProvider>
        <MemoryRouter initialEntries={['/products/prod-1']}>
          <Routes>
            <Route path="/products/:productId" element={<ProductDetailPage />} />
          </Routes>
        </MemoryRouter>
      </UserProvider>
    );

    // Wait for the page to load
    expect(await screen.findByText('Test Product')).toBeInTheDocument();

    // Find the input and the button
    const amountInput = screen.getByLabelText(/Amount/i);
    const investButton = screen.getByRole('button', { name: /Invest Now/i });

    // Simulate user typing an amount
    await userEvent.type(amountInput, '500');
    // Simulate clicking the button
    await userEvent.click(investButton);

    // Check that the API was called correctly
    await waitFor(() => {
      expect(apiClient.post).toHaveBeenCalledWith('/investments', {
        productId: 'prod-1',
        amount: 500,
      });
    });

    // Check that the success message appears
    expect(await screen.findByText(/Investment successful!/i)).toBeInTheDocument();
  });
});