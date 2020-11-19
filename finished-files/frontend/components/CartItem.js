import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import formatMoney from '../lib/formatMoney';
import RemoveFromCart from './RemoveFromCart';

const CartItemStyles = styled.li`
  padding: 1rem 0;
  border-bottom: 1px solid ${props => props.theme.lightgrey};
  display: grid;
  align-items: center;
  grid-template-columns: auto 1fr auto;
  img {
    margin-right: 10px;
  }
  h3,
  p {
    margin: 0;
  }
`;

function CartItem({ cartItem }) {
  const product = cartItem.product;
  // first check if that item exists
  if (!product)
    return (
      <CartItemStyles>
        <p>This Item has been removed</p>
        <RemoveFromCart id={cartItem.id} />
      </CartItemStyles>
    );
  return (
    <CartItemStyles>
      <img
        width="100"
        src={product.photo.image.publicUrlTransformed}
        alt={product.name}
      />
      <div className="cart-item-details">
        <h3>{product.name}</h3>
        <p>
          {formatMoney(product.price * cartItem.quantity)}
          {' - '}
          <em>
            {cartItem.quantity} &times; {formatMoney(product.price)} each
          </em>
        </p>
      </div>
      <RemoveFromCart id={cartItem.id} />
    </CartItemStyles>
  );
};

CartItem.propTypes = {
  cartItem: PropTypes.object.isRequired,
};

export default CartItem;
