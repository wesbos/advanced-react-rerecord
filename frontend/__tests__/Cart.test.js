import { render } from '@testing-library/react';
import { MockedProvider } from '@apollo/react-testing';
import wait from 'waait';
import Cart from '../components/Cart';
import { CURRENT_USER_QUERY } from '../components/User';
import { fakeUser, fakeCartItem } from '../lib/testUtils';
import { CartStateProvider } from '../components/LocalState';

const mocks = [
  {
    request: { query: CURRENT_USER_QUERY },
    result: {
      data: {
        authenticatedUser: {
          ...fakeUser(),
          cart: [fakeCartItem()],
        },
      },
    },
  },
];

describe('<Cart/>', () => {
  it('renders and matches snappy', async () => {
    const { container, debug, findByTestId } = render(
      <CartStateProvider>
        <MockedProvider mocks={mocks}>
          <Cart />
        </MockedProvider>
      </CartStateProvider>
    );
    debug();
    await findByTestId('cart');

    // expect(toJSON(wrapper.find('header'))).toMatchSnapshot();
    // expect(wrapper.find('CartItem')).toHaveLength(1);
  });
});
