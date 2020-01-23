export default function paginationField() {
  return {
    keyArgs: false, // take full control of this field
    // We write custom functions to merge and read based on the 'first' and 'skip' args
    // first = 4 items per page
    // skip = how many items to offset
    merge(existing, incoming, { args }) {
      const { skip, first } = args;
      console.log('merging...', { first, skip, existing, incoming });

      const merged = existing ? existing.slice(0) : [];
      // we do it this way because someone might visit page 2 first, so we need to pad blank spots in the array
      for (let i = skip; i < skip + incoming.length; ++i) {
        merged[i] = incoming[i - skip];
      }
      return merged;
    },
    read(existing = [], { args }) {
      // When we fire off a query, Apollo will check the cache first. We control that with a read method
      const { skip, first } = args;
      console.log('reading...', { args });
      console.log(existing);
      // See if we have the items we want
      const items = existing
        .slice(args.skip, args.skip + args.first)
        // we filter for empty spots because its likely we have padded spots with nothing in them.
        .filter(x => x);
      // If there are items, and they aren't blank spots, return them.
      if (items.length) {
        console.log('We have items! Gonna serve them from the cache', {
          items,
        });
        return items;
      }
      // Otherwise this function returns undefined and it will hit the network for the items, and call merge() for us
    },
  };
}
