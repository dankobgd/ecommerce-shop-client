import React, { useState } from 'react';

import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Checkbox,
  FormControlLabel,
  FormGroup,
  makeStyles,
  Paper,
  Slider,
  Typography,
} from '@material-ui/core';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { nanoid } from '@reduxjs/toolkit';
import { useDispatch, useSelector } from 'react-redux';

import searchSlice, { filterProducts, selectFilterQueryString } from '../../../store/search/searchSlice';

const useStyles = makeStyles(() => ({
  sideBarOuter: {
    border: '1px solid #eee',
  },
  expanded: {
    '&$expanded': {
      margin: 0,
    },
  },
  accordionDetails: {
    flexDirection: 'column',
    maxHeight: '300px',
    overflowY: 'auto',
  },
  pricePaper: {
    padding: '10px 1rem',
    marginTop: 0,
  },
  specificFilters: {
    marginTop: '1rem',
  },
}));

function SpecificCategoryFilters({ formState, setFormState, variants }) {
  const classes = useStyles();
  const opts = variants.filter(v => v.category === formState.categories?.find(c => c === v.category));

  const handleChange = e => {
    const { name, value } = e.target;
    const [category, property] = name.split('_');
    const propertyItems = formState[category] && formState[category][property];

    const items = propertyItems?.includes(value)
      ? propertyItems.filter(x => x === value)
      : [...(propertyItems ?? []), value];

    setFormState(state => ({
      ...state,
      [category]: {
        ...state[category],
        [property]: items,
      },
    }));
  };

  return opts.map(({ category, props }) => (
    <div key={nanoid()}>
      {Object.keys(props).map(prop => (
        <Accordion key={nanoid()}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls={`${category}-${prop}-filter`}
            id={`${category}-${prop}-filter`}
          >
            <Typography>
              {category} {prop}
            </Typography>
          </AccordionSummary>
          <AccordionDetails className={classes.accordionDetails}>
            <FormGroup>
              {props[prop].map(p => (
                <div key={nanoid()}>
                  <FormControlLabel
                    key={nanoid()}
                    control={
                      <Checkbox
                        icon={<CheckBoxOutlineBlankIcon fontSize='small' />}
                        checkedIcon={<CheckBoxIcon fontSize='small' />}
                        name={`${category}_${prop}`}
                        value={p}
                        checked={formState[category][prop]?.includes(p)}
                        onChange={handleChange}
                      />
                    }
                    label={p}
                  />
                </div>
              ))}
            </FormGroup>
          </AccordionDetails>
        </Accordion>
      ))}
    </div>
  ));
}

const transformVariants = arr =>
  arr.map(({ category, props }) => {
    const obj = Object.keys(props).reduce((categoryName, propName) => {
      categoryName[propName] = [];
      return categoryName;
    }, {});

    return {
      key: category,
      value: obj,
    };
  });

const getFiltersFormFormat = arr =>
  arr.reduce((acc, item) => {
    acc[item.key] = item.value;
    return acc;
  }, {});

function SideBar({ tags, brands, categories, variants }) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const filtersQuery = useSelector(selectFilterQueryString);

  const [formState, setFormState] = useState({
    tags: [],
    brands: [],
    categories: [],
    // price: [0, 1000],
  });

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
    const { tags: tagsArr, brands: brandsArr, categories: categoriesArr, ...rest } = formState;
    const params = new URLSearchParams();

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
          <PriceSlider />
        </Paper>

        {(categories.length > 0 || brands.length > 0 || tags.length > 0) && (
          <div className={classes.specificFilters}>
            <SpecificCategoryFilters
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

function PriceSlider() {
  const dispatch = useDispatch();
  const [state, setState] = useState([0, 1000]);

  const onChange = (_, value) => {
    setState([...value]);
  };

  // React.useEffect(() => {
  //   dispatch(productSlice.actions.setPriceFilter(state));
  // }, [dispatch, state]);

  return <Slider min={0} max={1000} step={1} value={state} onChange={onChange} valueLabelDisplay='auto' />;
}
