import withApollo from 'next-with-apollo';
import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { HttpLink } from 'apollo-link-http';
import { onError } from 'apollo-link-error';
import { ApolloLink } from 'apollo-link';
import { endpoint, prodEndpoint } from '../config';

function createClient({ headers, initialState }) {
  return new ApolloClient({
    link: ApolloLink.from([
      onError(({ graphQLErrors, networkError }) => {
        if (graphQLErrors)
          graphQLErrors.forEach(({ message, locations, path }) =>
            console.log(
              `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
            )
          );
        if (networkError) console.log(`[Network error]: ${networkError}`);
      }),
      new HttpLink({
        uri: process.env.NODE_ENV === 'development' ? endpoint : prodEndpoint,
        request: operation => {
          operation.setContext({
            fetchOptions: {
              credentials: 'include',
            },
            headers,
          });
        },
      }),
    ]),
    cache: new InMemoryCache().restore(initialState || {}),
  });
}

// function createClient({ headers, initialState }) {
//   return new ApolloClient({
//     uri: process.env.NODE_ENV === 'development' ? endpoint : prodEndpoint,
//     cache: new InMemoryCache().restore(initialState || {}),
//     request: operation => {
//       operation.setContext({
//         fetchOptions: {
//           credentials: 'include',
//         },
//         headers,
//       });
//     },
//   });
// }

export default withApollo(createClient);
// export default createClient;
