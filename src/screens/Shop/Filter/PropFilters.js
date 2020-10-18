import React, { useEffect, useState } from 'react';

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
import { useDispatch } from 'react-redux';

import searchSlice from '../../../store/search/searchSlice';

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

function PropFilters({ chosenOptions, variants }) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [filters, setFilters] = useState({});

  const filterProps = Object.keys(variants).reduce((obj, key) => {
    const [cat, prop] = key.split('_');
    _.set(obj, `${cat}.${prop}`, variants[key]);
    return obj;
  }, {});

  const filtered = Object.keys(filterProps)
    .filter(key => chosenOptions.categories?.includes(key))
    .reduce((obj, key) => {
      obj[key] = filterProps[key];
      return obj;
    }, {});

  useEffect(() => {
    const tmp = {};
    Object.keys(variants).forEach(key => {
      tmp[key] = [];
    });
    setFilters(state => ({ ...state, ...tmp }));
  }, [variants]);

  useEffect(() => {
    const nonEmpty = _.pickBy(filters, v => v.length > 0);
    dispatch(searchSlice.actions.setFilters(nonEmpty));
  }, [filters, dispatch]);

  const handleChange = event => {
    const { name, value } = event.target;
    const arr = filters[name];
    const items = arr && arr?.includes(value) ? arr.filter(x => x === value) : [...(arr ?? []), value];
    setFilters(state => ({ ...state, [name]: items }));
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
                              checked={filters[`${category}_${prop}`]?.includes(p)}
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
