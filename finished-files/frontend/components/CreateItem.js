import React from 'react';
import { useMutation } from '@apollo/client';
import gql from 'graphql-tag';
import Router from 'next/router';
import useForm from '../lib/useForm';
import Form from './styles/Form';
import Error from './ErrorMessage';
import { ALL_ITEMS_QUERY } from './Items';
import { PAGINATION_QUERY } from './Pagination';

const CREATE_ITEM_MUTATION = gql`
  mutation CREATE_ITEM_MUTATION(
    $name: String!
    $description: String!
    $price: Int!
    $image: Upload
  ) {
    createItem(
      data: {
        name: $name
        description: $description
        price: $price
        image: $image
      }
    ) {
      id
      name
      price
      description
      image {
        publicUrlTransformed
      }
    }
  }
`;

function update(cache, payload) {
  cache.modify({
    id: cache.identify(payload.data.createItem),
    fields: {
      allItems(items, { readField }) {
        return [payload.data.createItem, ...items];
      },
    }
  });
}

function CreateItem() {
  const { inputs, handleChange } = useForm({
    name: 'Nice Shoes',
    description: 'soo nice',
    image: '',
    price: 500,
  });
  const [createItem, { loading, error }] = useMutation(CREATE_ITEM_MUTATION, {
    variables: inputs,
    // update,
    refetchQueries: [{ query: ALL_ITEMS_QUERY }, { query: PAGINATION_QUERY }],
  });

  return (
    <Form
      data-testid="form"
      onSubmit={async e => {
        // Stop the form from submitting
        e.preventDefault();
        // call the mutation
        const res = await createItem();
        console.log(res);
        // change them to the single item page
        Router.push({
          pathname: '/item',
          query: { id: res.data.createItem.id },
        });
      }}
    >
      <Error error={error} />
      <fieldset disabled={loading} aria-busy={loading}>
        <label htmlFor="file">
          Image
          <input
            type="file"
            id="file"
            name="image"
            placeholder="Upload an image"
            required
            onChange={handleChange}
          />
        </label>

        <label htmlFor="name">
          Name
          <input
            type="text"
            id="name"
            name="name"
            placeholder="Name"
            required
            value={inputs.name}
            onChange={handleChange}
          />
        </label>

        <label htmlFor="price">
          Price
          <input
            type="number"
            id="price"
            name="price"
            placeholder="Price"
            required
            value={inputs.price}
            onChange={handleChange}
          />
        </label>

        <label htmlFor="description">
          Description
          <textarea
            id="description"
            name="description"
            placeholder="Description"
            required
            value={inputs.description}
            onChange={handleChange}
          />
        </label>
        <button type="submit">Submit</button>
      </fieldset>
    </Form>
  );
}

export default CreateItem;
export { CREATE_ITEM_MUTATION };
