import React, { Component } from 'react';
import gql from 'graphql-tag';
import { useQuery } from '@apollo/client';
import styled from 'styled-components';
import Head from 'next/head';
import Error from './ErrorMessage';

const SingleProductStyles = styled.div`
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

const SINGLE_PRODUCT_QUERY = gql`
  query SINGLE_PRODUCT_QUERY($id: ID!) {
    Product(where: { id: $id }) {
      id
      name
      description
      photo {
        image {
          publicUrlTransformed
        }
      }
    }
  }
`;

function SingleProduct({ id }) {
  const { loading, error, data } = useQuery(SINGLE_PRODUCT_QUERY, {
    variables: { id },
  });
  if (error) return <Error error={error} />;
  if (loading) return <p>Loading...</p>;
  if (!data?.Product) return <p>No Item Found for {id}</p>;
  const { Product } = data;
  return (
    <SingleProductStyles data-testid="singleProduct">
      <Head>
        <title>Sick Fits | {Product.name}</title>
      </Head>
      <img src={Product.photo.image.publicUrlTransformed} alt={Product.name} />
      <div className="details">
        <h2>Viewing {Product.name}</h2>
        <p>{Product.description}</p>
      </div>
    </SingleProductStyles>
  );
}

export default SingleProduct;
export { SINGLE_PRODUCT_QUERY };
