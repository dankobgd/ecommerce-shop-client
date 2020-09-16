import React, { useState } from 'react';

import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Checkbox,
  FormControlLabel,
  FormGroup,
  makeStyles,
  Slider,
  Typography,
} from '@material-ui/core';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { nanoid } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';

import productSlice from '../../../store/product/productSlice';

const useStyles = makeStyles(() => ({
  sideBarOuter: {
    border: '1px solid #eee',
  },
}));

function SpecificCategoryFilters({ formState, setFormState, variants }) {
  const opts = variants.filter(v => v.category === formState.categories?.find(c => c === v.category));

  const handleChange = e => {
    const { name, value } = e.target;
    const [category, property] = name.split('_');
    const propertyItems = formState[category][property];

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
          <AccordionDetails style={{ flexDirection: 'column' }}>
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

  const filterProps = getFiltersFormFormat(transformVariants(variants));

  const [formState, setFormState] = useState({
    tags: [],
    brands: [],
    categories: [],
    // price: [0, 1000],
    ...filterProps,
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
    dispatch(productSlice.actions.setFilters(formState));
  }, [dispatch, formState]);

  return (
    <div className={classes.sideBarOuter}>
      <form noValidate>
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls='categories-filter' id='categories-filter'>
            <Typography className={classes.heading}>Categories</Typography>
          </AccordionSummary>
          <AccordionDetails>
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

        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls='brands-filter' id='brands-filter'>
            <Typography className={classes.heading}>Brands</Typography>
          </AccordionSummary>
          <AccordionDetails>
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

        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls='tags-filter' id='tags-filter'>
            <Typography className={classes.heading}>Tags</Typography>
          </AccordionSummary>
          <AccordionDetails style={{ flexDirection: 'column' }}>
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

        <PriceSlider />

        <SpecificCategoryFilters
          formState={formState}
          setFormState={setFormState}
          variants={variants}
          handleChange={handleChange}
        />
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

  React.useEffect(() => {
    dispatch(productSlice.actions.setpPriceFilter(state));
  }, [dispatch, state]);

  return <Slider min={0} max={1000} step={1} value={state} onChange={onChange} valueLabelDisplay='auto' />;
}
