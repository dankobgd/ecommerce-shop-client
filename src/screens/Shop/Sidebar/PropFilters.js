import React from 'react';

import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  makeStyles,
  Typography,
  FormGroup,
  FormControlLabel,
  Checkbox,
} from '@material-ui/core';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { nanoid } from '@reduxjs/toolkit';

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

function PropFilters({ formState, setFormState, variants }) {
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

export default PropFilters;
