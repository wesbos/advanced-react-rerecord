import wait from 'waait';
import { MockedProvider } from '@apollo/react-testing';
import { ApolloConsumer } from '@apollo/client';
import { render } from '@testing-library/react';
import AddToCart, { ADD_TO_CART_MUTATION } from '../components/AddToCart';
import { CURRENT_USER_QUERY } from '../components/User';
import { fakeUser, fakeCartItem } from '../lib/testUtils';

const mocks = [
  {
    request: { query: CURRENT_USER_QUERY },
    result: {
      data: {
        authenticatedUser: {
          ...fakeUser(),
          cart: [],
        },
      },
    },
  },
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
  {
    request: { query: ADD_TO_CART_MUTATION, variables: { id: 'abc123' } },
    result: {
      data: {
        addToCart: {
          ...fakeCartItem(),
          quantity: 1,
        },
      },
    },
  },
];

describe('<AddToCart/>', () => {
  it('renders and matches the snap shot', async () => {
    const { container, debug } = render(
      <MockedProvider mocks={mocks}>
        <AddToCart id="abc123" />
      </MockedProvider>
    );
    expect(container).toMatchSnapshot();
  });

  fit('adds an item to cart when clicked', async () => {
    let apolloClient;
    const { container, debug } = render(
      <MockedProvider mocks={mocks}>
        <ApolloConsumer>
          {client => {
            apolloClient = client;
            return <AddToCart id="abc123" />;
          }}
        </ApolloConsumer>
      </MockedProvider>
    );
    await wait(1000);
    debug();
    const what = await apolloClient.query({ query: CURRENT_USER_QUERY });
    console.log(what);
    return;
    // console.log(me);
    expect(me.cart).toHaveLength(0);
    // add an item to the cart
    wrapper.find('button').simulate('click');
    await wait();
    // check if the item is in the cart
    const {
      data: { me: me2 },
    } = await apolloClient.query({ query: CURRENT_USER_QUERY });
    expect(me2.cart).toHaveLength(1);
    expect(me2.cart[0].id).toBe('omg123');
    expect(me2.cart[0].quantity).toBe(3);
  });

  it('changes from add to adding when clicked', async () => {
    const { container } = render(
      <MockedProvider mocks={mocks}>
        <AddToCart id="abc123" />
      </MockedProvider>
    );
    await wait();
    wrapper.update();
    expect(wrapper.text()).toContain('Add To Cart');
    wrapper.find('button').simulate('click');
    expect(wrapper.text()).toContain('Adding To Cart');
  });
});
