import React, { useEffect } from 'react';

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
import _ from 'lodash';
import { useDispatch, useSelector } from 'react-redux';

import searchSlice, { selectMainFilters, selectSpecificFilters } from '../../../store/search/searchSlice';

const useStyles = makeStyles(() => ({
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
  specificFilters: {
    marginTop: '1rem',
  },
}));

function PropFilters({ variants }) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const mainFilters = useSelector(selectMainFilters);
  const specificFilters = useSelector(selectSpecificFilters);

  const filterProps = Object.keys(variants).reduce((obj, key) => {
    const [cat, prop] = key.split('_');
    _.set(obj, `${cat}.${prop}`, variants[key]);
    return obj;
  }, {});

  const filtered = Object.keys(filterProps)
    .filter(key => mainFilters?.categories?.includes(key))
    .reduce((obj, key) => {
      obj[key] = filterProps[key];
      return obj;
    }, {});

  useEffect(() => {
    const obj = Object.keys(variants).reduce((acc, key) => {
      acc[key] = [];
      return acc;
    }, {});

    dispatch(searchSlice.actions.initSpecificFilters(obj));
  }, [dispatch, variants]);

  const handleChange = event => {
    const { name, value } = event.target;
    const arr = specificFilters[name];
    const items = arr?.includes(value) ? arr.filter(x => x !== value) : [...(arr ?? []), value];
    dispatch(searchSlice.actions.setSpecificFilters({ name, items }));
  };

  return (
    Object.keys(filtered).length > 0 && (
      <div className={classes.specificFilters}>
        {Object.entries(filtered).map(([category, props]) => (
          <div key={category} style={{ marginBottom: '1rem' }}>
            {Object.keys(props).map(prop => (
              <Accordion key={`${category}-${prop}`} classes={{ expanded: classes.expanded }}>
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
                      <div key={`${category}-${prop}-${p}`}>
                        <FormControlLabel
                          control={
                            <Checkbox
                              icon={<CheckBoxOutlineBlankIcon fontSize='small' />}
                              checkedIcon={<CheckBoxIcon fontSize='small' />}
                              name={`${category}_${prop}`}
                              value={p}
                              checked={specificFilters && specificFilters[`${category}_${prop}`]?.includes(p)}
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
        ))}
      </div>
    )
  );
}

export default PropFilters;
