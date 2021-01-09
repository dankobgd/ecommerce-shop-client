import React, { useContext, useEffect } from 'react';

import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Checkbox,
  FormControlLabel,
  FormGroup,
  makeStyles,
  Typography,
} from '@material-ui/core';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import _ from 'lodash';

import { ShopContext } from '../ShopContext';
import PriceFilters from './PriceFilters';
import PropFilters from './PropFilters';

const useStyles = makeStyles(() => ({
  sideBarOuter: {
    border: '1px solid #eee',
  },
  expanded: {
    '&$expanded': {
      margin: 0,
    },
  },
  priceWrapper: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    justifyContent: 'center',
    gap: '1rem',
  },
  pricePaper: {
    padding: '10px 1rem',
    marginTop: 0,
  },
}));

function Filter({ tagsList, brandsList, categoriesList, setFilterQueryString, setShouldFetchAllByFilter }) {
  const classes = useStyles();
  const {
    mainFilters,
    specificFilters,
    priceFilters,
    setMainFilters,
    updateSpecificFilters,
    setHasSearched,
    clickedMainFilterChoice,
  } = useContext(ShopContext);

  const handleChange = event => {
    const { name, value } = event.target;
    const arr = mainFilters?.[name];
    const items = arr?.includes(value) ? arr.filter(x => x !== value) : [...(arr ?? []), value];
    setMainFilters({ name, items });
  };

  useEffect(() => {
    const remainingProps = _.pickBy(
      specificFilters,
      (v, k) => mainFilters?.categories?.includes(k.split('_')[0]) && v.length > 0
    );
    updateSpecificFilters(remainingProps);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mainFilters]);

  useEffect(() => {
    const filtersObject = {
      ...mainFilters,
      ...priceFilters,
      ...specificFilters,
    };

    const valid = ['categories', 'tags', 'brands', 'priceMin', 'priceMax'];

    const filtered = Object.keys(filtersObject)
      .filter(key => {
        const k = key.split('_')[0];
        return filtersObject.categories.includes(k) || valid.includes(k);
      })
      .reduce((obj, key) => {
        obj[key] = filtersObject[key];
        return obj;
      }, {});

    const { priceMin, priceMax, categories, tags, brands, ...restFilters } = filtered;

    const params = new URLSearchParams({ page: 1, per_page: 20 });

    if (priceMin) {
      params.append('price_min', priceMin);
    }
    if (priceMax) {
      params.append('price_max', priceMax);
    }
    if (tags) {
      tags.forEach(v => {
        params.append('tag', v);
      });
    }
    if (brands) {
      brands.forEach(v => {
        params.append('brand', v);
      });
    }
    if (categories) {
      categories.forEach(v => {
        params.append('category', v);
      });
    }

    const sfilters = _.pickBy(restFilters, v => v?.length > 0 || v);

    Object.keys(sfilters).forEach(key => {
      if (Array.isArray(sfilters[key])) {
        sfilters[key].forEach(val => {
          params.append(key, val);
        });
      } else {
        params.append(key, true);
      }
    });

    if (priceMin || priceMax || brands?.length > 0 || tags?.length > 0 || categories?.length > 0) {
      setShouldFetchAllByFilter(true);
      setHasSearched(true);
      setFilterQueryString(params.toString());
    } else {
      setShouldFetchAllByFilter(true);
      setHasSearched(true);
      setFilterQueryString('page=1&per_page=20');
    }
  }, [mainFilters, priceFilters, setFilterQueryString, setHasSearched, setShouldFetchAllByFilter, specificFilters]);

  const mainChoices = ['categories', 'tags', 'brands'];
  const mapping = { categories: categoriesList, brands: brandsList, tags: tagsList };

  return (
    <div className={classes.sideBarOuter}>
      <form noValidate>
        {mainChoices.map(opt => (
          <Accordion
            key={opt}
            classes={{ expanded: classes.expanded }}
            defaultExpanded={clickedMainFilterChoice && clickedMainFilterChoice === opt}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls={`${opt}-filter`} id={`${opt}-filter`}>
              <Typography className={classes.heading}>{opt.charAt(0).toUpperCase() + opt.slice(1)}</Typography>
            </AccordionSummary>
            <AccordionDetails className={classes.accordionDetails}>
              <FormGroup>
                {mapping[opt].map(x => (
                  <FormControlLabel
                    key={x.id}
                    control={
                      <Checkbox
                        icon={<CheckBoxOutlineBlankIcon fontSize='small' />}
                        checkedIcon={<CheckBoxIcon fontSize='small' />}
                        name={opt}
                        value={x.slug}
                        checked={mainFilters && mainFilters[opt] && mainFilters[opt].includes(x.slug)}
                        onChange={handleChange}
                      />
                    }
                    label={x.name}
                  />
                ))}
              </FormGroup>
            </AccordionDetails>
          </Accordion>
        ))}
        <PriceFilters />
        <PropFilters />
      </form>
    </div>
  );
}

export default Filter;
