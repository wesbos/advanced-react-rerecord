import React from 'react';
import Downshift, { resetIdCounter } from 'downshift';
import { useRouter } from 'next/router';
import { useLazyQuery } from '@apollo/client';

import gql from 'graphql-tag';
import debounce from 'lodash.debounce';
import { DropDown, DropDownItem, SearchStyles } from './styles/DropDown';

const SEARCH_ITEMS_QUERY = gql`
  query SEARCH_ITEMS_QUERY($searchTerm: String!) {
    allItems(
      where: {
        OR: [
          { name_contains_i: $searchTerm }
          { description_contains_i: $searchTerm }
        ]
      }
    ) {
      id
      image {
        publicUrlTransformed
      }
      name
    }
  }
`;

function routeToItem(item) {
  const router = useRouter();
  router.push({
    pathname: '/item',
    query: {
      id: item.id,
    },
  });
}

function AutoComplete(props) {
  const [findItems, { loading, data }] = useLazyQuery(SEARCH_ITEMS_QUERY);
  const items = data ? data.allItems : [];
  const findItemsButChill = debounce(findItems, 350);
  resetIdCounter();
  return (
    <SearchStyles>
      <Downshift
        onChange={routeToItem}
        itemToString={item => (item === null ? '' : item.name)}
      >
        {({
          getInputProps,
          getItemProps,
          isOpen,
          inputValue,
          highlightedIndex,
        }) => (
          <div>
            <input
              {...getInputProps({
                type: 'search',
                placeholder: 'Search For An Item',
                id: 'search',
                className: loading ? 'loading' : '',
                onChange: e => {
                  e.persist();
                  findItemsButChill({
                    variables: { searchTerm: e.target.value },
                  });
                },
              })}
            />

            {isOpen && (
              <DropDown>
                {items.map((item, index) => (
                  <DropDownItem
                    {...getItemProps({ item })}
                    key={item.id}
                    highlighted={index === highlightedIndex}
                  >
                    <img
                      width="50"
                      src={item.image.publicUrlTransformed}
                      alt={item.name}
                    />
                    {item.name}
                  </DropDownItem>
                ))}
                {!items.length && !loading && (
                  <DropDownItem> Nothing Found {inputValue}</DropDownItem>
                )}
              </DropDown>
            )}
          </div>
        )}
      </Downshift>
    </SearchStyles>
  );
}

// class AutoCompleteOld extends React.Component {
//   state = {
//     items: [],
//     loading: false,
//   };

//   onChange = debounce(async (e, client) => {
//     console.log('Searching...');
//     // turn loading on
//     this.setState({ loading: true });
//     // Manually query apollo client
//     const res = await client.query({
//       query: SEARCH_ITEMS_QUERY,
//       variables: { searchTerm: e.target.value },
//     });
//     console.log(res);
//     this.setState({
//       items: res.data.allItems,
//       loading: false,
//     });
//   }, 350);

//   render() {
//     resetIdCounter();
//     const [findItems, { error, loading }] = useLazyQuery(SEARCH_ITEMS_QUERY);
//     return (
//       <SearchStyles>
//         <Downshift
//           onChange={routeToItem}
//           itemToString={item => (item === null ? '' : item.name)}
//         >
//           {({
//             getInputProps,
//             getItemProps,
//             isOpen,
//             inputValue,
//             highlightedIndex,
//           }) => (
//             <div>
//               <input
//                 {...getInputProps({
//                   type: 'search',
//                   placeholder: 'Search For An Item',
//                   id: 'search',
//                   className: loading ? 'loading' : '',
//                   onChange: e => {
//                     e.persist();
//                     console.log(e);
//                     // this.onChange(e, client);
//                   },
//                 })}
//               />

//               {isOpen && (
//                 <DropDown>
//                   {this.state.items.map((item, index) => (
//                     <DropDownItem
//                       {...getItemProps({ item })}
//                       key={item.id}
//                       highlighted={index === highlightedIndex}
//                     >
//                       <img
//                         width="50"
//                         src={item.image.publicUrlTransformed}
//                         alt={item.name}
//                       />
//                       {item.name}
//                     </DropDownItem>
//                   ))}
//                   {!this.state.items.length && !this.state.loading && (
//                     <DropDownItem> Nothing Found {inputValue}</DropDownItem>
//                   )}
//                 </DropDown>
//               )}
//             </div>
//           )}
//         </Downshift>
//       </SearchStyles>
//     );
//   }
// }

export default AutoComplete;
