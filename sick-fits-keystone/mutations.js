exports.addToCart = async function addToCart(parent, args, ctx, info) {
  const { keystone } = require('./index');

  // 1. Make sure they are signed in
  const { id: userId } = ctx.authedItem;
  if (!userId) {
    throw new Error('You must be signed in soooon');
  }
  // 2. Query the users current cart
  const {
    data: { allCartItems },
  } = await keystone.executeQuery(`
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
    const res = await keystone.executeQuery(`
      mutation {
        updateCartItem(
          id: "${existingCartItem.id}",
          data: { quantity: ${existingCartItem.quantity + 1}}
        ) {
          id
          quantity
        }
      }
    `);
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
  const res = await keystone.executeQuery(CREATE_CART_ITEM_MUTATION, {
    context: ctx,
  });
  return res.data.createCartItem;
};
