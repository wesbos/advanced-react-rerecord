import React, { Component } from 'react';
import gql from 'graphql-tag';
import { useQuery } from '@apollo/client';
import styled from 'styled-components';
import Head from 'next/head';
import Error from './ErrorMessage';

const SingleItemStyles = styled.div`
  max-width: 1200px;
  margin: 2rem auto;
  box-shadow: ${props => props.theme.bs};
  display: grid;
  grid-auto-columns: 1fr;
  grid-auto-flow: column;
  min-height: 800px;
  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
  .details {
    margin: 3rem;
    font-size: 2rem;
  }
`;

const SINGLE_ITEM_QUERY = gql`
  query SINGLE_ITEM_QUERY($id: ID!) {
    Item(where: { id: $id }) {
      id
      name
      description
      image {
        publicUrlTransformed
      }
    }
  }
`;

function SingleItem({ id }) {
  const { loading, error, data } = useQuery(SINGLE_ITEM_QUERY, {
    variables: { id },
  });
  if (error) return <Error error={error} />;
  if (loading) return <p>Loading...</p>;
  if (!data.Item) return <p>No Item Found for {id}</p>;
  const { Item } = data;
  return (
    <SingleItemStyles>
      <Head>
        <title>Sick Fits | {Item.name}</title>
      </Head>
      <img src={Item.image.publicUrlTransformed} alt={Item.name} />
      <div className="details">
        <h2>Viewing {Item.name}</h2>
        <p>{Item.description}</p>
      </div>
    </SingleItemStyles>
  );
}

export default SingleItem;
export { SINGLE_ITEM_QUERY };
