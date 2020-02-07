import { render, screen } from '@testing-library/react';
import { MockedProvider } from '@apollo/react-testing';
import userEvent from '@testing-library/user-event';
import { Router } from 'next/router';

// import { loadStripe } from '@stripe/stripe-js';
import Checkout from '../components/Checkout';
import { CartStateProvider } from '../components/LocalState';

const createPaymentMethod = jest.fn();
jest.mock('@stripe/stripe-js', () => ({
  loadStripe: () => ({
    createPaymentMethod: jest.fn(),
  }),
}));
// jest.mock('@stripe/react-stripe-js').mockReturnValue({
//   CardElement: <div>Card Element</div>,
//   Elements: jest.fn(),
//   useStripe: jest.fn(),
//   useElements: jest.fn(),
// });

// window.stripe = {
//   createPaymentMethod,
// };

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
    Router.router = { push: jest.fn() };
    const { container } = render(
      <CartStateProvider>
        <MockedProvider>
          <Checkout />
        </MockedProvider>
      </CartStateProvider>
    );

    await screen.findByTestId('checkout');
    userEvent.click(screen.getByText(/Pay/i));
    expect(createPaymentMethod).toHaveBeenCalled();
  });
});
