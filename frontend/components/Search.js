import React from 'react';
import Downshift, { resetIdCounter } from 'downshift';
import { useRouter } from 'next/router';
import { useLazyQuery } from '@apollo/client';

import gql from 'graphql-tag';
import debounce from 'lodash.debounce';
import { DropDown, DropDownItem, SearchStyles } from './styles/DropDown';

const SEARCH_ITEMS_QUERY = gql`
  query SEARCH_ITEMS_QUERY($searchTerm: String!) {
    search: allItems(
      # raw: true, # Raw isn't a keystone arg,it's for Apollo, so we can intercept the request and always hit the network. This avoids any issues with pagination and caching
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

function AutoComplete(props) {
  const router = useRouter();
  const [findItems, { loading, data, error }] = useLazyQuery(SEARCH_ITEMS_QUERY, {
    fetchPolicy: 'no-cache'
  });
  const items = data ? data.search : [];
  const findItemsButChill = debounce(findItems, 350);
  resetIdCounter();
  return (
    <SearchStyles>
      <Downshift
        onChange={item =>
          router.push({
            pathname: '/item',
            query: {
              id: item.id,
            },
          })
        }
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
                  if(!e.target.value) return; // if it's empty, don't search
                  findItemsButChill({
                    variables: { searchTerm: e.target.value },
                  });
                },
              })}
            />

              {isOpen && inputValue && (
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

export default AutoComplete;
