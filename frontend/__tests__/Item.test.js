import { render } from '@testing-library/react';
import ItemComponent from '../components/Item';

const fakeItem = {
  id: 'ABC123',
  title: 'A Cool Item',
  price: 4000,
  description: 'This item is really cool!',
  image: 'dog.jpg',
  largeImage: 'largedog.jpg',
};

describe('<Item/>', () => {
  fit('renders and matches the snapshot', () => {
    const { container } = render(<ItemComponent item={fakeItem} />);
    expect(container).toMatchSnapshot();
  });

  it('renders the image properly', () => {
    const { container } = shallow(<ItemComponent item={fakeItem} />);
    const img = container.find('img');
    expect(img.props().src).toBe(fakeItem.image);
    expect(img.props().alt).toBe(fakeItem.title);
  });

  it('renders the pricetag and title', () => {
    const { container } = shallow(<ItemComponent item={fakeItem} />);
    const PriceTag = container.find('PriceTag');
    expect(PriceTag.children().text()).toBe('$40');
    expect(container.find('Title a').text()).toBe(fakeItem.title);
  });

  it('renders out the buttons properly', () => {
    const { container } = shallow(<ItemComponent item={fakeItem} />);
    const buttonList = container.find('.buttonList');
    expect(buttonList.children()).toHaveLength(3);
    expect(buttonList.find('Link')).toHaveLength(1);
    expect(buttonList.find('AddToCart').exists()).toBe(true);
    expect(buttonList.find('DeleteItem').exists()).toBe(true);
  });
});
