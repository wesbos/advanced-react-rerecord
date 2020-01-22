import withApollo from 'next-with-apollo';
import { ApolloClient, InMemoryCache, ApolloLink } from '@apollo/client';
// TODO: onError for Apollo 3?
import { onError } from 'apollo-link-error';
import { createUploadLink } from 'apollo-upload-client';
import { getDataFromTree } from '@apollo/react-ssr';
import { endpoint, prodEndpoint } from '../config';

function createClient({ headers, initialState }) {
  console.log('initialState');
  console.log(initialState);
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
      // this uses apollo-link-http under the hood, so all the options here come from that package
      createUploadLink({
        uri: process.env.NODE_ENV === 'development' ? endpoint : prodEndpoint,
        fetchOptions: {
          credentials: 'include',
        },
        // pass the headers along from this request. This enables SSR with logged in state
        headers,
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

export default withApollo(createClient, { getDataFromTree });
// export default createClient;
