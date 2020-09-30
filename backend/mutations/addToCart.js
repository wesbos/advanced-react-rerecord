const { gql } = require('apollo-server-express');

export async function addToCart(parent, args, ctx, info) {
  // 1. Make sure they are signed in
  const { id: userId } = ctx.authedItem;
  if (!userId) {
    throw new Error('You must be signed in soooon');
  }
  // 2. Query the users current cart, to see if they already have that item
  const { data: { allCartItems }, errors } = await ctx.executeGraphQL({
    context: ctx,
    query: gql`query {
      allCartItems(where: {
          user: { id: "${userId}" },
          item: { id: "${args.id}" },
      }) {
        id
        quantity
      }
    }`
  });

  // const {
  //   data: { allCartItems },
  // } = await query(`
  //   query {
  //     allCartItems(where: {
  //         user: { id: "${userId}" },
  //         item: { id: "${args.id}" },
  //     }) {
  //       id
  //       quantity
  //     }
  //   }
  // `);

  const [existingCartItem] = allCartItems;

  // 3. Check if that item is already in their cart and increment by 1 if it is
  if (existingCartItem) {
    console.log(
      `There are already ${existingCartItem.quantity} of these items in their cart`
    );
    const res = await ctx.executeGraphQL({
      context: ctx,
      query: gql`
      mutation {
        updateCartItem(
          id: "${existingCartItem.id}",
          data: { quantity: ${existingCartItem.quantity + 1}}
        ) {
          id
          quantity
        }
      }
    `
    });
    return res.data.updateCartItem;
  }
  // 4. If its not, create a fresh CartItem for that user!
  const CREATE_CART_ITEM_MUTATION = gql`
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
  const res = await ctx.executeGraphQL({
    query: CREATE_CART_ITEM_MUTATION,
    context: ctx
  });
  return res.data.createCartItem;
}
