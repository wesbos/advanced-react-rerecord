exports.addToCart = async function addToCart(
  parent,
  args,
  ctx,
  info,
  { query }
) {
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
};

exports.createOrder = async function addToCart(
  parent,
  args,
  ctx,
  info,
  { query }
) {
  // 1. Query the current user and make sure they are signed in
  const { userId } = ctx.request;
  if (!userId) throw new Error('You must be signed in to complete this order.');
  const user = await ctx.db.query.user(
    { where: { id: userId } },
    `{
      id
      name
      email
      cart {
        id
        quantity
        item { title price id description image largeImage }
      }}`
  );
  // 2. recalculate the total for the price
  const amount = user.cart.reduce(
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
  // 4. Convert the CartItems to OrderItems
  const orderItems = user.cart.map(cartItem => {
    const orderItem = {
      ...cartItem.item,
      quantity: cartItem.quantity,
      user: { connect: { id: userId } },
    };
    delete orderItem.id;
    return orderItem;
  });

  // 5. create the Order
  const order = await ctx.db.mutation.createOrder({
    data: {
      total: charge.amount,
      charge: charge.id,
      items: { create: orderItems },
      user: { connect: { id: userId } },
    },
  });
  // 6. Clean up - clear the users cart, delete cartItems
  const cartItemIds = user.cart.map(cartItem => cartItem.id);
  await ctx.db.mutation.deleteManyCartItems({
    where: {
      id_in: cartItemIds,
    },
  });
  // 7. Return the Order to the client
  return order;
},
};
