import { render, screen } from '@testing-library/react';
import { MockedProvider } from '@apollo/react-testing';
import userEvent from '@testing-library/user-event';
import wait from 'waait';
import Checkout, { CREATE_ORDER_MUTATION } from '../components/Checkout';
import { CartStateProvider } from '../components/LocalState';
import { CURRENT_USER_QUERY } from '../components/User';

// Mock the Router
jest.mock('next/router', () => ({
  push: jest.fn(),
}));

// Mock Stripe js
jest.mock('@stripe/react-stripe-js', () => ({
  CardElement: ({ children }) => <div>{children}</div>,
  Elements: ({ children }) => <div>{children}</div>,
  useStripe: jest.fn().mockReturnValue({
    createPaymentMethod: jest
      .fn()
      .mockResolvedValue({ paymentMethod: 'abc123' }),
  }),
  useElements: jest.fn().mockReturnValue({
    getElement: jest.fn(),
  }),
}));

// Mock Stripe create Payment Method
const mockCreatePaymentMethod = jest.fn();

jest.mock('@stripe/stripe-js', () => ({
  loadStripe: () => ({ createPaymentMethod: mockCreatePaymentMethod }),
}));

const mocks = [
  {
    request: { query: CREATE_ORDER_MUTATION },
    result: {
      data: {
        checkout: { id: 'ord123' },
      },
    },
  },
  {
    request: { query: CURRENT_USER_QUERY },
    result: {},
  },
];

describe('<Checkout />', () => {
  it('renders and matches snappy', async () => {
    const { container } = render(
      <CartStateProvider>
        <MockedProvider>
          <Checkout />
        </MockedProvider>
      </CartStateProvider>
    );

    await screen.findByTestId('checkout');
    expect(container).toMatchSnapshot();
  });

  fit('submits the form properly', async () => {
    const { container } = render(
      <CartStateProvider>
        <MockedProvider mocks={mocks}>
          <Checkout />
        </MockedProvider>
      </CartStateProvider>
    );
    await screen.findByTestId('checkout');
    userEvent.click(screen.getByText(/Pay/i));
    await wait(1000);
    console.log(mockCreatePaymentMethod);
    expect(mockCreatePaymentMethod).toHaveBeenCalled();
  });
});
