import React from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import Title from './styles/Title';
import ItemStyles from './styles/ItemStyles';
import PriceTag from './styles/PriceTag';
import formatMoney from '../lib/formatMoney';
import DeleteItem from './DeleteItem';
import AddToCart from './AddToCart';

export default function Item({ item: product }) {
  return (
    <ItemStyles>
      {product.photo?.image?.publicUrlTransformed && (
        <img src={product.photo.image.publicUrlTransformed} alt={product.name} />
      )}

      <Title>
        <Link
          href={{
            pathname: `/product/${product.id}`
          }}
        >
          <a>{product.name}</a>
        </Link>
      </Title>
      <PriceTag>{formatMoney(product.price)}</PriceTag>
      <p>{product.description}</p>

      <div className="buttonList">
        <Link
          href={{
            pathname: 'update',
            query: { id: product.id },
          }}
        >
          <a>Edit ✏️</a>
        </Link>
        <AddToCart id={product.id} />
        <DeleteItem id={product.id}>Delete This Item</DeleteItem>
      </div>
    </ItemStyles>
  );
}

Item.propTypes = {
  item: PropTypes.object.isRequired,
};
