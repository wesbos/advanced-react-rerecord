import stripe from './stripe';

export async function addToCart(parent, args, ctx, info, { query }) {
  // 1. Make sure they are signed in
  const { id: userId } = ctx.authedItem;
  if (!userId) {
    throw new Error('You must be signed in soooon');
  }
  // 2. Query the users current cart
  const {
    data: { allCartItems },
  } = await query(`
    query {
      allCartItems(where: {
          user: { id: "${userId}" },
          item: { id: "${args.id}" },
      }) {
        id
        quantity
      }
    }
  `);

  const [existingCartItem] = allCartItems;

  // 3. Check if that item is already in their cart and increment by 1 if it is
  if (existingCartItem) {
    console.log(
      `There are already ${existingCartItem.quantity} if these items in their cart`
    );
    const res = await query(
      `
      mutation {
        updateCartItem(
          id: "${existingCartItem.id}",
          data: { quantity: ${existingCartItem.quantity + 1}}
        ) {
          id
          quantity
        }
      }
    `,
      { context: ctx }
    );
    return res.data.updateCartItem;
  }
  // 4. If its not, create a fresh CartItem for that user!
  // TODO Can we get highlighting here?
  // TODO Change this to proper GraphQL variables
  // TODO How do we pass `info.fields` to this query? there needs to be something easy..
  // TODO this breaks if we query the user { id }
  const CREATE_CART_ITEM_MUTATION = `
    mutation {
      createCartItem(data: {
        item: { connect: { id: "${args.id}" }},
        user: { connect: { id: "${userId}" }}
      }) {
        id
        quantity
      }
    }
  `;
  const res = await query(CREATE_CART_ITEM_MUTATION, {
    context: ctx,
  });
  return res.data.createCartItem;
}

export async function checkout(parent, args, ctx, info, { query }) {
  // 1. Query the current user and make sure they are signed in
  const { id: userId } = ctx.authedItem;
  if (!userId) throw new Error('You must be signed in to complete this order.');
  console.log(userId);

  const {
    data: { User },
  } = await query(`
    query {
      User(where: { id: "5de9a29642ca551f24c596ba" }) {
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
  // 3. Create the stripe charge (turn token into $$$)
  const charge = await stripe.charges.create({
    amount,
    currency: 'USD',
    source: args.token,
  });
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
  console.log(deleteResponse);
  // 7. Return the Order to the client
  return order.data.createOrder;
}
