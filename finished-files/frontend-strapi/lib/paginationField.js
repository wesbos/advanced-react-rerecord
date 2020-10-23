// Buckle up folks

// We're gonna write one hell of a pagination logic

export default function paginationField() {
  return {
    keyArgs: false, // take full control of this field

    // 1. We write custom functions to merge and read based on the 'first' and 'skip' args
    // first = 4 items per page
    // skip = how many items to offset

    // 2. When we fire off a query, Apollo will check the cache first. Normally Apollo handles this, but we now control that with a read method
    read(existing = [], { args, readField }) {
      const { skip, first } = args;
      const { count } = readField('_allItemsMeta');
      const page = skip / first + 1;
      const pages = Math.ceil(count / first);
      console.log('reading...', { args });
      // 3. See if we have the items we want in the existing cache
      const items = existing
        .slice(skip, skip + first)
        // we filter for empty spots because its likely we have padded spots with nothing in them. IE Someone visits page 3 directly, spots 1-8 will be empty
        .filter(x => x);
      // 4. Account for the last page, where there is incomplete data but we dont have any more so we just send it
      if (items.length && items.length !== args.first && page === pages) {
        console.log(
          `We don't have ${first} items, but it's the last page so we're just gonna send it!`
        );
        return items;
      }
      // 5. If there are enough items, return them.
      // It's possible that we only have 3 of the 4 items because we deleted something on the previous page, so if that is the case we need to go to the network
      if (items.length !== args.first) {
        // TODO: This breaks the last page where we might only have a few items....
        console.log(
          `We only have ${items.length} and we want ${args.first} so we're going to the network to fetch them`
        );
        return; // return undefined so it hits the network
      }
      // 6. If there are items, return them.
      if (items.length) {
        console.log(
          `We have ${items.length} items! Gonna serve them from the cache`
        );
        return items;
      }
      // 7. Otherwise this function returns undefined and it will hit the network for the items, and call merge() for us
      console.log('No items! Requesting from network');
    },

    // 8. When items come back from the network, we need to merge them into our cache. We get the existing cache and the new incoming items. It's our job to merge them
    merge(existing, incoming, { args }) {
      const { skip, first } = args;
      console.log('merging items from network...');
      // 9. Take a copy of the existing array, or make a new empty one
      const merged = existing ? existing.slice(0) : [];
      // 10. Insert the items into our array at the spot which they belong.
      // we do it this way because someone might visit page 2 first, so we need to pad blank spots in the array
      for (let i = skip; i < skip + incoming.length; ++i) {
        merged[i] = incoming[i - skip];
      }
      // 11. finally we are done, return the merged array, which will then call read() once more. But this item we have items, so read() will be able to serve them up from the cache
      return merged;
    },
  };
}

// 12. You rock! Pheww!
