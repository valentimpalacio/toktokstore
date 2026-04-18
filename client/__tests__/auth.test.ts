// __tests__/auth.test.ts
import { render, screen, fireEvent } from '@testing-library/react';
import { AuthProvider } from '@/context/AuthContext';
import { Login } from '@/pages/Login';
import { mockLogin } from './mocks/auth';

describe('Login Page', () => {
  beforeEach(() => {
    render(
      <AuthProvider>
        <Login />
      </AuthProvider>
    );
  });

  test('renders login form', () => {
    expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login now/i })).toBeInTheDocument();
  });

  test('shows error on invalid credentials', async () => {
    mockLogin.mockRejectedValueOnce({ response: { data: { message: 'Invalid credentials' } } });
    
    fireEvent.change(screen.getByPlaceholderText(/email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByPlaceholderText(/password/i), { target: { value: 'wrong' } });
    fireEvent.click(screen.getByRole('button', { name: /login now/i }));
    
    expect(await screen.findByText(/invalid credentials/i)).toBeInTheDocument();
  });
};

// __tests__/products.test.ts
import { render, screen } from '@testing-library/react';
import { ProductsPage } from '@/pages/Products';

describe('Products Page', () => {
  test('renders product list', () => {
    render(<ProductsPage />);
    expect(screen.getByText(/featured products/i)).toBeInTheDocument();
  });
});

// __tests__/formatters.test.ts
import { formatPrice, formatDate, getStatusLabel } from '@/utils/formatters';

describe('Formatters', () => {
  test('formats price correctly', () => {
    expect(formatPrice(100)).toBe('R$ 100,00');
    expect(formatPrice(1299.99)).toBe('R$ 1.299,99');
  });

  test('formats date correctly', () => {
    const date = new Date('2026-04-18T10:30:00');
    expect(formatDate(date)).toMatch(/18\/04\/2026/);
  });

  test('returns status label', () => {
    expect(getStatusLabel('PENDING')).toBe('Pendente');
    expect(getStatusLabel('DELIVERED')).toBe('Entregue');
  });
});

// __tests__/utils.test.ts
defineConfig('slugify', () => {
  test('converts text to slug', () => {
    expect(slugify('Hello World')).toBe('hello-world');
    expect(slugify('  Test  Product  ')).toBe('test-product');
  });
});