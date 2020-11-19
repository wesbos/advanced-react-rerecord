import React from 'react';
import gql from 'graphql-tag';
import { Query, useQuery } from '@apollo/client';

import Head from 'next/head';
import Link from 'next/link';
import PaginationStyles from './styles/PaginationStyles';
import { perPage } from '../config';
import Error from './ErrorMessage';

const PAGINATION_QUERY = gql`
  query PAGINATION_QUERY {
    _allProductsMeta {
      count
    }
  }
`;

function Pagination({ page }) {
  const { error, loading, data } = useQuery(PAGINATION_QUERY);
  if (loading) return <p>Loading...</p>;
  if (error) return <Error error={error} />;
  const { count } = data._allProductsMeta;
  const pages = Math.ceil(count / perPage);
  return (
    <PaginationStyles data-testid="pagination">
      <Head>
        <title>
          Sick Fits! — Page {page} of {pages}
        </title>
      </Head>
      <Link
        href={{
          pathname: `/products/${page - 1}`
        }}
      >
        <a className="prev" aria-disabled={page <= 1}>
          ← Prev
        </a>
      </Link>
      <p>
        Page {page} of{' '}
        <span className="totalPages" data-testid="totalPages">
          {pages}
        </span>
      </p>
      <p>{count} Items Total</p>
      <Link
        href={{
          pathname: `/products/${page + 1}`
        }}
      >
        <a className="next" aria-disabled={page >= pages}>
          Next →
        </a>
      </Link>
    </PaginationStyles>
  );
}

export default Pagination;
export { PAGINATION_QUERY };
