import React, { createContext, useMemo } from 'react';

import _ from 'lodash';

import useLocalStorageReducer from '../../hooks/useLocalStorageReducer';
import { formatPriceForDisplay } from '../../utils/priceFormat';

const getEmptySpecificFilters = obj =>
  Object.keys(obj).reduce((acc, key) => {
    acc[key] = [];
    return acc;
  }, {});

const initialState = {
  mainFilters: {
    tags: [],
    brands: [],
    categories: [],
  },
  priceFilters: {
    priceMin: '',
    priceMax: '',
  },
  priceValues: {
    priceMin: '',
    priceMax: '',
  },
  specificFilters: {},
  hasSearched: false,
  clickedMainFilterChoice: null,
  shouldFetchAllByFilter: false,
  filterQueryString: '',
};

function reducer(state, action) {
  switch (action.type) {
    case 'SET_MAIN_FILTERS':
      return {
        ...state,
        mainFilters: {
          ...state.mainFilters,
          [action.name]: action.items,
        },
      };

    case 'SET_SPECIFIC_TEXT_FILTERS':
      return {
        ...state,
        specificFilters: {
          ...state.specificFilters,
          [action.name]: action.items,
        },
      };

    case 'SET_SPECIFIC_BOOL_FILTER':
      return {
        ...state,
        specificFilters: {
          ...state.specificFilters,
          [action.name]: !state.specificFilters[action.name],
        },
      };

    case 'UPDATE_SPECIFIC_FILTERS':
      return {
        ...state,
        specificFilters: { ...action.obj },
      };

    case 'SET_PRICE_MIN_FILTER':
      return {
        ...state,
        priceFilters: { ...state.priceFilters, priceMin: action.price },
      };

    case 'SET_PRICE_MAX_FILTER':
      return {
        ...state,
        priceFilters: { ...state.priceFilters, priceMax: action.price },
      };

    case 'SET_PRICE_VALUES':
      return {
        ...state,
        priceValues: {
          ...state.priceValues,
          [action.name]: action.value,
        },
      };

    case 'CLEAR_PRICE_MIN':
      return {
        ...state,
        priceFilters: { ...state.priceFilters, priceMin: '' },
        priceValues: { ...state.priceValues, priceMin: '' },
      };

    case 'CLEAR_PRICE_MAX':
      return {
        ...state,
        priceFilters: { ...state.priceFilters, priceMax: '' },
        priceValues: { ...state.priceValues, priceMax: '' },
      };

    case 'CLEAR_ALL_FILTERS':
      return {
        ...state,
        mainFilters: { ...initialState.mainFilters },
        specificFilters: { ...initialState.specificFilters },
        priceFilters: { ...initialState.priceFilters },
        priceValues: { ...initialState.priceValues },
      };

    case 'CLICK_MAIN_FILTER_CHOICE':
      return {
        ...state,
        clickedMainFilterChoice: action.name,
        mainFilters: {
          ...initialState.mainFilters,
          ...{ [action.name]: [action.value] },
        },
        specificFilters: { ...getEmptySpecificFilters(state.specificFilters) },
        priceFilters: { ...initialState.priceFilters },
        priceValues: { ...initialState.priceValues },
      };

    case 'SET_HAS_SEARCHED':
      return {
        ...state,
        hasSearched: action.val,
      };

    case 'SET_SHOULD_FETCH_ALL_BY_FILTER':
      return {
        ...state,
        shouldFetchAllByFilter: action.val,
      };

    case 'SET_FILTER_QUERY_STRING':
      return {
        ...state,
        filterQueryString: action.qs,
      };

    default:
      return { ...initialState };
  }
}

export const ShopContext = createContext();

export function ShopProvider({ children }) {
  const [state, dispatch] = useLocalStorageReducer('shop', reducer, initialState);

  const hasFilters = state.filterQueryString !== '';

  const getChipFiltersData = useMemo(() => {
    const chipData = [];

    Object.entries(state.mainFilters).forEach(([key, val]) => {
      val.forEach(v => {
        chipData.push({ key: `${key}_${v}`, label: v, name: key, values: val, value: v });
      });
    });
    Object.entries(state.priceFilters).forEach(([key, val]) => {
      const label = `${key.slice(5).charAt(0).toLowerCase() + key.slice(5).slice(1)}: $${formatPriceForDisplay(val)}`;
      if (val) {
        chipData.push({ key, label, name: key, values: formatPriceForDisplay(val) });
      }
    });

    const nonEmptySpecific = _.pickBy(state.specificFilters, v => v?.length > 0 || v);
    Object.entries(nonEmptySpecific).forEach(([key, val]) => {
      if (Array.isArray(val)) {
        val.forEach(v => {
          chipData.push({ key: `${key}_${v}`, label: `${key}: ${v}`, name: key, values: val, value: v });
        });
      } else {
        chipData.push({ key: `${key}_${val}`, label: `${key}`, name: key, values: val });
      }
    });

    return chipData;
  }, [state.mainFilters, state.priceFilters, state.specificFilters]);

  const selectors = {
    hasFilters,
    getChipFiltersData,
  };

  const ctxValue = {
    shop: { ...state, ...selectors },
    dispatch,
  };

  return <ShopContext.Provider value={ctxValue}>{children}</ShopContext.Provider>;
}

export const setMainFilters = ({ name, items }) => ({ type: 'SET_MAIN_FILTERS', name, items });
export const setSpecificTextFilters = ({ name, items }) => ({ type: 'SET_SPECIFIC_TEXT_FILTERS', name, items });
export const setSpecificBoolFilter = name => ({ type: 'SET_SPECIFIC_BOOL_FILTER', name });
export const updateSpecificFilters = obj => ({ type: 'UPDATE_SPECIFIC_FILTERS', obj });
export const setPriceMinFilter = price => ({ type: 'SET_PRICE_MIN_FILTER', price });
export const setPriceMaxFilter = price => ({ type: 'SET_PRICE_MAX_FILTER', price });
export const setPriceValues = ({ name, value }) => ({ type: 'SET_PRICE_VALUES', name, value });
export const clearPriceMin = () => ({ type: 'CLEAR_PRICE_MIN' });
export const clearPriceMax = () => ({ type: 'CLEAR_PRICE_MAX' });
export const clearAllFilters = () => ({ type: 'CLEAR_ALL_FILTERS' });
export const clickMainFilterChoice = ({ name, value }) => ({ type: 'CLICK_MAIN_FILTER_CHOICE', name, value });
export const setHasSearched = val => ({ type: 'SET_HAS_SEARCHED', val });
export const setShouldFetchAllByFilter = val => ({ type: 'SET_SHOULD_FETCH_ALL_BY_FILTER', val });
export const setFilterQueryString = qs => ({ type: 'SET_FILTER_QUERY_STRING', qs });
