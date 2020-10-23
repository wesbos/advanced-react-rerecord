import PropTypes from 'prop-types';
import { useMutation, useQuery } from '@apollo/client';
import gql from 'graphql-tag';
import Form from './styles/Form';
import Error from './ErrorMessage';
import useForm from '../lib/useForm';

const SINGLE_ITEM_QUERY = gql`
  query SINGLE_ITEM_QUERY($id: ID!) {
    Item(where: { id: $id }) {
      id
      name
      description
      price
    }
  }
`;
const UPDATE_ITEM_MUTATION = gql`
  mutation UPDATE_ITEM_MUTATION(
    $id: ID!
    $name: String
    $description: String
    $price: Int
  ) {
    updateItem(
      id: $id
      data: { name: $name, description: $description, price: $price }
    ) {
      id
      name
      description
      price
    }
  }
`;
function UpdateItem({ id }) {
  const { data = {}, loading } = useQuery(SINGLE_ITEM_QUERY, {
    variables: {
      id,
    },
  });
  console.log(data, loading)
  const { inputs, handleChange } = useForm(data.Item || { name:'', price:'', description: ''});
  console.log(inputs)
  const [updateItem, { loading: updating, error }] = useMutation(
    UPDATE_ITEM_MUTATION,
    {
      variables: {
        id,
        ...inputs,
      },
    }
  );
  if (loading) return <p>Loading...</p>;
  if (!data || !data.Item) return <p>No Item Found for ID {id}</p>;

  return (
    <Form
    onSubmit={async e => {
      e.preventDefault();
      const res = await updateItem();
      console.log(res);
      }}
      >
      <p>{data.Item.name}</p>
      <Error error={error} />
      <fieldset disabled={updating} aria-busy={updating}>
        <label htmlFor="name">
          Title
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
            placeholder="Enter A Description"
            required
            value={inputs.description}
            onChange={handleChange}
          />
        </label>
        <button type="submit">Sav{loading ? 'ing' : 'e'} Changes</button>
      </fieldset>
    </Form>
  );
}

UpdateItem.propTypes = {
  id: PropTypes.string.isRequired,
};

export default UpdateItem;
export { UPDATE_ITEM_MUTATION };
