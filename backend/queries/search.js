export async function search(parent, args, ctx, info, { query }) {
  // now we turn this into a query
  console.log(info);
  const q = `
  query search() {
    allItems(${JSON.stringify(args)}) {
      price
      name
    }
  }
  `;
  console.log(q);
  const { data } = await query(q);
  console.log(data);

  return data;
}
