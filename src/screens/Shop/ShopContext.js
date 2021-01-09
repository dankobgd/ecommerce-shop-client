import React, { useState, createContext, useCallback } from 'react';

import _ from 'lodash';

import { usePersistedState } from '../../hooks/usePersistedState';

export const ShopContext = createContext();

const initialMainFilters = {
  tags: [],
  brands: [],
  categories: [],
};

const initialPriceFilters = {
  priceMin: '',
  priceMax: '',
};

const initialPriceValues = {
  priceMin: '',
  priceMax: '',
};

const initialSpecificFilters = {};

const getEmptySpecificFilters = obj =>
  Object.keys(obj).reduce((acc, key) => {
    acc[key] = [];
    return acc;
  }, {});

export function ShopProvider({ children }) {
  // const [mainFilters, setMain] = usePersistedState('mainFilters', initialMainFilters);
  // const [priceFilters, setPrice] = usePersistedState('priceFilters', initialPriceFilters);
  // const [priceValues, setPriceVals] = usePersistedState('priceValues', initialPriceValues);
  // const [specificFilters, setSpecific] = usePersistedState('specificFilters', initialSpecificFilters);
  // const [hasSearched, setHasSearched] = usePersistedState('hasSearched', false);

  const [mainFilters, setMain] = useState(initialMainFilters);
  const [priceFilters, setPrice] = useState(initialPriceFilters);
  const [priceValues, setPriceVals] = useState(initialPriceValues);
  const [specificFilters, setSpecific] = useState(initialSpecificFilters);
  const [hasSearched, setHasSearched] = useState(false);
  const [clickedMainFilterChoice, setClickedMainFilterChoice] = useState(null);

  const setMainFilters = ({ name, items }) => {
    setMain(old => ({
      ...old,
      [name]: items,
    }));
  };

  const setSpecificTextFilters = ({ name, items }) => {
    setSpecific(old => ({
      ...old,
      [name]: items,
    }));
  };

  const setSpecificBoolFilter = name => {
    setSpecific(old => ({
      ...old,
      [name]: !old[name],
    }));
  };

  const updateSpecificFilters = obj => {
    setSpecific(obj);
  };

  const setPriceMinFilter = val => {
    setPrice(old => ({
      ...old,
      priceMin: val,
    }));
  };

  const setPriceMaxFilter = val => {
    setPrice(old => ({
      ...old,
      priceMax: val,
    }));
  };

  const setPriceValues = ({ name, value }) => {
    setPriceVals(old => ({
      ...old,
      [name]: value,
    }));
  };

  const clearPriceMin = () => {
    setPrice(old => ({ ...old, priceMin: '' }));
    setPriceVals(old => ({ ...old, priceMin: '' }));
  };

  const clearPriceMax = () => {
    setPrice(old => ({ ...old, priceMax: '' }));
    setPriceVals(old => ({ ...old, priceMax: '' }));
  };

  const clearAllFilters = () => {
    setMain(initialMainFilters);
    setSpecific(old => getEmptySpecificFilters(old));
    setPrice(initialPriceFilters);
    setPriceVals(initialPriceFilters);
  };

  const clickMainFilterChoice = ({ name, value }) => {
    setClickedMainFilterChoice(name);
    setMain({
      ...initialMainFilters,
      ...{ [name]: [value] },
    });
    setSpecific(old => getEmptySpecificFilters(old));
    setPrice(initialPriceFilters);
    setPriceVals(initialPriceFilters);
  };

  // some helpers
  const hasFilters = [
    _.pickBy(mainFilters, v => v.length > 0),
    _.pickBy(priceFilters, v => v.length > 0),
    _.pickBy(specificFilters, v => v?.length > 0 || v),
  ].some(x => Object.keys(x).length > 0);

  const hasSpecificFilters = Object.keys(_.pickBy(specificFilters, v => v?.length > 0 || v)).length > 0;

  const getChipFiltersData = useCallback(() => {
    const chipData = [];

    Object.entries(mainFilters).forEach(([key, val]) => {
      val.forEach(v => {
        chipData.push({ key: `${key}_${v}`, label: v, name: key, values: val, value: v });
      });
    });
    Object.entries(priceFilters).forEach(([key, val]) => {
      const label = `${key.slice(5).charAt(0).toLowerCase() + key.slice(5).slice(1)}: $${val}`;
      if (val) {
        chipData.push({ key, label, name: key, values: val });
      }
    });

    const nonEmptySpecific = _.pickBy(specificFilters, v => v?.length > 0 || v);
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
  }, [mainFilters, priceFilters, specificFilters]);

  return (
    <ShopContext.Provider
      value={{
        hasSearched,
        setHasSearched,
        mainFilters,
        specificFilters,
        priceFilters,
        priceValues,
        setMainFilters,
        setSpecificTextFilters,
        updateSpecificFilters,
        setPriceValues,
        setPriceMinFilter,
        setPriceMaxFilter,
        clearPriceMin,
        clearPriceMax,
        clearAllFilters,
        clickMainFilterChoice,
        hasFilters,
        hasSpecificFilters,
        getChipFiltersData,
        clickedMainFilterChoice,
        setSpecificBoolFilter,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
}
