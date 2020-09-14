import React from 'react';

import { makeStyles, Accordion, AccordionSummary, Typography, AccordionDetails } from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { nanoid } from 'nanoid';
import { FormProvider, useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';

import productSlice from '../../../store/product/productSlice';

const useStyles = makeStyles(() => ({
  sideBarOuter: {
    border: '1px solid #eee',
  },
}));

const formOpts = {
  mode: 'onChange',
  reValidateMode: 'onChange',
  defaultValues: {
    categories: [],
    brands: [],
    tags: [],
    price: [0, 1000],
  },
};

function SpecificCategoryFilters({ chosenCategories, variants, register, watch }) {
  const dispatch = useDispatch();
  const opts = variants.filter(v => v.category === chosenCategories?.find(c => c === v.category));

  const handleChange = e => {
    dispatch(productSlice.actions.setFilters(watch()));
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
            {props[prop].map(p => (
              <div key={nanoid()}>
                <input
                  id={`filter-${category}-${prop}`}
                  type='checkbox'
                  name={`${category}_${prop}`}
                  value={p}
                  ref={register}
                  onChange={handleChange}
                />
                <label htmlFor={`filter-${category}-${prop}`}>{p}</label>
              </div>
            ))}
          </AccordionDetails>
        </Accordion>
      ))}
    </div>
  ));
}

let renderCount = 0;
const Counter = ({ count }) => <div>render count: {count}</div>;

function SideBar({ tags, brands, categories, variants }) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const methods = useForm(formOpts);
  const { register, watch } = methods;
  const chosenCategories = watch('categories');

  renderCount++;

  const handleChange = e => {
    dispatch(productSlice.actions.setFilters(watch()));
  };

  return (
    <div className={classes.sideBarOuter}>
      <FormProvider {...methods}>
        <form noValidate>
          <Counter count={renderCount} />

          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls='categories-filter' id='categories-filter'>
              <Typography className={classes.heading}>Categories</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                {categories.map(c => (
                  <div key={c.id}>
                    <input
                      id={`${c.name}-filter`}
                      type='checkbox'
                      name='categories'
                      value={c.name}
                      ref={register}
                      onChange={handleChange}
                    />
                    <label htmlFor={`${c.name}-filter`}>{c.name}</label>
                  </div>
                ))}
              </div>
            </AccordionDetails>
          </Accordion>

          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls='brands-filter' id='brands-filter'>
              <Typography className={classes.heading}>Brands</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                {brands.map(b => (
                  <div key={b.id}>
                    <input
                      id={`${b.name}-filter`}
                      type='checkbox'
                      name='brands'
                      value={b.name}
                      ref={register}
                      onChange={handleChange}
                    />
                    <label htmlFor={`${b.name}-filter`}>{b.name}</label>
                  </div>
                ))}
              </div>
            </AccordionDetails>
          </Accordion>

          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls='tags-filter' id='tags-filter'>
              <Typography className={classes.heading}>Tags</Typography>
            </AccordionSummary>
            <AccordionDetails style={{ flexDirection: 'column' }}>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                {tags.map(t => (
                  <div key={t.id}>
                    <input
                      id={`${t.name}-filter`}
                      type='checkbox'
                      name='tags'
                      value={t.name}
                      ref={register}
                      onChange={handleChange}
                    />
                    <label htmlFor={`${t.name}-filter`}>{t.name}</label>
                  </div>
                ))}
              </div>
            </AccordionDetails>
          </Accordion>

          {chosenCategories.length > 0 && <p style={{ color: 'green' }}>Specific filters</p>}
          <div style={{ marginTop: '1rem' }}>
            <SpecificCategoryFilters
              chosenCategories={chosenCategories}
              variants={variants}
              register={register}
              watch={watch}
            />
          </div>
        </form>
      </FormProvider>
    </div>
  );
}

export default SideBar;
