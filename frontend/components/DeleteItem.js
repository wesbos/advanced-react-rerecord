import React, { Component } from 'react';
import { useMutation } from '@apollo/client';
import gql from 'graphql-tag';
import { ALL_ITEMS_QUERY } from './Items';

const DELETE_ITEM_MUTATION = gql`
  mutation DELETE_ITEM_MUTATION($id: ID!) {
    deleteItem(id: $id) {
      id
    }
  }
`;

// TODO: Update the cache in Apollo 3
const update = () => {
  console.log('You didnt write this code yet');
};
// update = (cache, payload) => {
//   // manually update the cache on the client, so it matches the server
//   // 1. Read the cache for the items we want
//   const data = cache.readQuery({ query: ALL_ITEMS_QUERY });
//   console.log(data, payload);
//   // 2. Filter the deleted itemout of the page
//   data.items = data.items.filter(
//     item => item.id !== payload.data.deleteItem.id
//   );
//   // 3. Put the items back!
//   cache.writeQuery({ query: ALL_ITEMS_QUERY, data });
// };

function DeleteItem({ id, children }) {
  const [deleteItem, { error }] = useMutation(DELETE_ITEM_MUTATION, {
    variables: { id },
    update,
  });
  return (
    <button
      type="button"
      onClick={() => {
        if (confirm('Are you sure you want to delete this item?')) {
          deleteItem().catch(err => {
            alert(err.message);
          });
        }
      }}
    >
      {children}
    </button>
  );
}

export default DeleteItem;
