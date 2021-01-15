import React from 'react';
import { resetIdCounter, useCombobox } from 'downshift';
import { useRouter } from 'next/router';
import { useLazyQuery } from '@apollo/client';

import gql from 'graphql-tag';
import debounce from 'lodash.debounce';
import { DropDown, DropDownItem, SearchStyles } from './styles/DropDown';

const SEARCH_PRODUCTS_QUERY = gql`
  query SEARCH_PRODUCTS_QUERY($searchTerm: String!) {
    search: allProducts(
      # raw: true, # Raw isn't a keystone arg,it's for Apollo, so we can intercept the request and always hit the network. This avoids any issues with pagination and caching
      where: {
        OR: [
          { name_contains_i: $searchTerm }
          { description_contains_i: $searchTerm }
        ]
      }
    ) {
      id
      photo {
        image {
          publicUrlTransformed
        }
      }
      name
    }
  }
`;

function AutoComplete(props) {
  const router = useRouter();
  const [findItems, { loading, data, error }] = useLazyQuery(
    SEARCH_PRODUCTS_QUERY,
    {
      fetchPolicy: 'no-cache',
    }
  );
  const items = data ? data.search : [];
  const findItemsButChill = debounce(findItems, 350);
  resetIdCounter();
  const {
    isOpen,
    inputValue,
    getMenuProps,
    getInputProps,
    getComboboxProps,
    highlightedIndex,
    getItemProps,
  } = useCombobox({
    items,
    itemToString: (item) => (item === null ? '' : item.name),
    onInputValueChange() {
      if (!inputValue) return;
      findItemsButChill({
        variables: { searchTerm: inputValue },
      });
    },
    onSelectedItemChange({ selectedItem }) {
      router.push({
        pathname: `/product/${selectedItem.id}`,
      });
    },
  });

  return (
    <SearchStyles>
      <div {...getComboboxProps()}>
        <input
          {...getInputProps({
            type: 'search',
            placeholder: 'Search For An Item',
            id: 'search',
            className: loading ? 'loading' : '',
          })}
        />
      </div>
      <DropDown {...getMenuProps()}>
        {isOpen &&
          items.map((item, index) => (
            <DropDownItem
              {...getItemProps({ item })}
              key={item.id}
              highlighted={index === highlightedIndex}
            >
              <img
                width="50"
                src={item.photo.image.publicUrlTransformed}
                alt={item.name}
              />
              {item.name}
            </DropDownItem>
          ))}
        {isOpen && !items.length && !loading && (
          <DropDownItem> Nothing Found for {inputValue}</DropDownItem>
        )}
      </DropDown>
    </SearchStyles>
  );
}

export default AutoComplete;
