import { useCart } from './LocalState';
import { useUser } from './User';
import CartStyles from './styles/CartStyles';
import Supreme from './styles/Supreme';
import CloseButton from './styles/CloseButton';
import CartItem from './CartItem';
import calcTotalPrice from '../lib/calcTotalPrice';
import formatMoney from '../lib/formatMoney';
import Checkout from './Checkout';

function Cart() {
  const me = useUser();
  const { cartOpen, toggleCart, cart } = useCart();
  if (!me) return <p>not logged in</p>;
  return (
    <CartStyles open={cartOpen} data-testid="cart">
      <header>
        <CloseButton onClick={toggleCart} title="close">
          &times;
        </CloseButton>
        <Supreme>{me.username}'s Cart</Supreme>
        <p>
          You Have {cart.length} Item{cart.length === 1 ? '' : 's'} in
          your cart.
        </p>
      </header>
      <ul>
        {cart.map(cartItem => (
          <CartItem key={cartItem.id} cartItem={cartItem} />
        ))}
      </ul>
      {cart.length > 0 && (
        <footer>
          <p>{formatMoney(calcTotalPrice(cart))}</p>
          <Checkout />
        </footer>
      )}
    </CartStyles>
  );
}

export default Cart;
