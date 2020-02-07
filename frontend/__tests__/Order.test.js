import { render, screen } from '@testing-library/react';
import wait from 'waait';
import { MockedProvider } from '@apollo/react-testing';
import Order, { SINGLE_ORDER_QUERY } from '../components/Order';
import { fakeOrder } from '../lib/testUtils';

const mocks = [
  {
    request: { query: SINGLE_ORDER_QUERY, variables: { id: 'ord123' } },
    result: { data: { Order: fakeOrder() } },
  },
];

describe('<Order/>', () => {
  it('renders the order', async () => {
    const { container } = render(
      <MockedProvider mocks={mocks}>
        <Order id="ord123" />
      </MockedProvider>
    );
    await screen.findByTestId('order');
    expect(container).toMatchSnapshot();
  });
});
