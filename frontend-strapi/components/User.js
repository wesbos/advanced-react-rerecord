import gql from 'graphql-tag';
import PropTypes from 'prop-types';
import { useQuery } from '@apollo/client';
import { useState, useEffect } from 'react';

const CURRENT_USER_QUERY = gql`
  query {
    me {
      id
      email
      username
    }
  }
`;

function useUser() {
  const { data, loading, error } = useQuery(CURRENT_USER_QUERY);
  if (data) {
    return data.me;
  }
  if(error) {
    console.log(error)
  }
}

export { CURRENT_USER_QUERY, useUser };
