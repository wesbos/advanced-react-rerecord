import gql from 'graphql-tag';
import PropTypes from 'prop-types';
import { useQuery } from '@apollo/react-hooks';
import { useState, useEffect } from 'react';

const CURRENT_USER_QUERY = gql`
  query {
    authenticatedUser {
      id
      email
      name
      permissions
      # orders {
      #   id
      # }
      cart {
        id
        quantity
        item {
          id
          price
          image {
            publicUrlTransformed
          }
          name
          description
        }
      }
    }
  }
`;

function useUser() {
  const { data } = useQuery(CURRENT_USER_QUERY);
  if (data) {
    return data.authenticatedUser;
  }
}

export default <p>Hey</p>;
export { CURRENT_USER_QUERY, useUser };
