import { render, screen, wait } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MockedProvider } from '@apollo/react-testing';
import Router from 'next/router';
import CreateItem, { CREATE_ITEM_MUTATION } from '../components/CreateItem';
import { fakeItem } from '../lib/testUtils';

jest.mock('next/router', () => ({
  push: jest.fn(),
}));

const item = fakeItem();
describe('<CreateItem/>', () => {
  it('renders and matches snapshot', async () => {
    const { container } = render(
      <MockedProvider>
        <CreateItem />
      </MockedProvider>
    );
    expect(container).toMatchSnapshot();
  });

  it('handles state updating', async () => {
    render(
      <MockedProvider>
        <CreateItem />
      </MockedProvider>
    );

    await userEvent.type(screen.getByPlaceholderText('Name'), item.name);
    await userEvent.type(
      screen.getByPlaceholderText('Price'),
      item.price.toString()
    );
    await userEvent.type(
      screen.getByPlaceholderText('Description'),
      item.description
    );

    expect(screen.getByDisplayValue(item.name)).toBeInTheDocument();
    expect(screen.getByDisplayValue(item.price.toString())).toBeInTheDocument();
    expect(screen.getByDisplayValue(item.description)).toBeInTheDocument();
    await wait();
  });
  it('creates an item when the form is submitted', async () => {
    const mocks = [
      {
        request: {
          query: CREATE_ITEM_MUTATION,
          variables: {
            name: item.name,
            description: item.description,
            image: '',
            price: item.price,
          },
        },
        result: {
          data: {
            createItem: {
              ...item,
              id: 'abc123',
              __typename: 'Item',
            },
          },
        },
      },
    ];

    const { container } = render(
      <MockedProvider mocks={mocks}>
        <CreateItem />
      </MockedProvider>
    );
    await userEvent.type(screen.getByPlaceholderText('Name'), item.name);
    await userEvent.type(
      screen.getByPlaceholderText('Price'),
      item.price.toString()
    );
    await userEvent.type(
      screen.getByPlaceholderText('Description'),
      item.description
    );
    // mock the router
    await userEvent.click(screen.getByText('Submit'));
    await wait();
    expect(Router.push).toHaveBeenCalled();
    expect(Router.push).toHaveBeenCalledWith({
      pathname: '/item',
      query: { id: 'abc123' },
    });
  });
});
