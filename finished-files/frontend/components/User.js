import gql from 'graphql-tag';
import { useQuery } from '@apollo/client';

const CURRENT_USER_QUERY = gql`
  query {
    authenticatedItem {
      ... on User {
        id
        email
        name
        cart {
          id
          quantity
          product {
            id
            price
            photo {
              image {
                publicUrlTransformed
              }
            }
            name
            description
          }
        }
      }
    }
  }
`;

function useUser() {
  const { data, loading, error } = useQuery(CURRENT_USER_QUERY);
  return data?.authenticatedItem;
}

export { CURRENT_USER_QUERY, useUser };
