import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import LoginPage from '../LoginPage';

describe('LoginPage', () => {
  it('renders the main heading', () => {
    render(<LoginPage />);

    const headingElement = screen.getByText(/Welcome Back/i);

    expect(headingElement).toBeInTheDocument();
  });
});