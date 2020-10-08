import React, { useCallback, useState } from 'react';

import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Checkbox,
  FormControlLabel,
  FormGroup,
  makeStyles,
  Paper,
  TextField,
  Typography,
} from '@material-ui/core';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { nanoid } from '@reduxjs/toolkit';
import { debounce } from 'lodash';
import NumberFormat from 'react-number-format';
import { useDispatch, useSelector } from 'react-redux';

import searchSlice, { filterProducts, selectFilterQueryString } from '../../../store/search/searchSlice';
import PropFilters from './PropFilters';
import { getFiltersFormFormat, transformVariants } from './util';

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
  specificFilters: {
    marginTop: '1rem',
  },
}));

function NumberField({
  name,
  label,
  placeholder,
  margin = 'normal',
  variant = 'outlined',
  prefix,
  value,
  thousandSeparator = true,
  onValueChange,
}) {
  return (
    <NumberFormat
      name={name}
      margin={margin}
      placeholder={placeholder}
      variant={variant}
      thousandSeparator={thousandSeparator}
      label={label}
      prefix={prefix}
      customInput={p => <TextField {...p} size='small' variant='outlined' />}
      allowNegative={false}
      value={value}
      onValueChange={onValueChange}
    />
  );
}

function SideBar({ tags, brands, categories, variants }) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const filtersQuery = useSelector(selectFilterQueryString);

  const [formState, setFormState] = useState({
    tags: [],
    brands: [],
    categories: [],
    priceMin: '',
    priceMax: '',
  });

  const updatePriceState = (name, values) => {
    setFormState(state => ({ ...state, [name]: values.value }));
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncePriceFilter = useCallback(debounce(updatePriceState, 1000), []);

  const handlePriceChange = (name, values) => {
    debouncePriceFilter(name, values);
  };

  const handleChange = e => {
    const { name, value } = e.target;

    const items = formState[name]?.includes(value)
      ? formState[name].filter(x => x !== value)
      : [...(formState[name] ?? []), value];

    setFormState(state => ({
      ...state,
      [name]: items,
    }));
  };

  React.useEffect(() => {
    const filterProps = getFiltersFormFormat(transformVariants(variants));
    setFormState(state => ({
      ...state,
      ...filterProps,
    }));
  }, [variants]);

  React.useEffect(() => {
    const { priceMin, priceMax, tags: tagsArr, brands: brandsArr, categories: categoriesArr, ...rest } = formState;
    const params = new URLSearchParams();

    if (priceMin) {
      params.append('price_min', priceMin);
    }
    if (priceMax) {
      params.append('price_max', priceMax);
    }

    tagsArr.forEach(x => {
      params.append('tag', x);
    });
    brandsArr.forEach(x => {
      params.append('brand', x);
    });
    categoriesArr.forEach(x => {
      params.append('category', x);
    });

    Object.keys(rest).forEach(cat => {
      Object.entries(formState[cat]).forEach(([prop, val]) => {
        val.filter(Boolean).forEach(v => {
          params.append(`${cat}_${prop}`, v);
        });
      });
    });

    dispatch(searchSlice.actions.setFilterQueryString(params.toString()));
  }, [dispatch, formState]);

  React.useEffect(() => {
    const params = new URLSearchParams(filtersQuery);
    dispatch(filterProducts(params));
  }, [dispatch, filtersQuery]);

  return (
    <div className={classes.sideBarOuter}>
      <form noValidate>
        <Accordion classes={{ expanded: classes.expanded }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls='categories-filter' id='categories-filter'>
            <Typography className={classes.heading}>Categories</Typography>
          </AccordionSummary>
          <AccordionDetails className={classes.accordionDetails}>
            <FormGroup>
              {categories.map(category => (
                <FormControlLabel
                  key={nanoid()}
                  control={
                    <Checkbox
                      icon={<CheckBoxOutlineBlankIcon fontSize='small' />}
                      checkedIcon={<CheckBoxIcon fontSize='small' />}
                      name='categories'
                      value={category.name}
                      checked={formState.categories?.includes(category.name)}
                      onChange={handleChange}
                    />
                  }
                  label={category.name}
                />
              ))}
            </FormGroup>
          </AccordionDetails>
        </Accordion>

        <Accordion classes={{ expanded: classes.expanded }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls='brands-filter' id='brands-filter'>
            <Typography className={classes.heading}>Brands</Typography>
          </AccordionSummary>
          <AccordionDetails className={classes.accordionDetails}>
            <FormGroup>
              {brands.map(brand => (
                <FormControlLabel
                  key={nanoid()}
                  control={
                    <Checkbox
                      icon={<CheckBoxOutlineBlankIcon fontSize='small' />}
                      checkedIcon={<CheckBoxIcon fontSize='small' />}
                      name='brands'
                      value={brand.name}
                      checked={formState.brands?.includes(brand.name)}
                      onChange={handleChange}
                    />
                  }
                  label={brand.name}
                />
              ))}
            </FormGroup>
          </AccordionDetails>
        </Accordion>

        <Accordion classes={{ expanded: classes.expanded }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls='tags-filter' id='tags-filter'>
            <Typography className={classes.heading}>Tags</Typography>
          </AccordionSummary>
          <AccordionDetails className={classes.accordionDetails}>
            <FormGroup>
              {tags.map(tag => (
                <FormControlLabel
                  key={nanoid()}
                  control={
                    <Checkbox
                      icon={<CheckBoxOutlineBlankIcon fontSize='small' />}
                      checkedIcon={<CheckBoxIcon fontSize='small' />}
                      name='tags'
                      value={tag.name}
                      checked={formState.tags?.includes(tag.name)}
                      onChange={handleChange}
                    />
                  }
                  label={tag.name}
                />
              ))}
            </FormGroup>
          </AccordionDetails>
        </Accordion>

        <Paper className={classes.pricePaper}>
          <Typography className={classes.heading}>Price</Typography>
          <div className={classes.priceWrapper}>
            <NumberField
              name='priceMin'
              value={formState.priceMin}
              onValueChange={values => handlePriceChange('priceMin', values)}
              label='min'
              prefix='$'
            />
            <NumberField
              name='priceMax'
              value={formState.priceMax}
              onValueChange={values => handlePriceChange('priceMax', values)}
              label='max'
              prefix='$'
            />
          </div>
        </Paper>

        {(categories.length > 0 || brands.length > 0 || tags.length > 0) && (
          <div className={classes.specificFilters}>
            <PropFilters
              formState={formState}
              setFormState={setFormState}
              variants={variants}
              handleChange={handleChange}
            />
          </div>
        )}
      </form>
    </div>
  );
}

export default SideBar;
