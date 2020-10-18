import React, { useCallback, useEffect } from 'react';

import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Checkbox,
  FormControlLabel,
  FormGroup,
  makeStyles,
  Paper,
  Typography,
} from '@material-ui/core';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { debounce } from 'lodash';
import { nanoid } from 'nanoid';
import { useDispatch, useSelector } from 'react-redux';

import searchSlice, { filterProducts, selectFilters } from '../../../store/search/searchSlice';
import PriceField from './PriceField';
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

function Filter({
  tagsList,
  brandsList,
  categoriesList,
  variants,
  mainFilters,
  priceFilters,
  setPriceFilters,
  handleChange,
  setHasSearched,
}) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const filtersObject = useSelector(selectFilters);

  const updatePriceFilter = vals => {
    dispatch(searchSlice.actions.setFilters(vals));
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncePrice = useCallback(debounce(updatePriceFilter, 1000), []);

  const handlePriceChange = (name, values) => {
    setPriceFilters(state => ({ ...state, [name]: values.value }));
    debouncePrice(name, values);
  };

  useEffect(() => {
    dispatch(searchSlice.actions.setFilters(mainFilters));
  }, [mainFilters, dispatch]);

  useEffect(() => {
    debouncePrice(priceFilters);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [priceFilters]);

  useEffect(() => {
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
    const params = new URLSearchParams();

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

    Object.keys(restFilters).forEach(key => {
      restFilters[key].forEach(val => {
        params.append(key, val);
      });
    });

    if (priceMin || priceMax || brands?.length > 0 || tags?.length > 0 || categories?.length > 0) {
      dispatch(filterProducts(`${params}`));
      setHasSearched(true);
    }
  }, [filtersObject, dispatch, setHasSearched]);

  const mainChoices = ['categories', 'tags', 'brands'];
  const mapping = { categories: categoriesList, brands: brandsList, tags: tagsList };

  return (
    <div className={classes.sideBarOuter}>
      <form noValidate>
        {mainChoices.map(opt => (
          <Accordion key={opt} classes={{ expanded: classes.expanded }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls={`${opt}-filter`} id={`${opt}-filter`}>
              <Typography className={classes.heading}>{opt.charAt(0).toUpperCase() + opt.slice(1)}</Typography>
            </AccordionSummary>
            <AccordionDetails className={classes.accordionDetails}>
              <FormGroup>
                {mapping[opt].map(x => (
                  <FormControlLabel
                    key={nanoid()}
                    control={
                      <Checkbox
                        icon={<CheckBoxOutlineBlankIcon fontSize='small' />}
                        checkedIcon={<CheckBoxIcon fontSize='small' />}
                        name={opt}
                        value={x.name}
                        checked={mainFilters[opt] && mainFilters[opt].includes(x.name)}
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

        <Paper className={classes.pricePaper}>
          <Typography className={classes.heading}>Price</Typography>
          <div className={classes.priceWrapper}>
            <PriceField
              name='priceMin'
              value={priceFilters.priceMin}
              onValueChange={values => handlePriceChange('priceMin', values)}
              label='min'
              prefix='$'
            />
            <PriceField
              name='priceMax'
              value={priceFilters.priceMax}
              onValueChange={values => handlePriceChange('priceMax', values)}
              label='max'
              prefix='$'
            />
          </div>
        </Paper>

        <PropFilters variants={variants} chosenOptions={mainFilters} />
      </form>
    </div>
  );
}

export default Filter;
