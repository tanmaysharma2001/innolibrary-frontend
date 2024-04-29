import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter as Router } from 'react-router-dom'; // Import Router for navigation testing
import { createMemoryHistory, MemoryHistory } from 'history'; // Import createMemoryHistory to create a history object
import { LoginPage } from '../src/pages/Authentication/LoginPage';

describe('LoginPage component', () => {
  test('renders login form with username and password fields', () => {
    const history: MemoryHistory = createMemoryHistory();
    render(
      <Router history={history}>
        <LoginPage />
      </Router>
    );

    expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  });

  test('submits form with correct values and navigates to library route', async () => {
    const history = createMemoryHistory(); // Create a history object
    render(
      <Router history={history}>
        <LoginPage />
      </Router>
    );

    // Fill in the form fields
    fireEvent.change(screen.getByLabelText(/username/i), {
      target: { value: 'testuser' },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'testpassword' },
    });

    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    // Assert that the history object contains the library route
    expect(history.location.pathname).toBe('/library');
  });

  test('stays on login page with incorrect credentials', async () => {
    const history = createMemoryHistory(); // Create a history object
    render(
      <Router history={history}>
        <LoginPage />
      </Router>
    );

    // Fill in the form fields with incorrect credentials
    fireEvent.change(screen.getByLabelText(/username/i), {
      target: { value: 'incorrectuser' },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'incorrectpassword' },
    });

    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    // Assert that the history object still points to the login route
    expect(history.location.pathname).toBe('/login');
  });
});
