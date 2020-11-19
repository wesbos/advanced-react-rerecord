import React from 'react';
import { useMutation } from '@apollo/client';
import gql from 'graphql-tag';
import { ALL_PRODUCTS_QUERY } from './Products';
import { PAGINATION_QUERY } from './Pagination';

const DELETE_ITEM_MUTATION = gql`
  mutation DELETE_ITEM_MUTATION($id: ID!) {
    deleteItem(id: $id) {
      id
    }
  }
`;

function update(cache, payload) {
  cache.evict(cache.identify(payload.data.deleteItem));
}

function DeleteItem({ id, children }) {
  const [deleteItem, { error }] = useMutation(DELETE_ITEM_MUTATION, {
    variables: { id },
    update,
    // awaitRefetchQueries: true,
    // refetchQueries: [{ query: ALL_PRODUCTS_QUERY }, { query: PAGINATION_QUERY }],
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
