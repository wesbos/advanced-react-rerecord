import stripe from '../src/stripe';

export async function checkout(parent, args, ctx, info, { query }) {
  // 1. Query the current user and make sure they are signed in
  const { id: userId } = ctx.authedItem;
  if (!userId) throw new Error('You must be signed in to complete this order.');

  const {
    data: { User },
  } = await query(`
    query {
      User(where: { id: "${userId}" }) {
        id
        name
        email
        cart {
          id
          quantity
          item { name price id description image { publicUrlTransformed } }
        }
      }
    }
  `);
  // 2. recalculate the total for the price
  const amount = User.cart.reduce(
    (tally, cartItem) => tally + cartItem.item.price * cartItem.quantity,
    0
  );
  console.log(`Going to charge for a total of ${amount}`);

  // 3. Create the Payment Intent, given the Payment Method ID
  // by passing confirm: true, We do stripe.paymentIntent.create() and stripe.paymentIntent.confirm() in 1 go.
  const charge = await stripe.paymentIntents.create({
    amount,
    currency: 'USD',
    confirm: true,
    payment_method: args.token,
  });
  console.log(charge);

  // console.log(charge);
  // 4. Convert the CartItems to OrderItems
  const orderItems = User.cart.map(cartItem => {
    const orderItem = {
      ...cartItem.item,
      quantity: cartItem.quantity,
      // TODO is this line needed?
      user: { connect: { id: userId } },
      image: cartItem.item.image.publicUrlTransformed,
    };
    delete orderItem.id;
    delete orderItem.user;
    return orderItem;
  });

  // 5. create the Order
  console.log('Creating the order');
  const order = await query(
    `
      mutation createOrder($orderItems: [OrderItemCreateInput]) {
        createOrder(
          data: {
            total: ${charge.amount},
            charge: "${charge.id}",
            items: { create: $orderItems },
            user: { connect: { id: "${userId}" } },
          }
          ) {
            id
          }
        }
        `,
    { variables: { orderItems } }
  );

  // 6. Clean up - clear the users cart, delete cartItems
  const cartItemIds = User.cart.map(cartItem => cartItem.id);
  console.log(cartItemIds);
  const deleteResponse = await query(
    `
    mutation deleteCartItems($ids: [ID!]) {
      deleteCartItems(ids: $ids) {
        id
      }
    }
  `,
    { variables: { ids: cartItemIds } }
  );
  // 7. Return the Order to the client
  return order.data.createOrder;
}
