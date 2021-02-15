import React, { useContext } from 'react';

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

import { useCategories } from '../../../hooks/queries/categoryQueries';
import { setSpecificBoolFilter, setSpecificTextFilters, ShopContext } from '../ShopContext';

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

function PropFilters() {
  const classes = useStyles();
  const { shop, dispatch } = useContext(ShopContext);

  const { data: allCategories } = useCategories();

  const chosenCategoriesProperties = allCategories?.data
    ?.filter(x => shop?.mainFilters?.categories?.includes(x.slug))
    ?.sort((a, b) => a.importance - b.importance)
    ?.map(x => ({
      name: x.name,
      slug: x.slug,
      properties: x.properties?.filter(p => !!p.filterable) || null,
    }));

  const handleChangeBoolCheckbox = event => {
    dispatch(setSpecificBoolFilter(event.target.name));
  };

  const handleChangeArrayCheckbox = event => {
    const { name, value } = event.target;
    const arr = shop?.specificFilters[name];
    const items = arr?.includes(value) ? arr.filter(x => x !== value) : [...(arr ?? []), value];
    dispatch(setSpecificTextFilters({ name, items }));
  };

  const renderChoiceInputField = (category, property) => {
    if (property.filterable === true) {
      if (property.type === 'bool') {
        return (
          <div key={`${category.slug}-${property.label}`}>
            <FormControlLabel
              control={
                <Checkbox
                  icon={<CheckBoxOutlineBlankIcon fontSize='small' />}
                  checkedIcon={<CheckBoxIcon fontSize='small' />}
                  name={`${category.slug}_${property.name}`}
                  value={property.name}
                  checked={shop?.specificFilters?.[`${category.slug}_${property.name}`] || false}
                  onChange={handleChangeBoolCheckbox}
                />
              }
              label={property.label}
            />
          </div>
        );
      }
      if (property.type === 'text') {
        if (property.choices) {
          return property.choices.map(choice => (
            <div key={`${category.slug}-${property.label}-${choice.label}`}>
              <FormControlLabel
                control={
                  <Checkbox
                    icon={<CheckBoxOutlineBlankIcon fontSize='small' />}
                    checkedIcon={<CheckBoxIcon fontSize='small' />}
                    name={`${category.slug}_${property.name}`}
                    value={choice.name}
                    checked={shop?.specificFilters?.[`${category.slug}_${property.slug}`]?.includes(choice.name)}
                    onChange={handleChangeArrayCheckbox}
                  />
                }
                label={choice.label}
              />
            </div>
          ));
        }
      }
    }
    return null;
  };
  return (
    <div>
      {chosenCategoriesProperties?.map(category => (
        <div key={category.slug} style={{ marginTop: '1rem' }}>
          {category?.properties?.map(property => (
            <Accordion key={`${category.slug}_${property.label}`} classes={{ expanded: classes.expanded }}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls={`${category.slug}-${property.label}-filter`}
                id={`${category.slug}-${property.label}-filter`}
              >
                <Typography>
                  {category.name} {property.label}
                </Typography>
              </AccordionSummary>
              <AccordionDetails className={classes.accordionDetails}>
                <FormGroup>{renderChoiceInputField(category, property)}</FormGroup>
              </AccordionDetails>
            </Accordion>
          ))}
        </div>
      ))}
    </div>
  );
}

export default PropFilters;
