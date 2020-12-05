import React from 'react';

import { Button, IconButton, makeStyles, Tooltip, Typography } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import { withStyles } from '@material-ui/styles';
import _ from 'lodash';
import { nanoid } from 'nanoid';
import { useFieldArray, useWatch } from 'react-hook-form';

import { FormTextField } from '../../../components/Form';

const useStyles = makeStyles(() => ({
  inputGroup: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  deleteChoice: {
    color: 'red',
    position: 'absolute',
    top: '50%',
    left: '100%',
    transform: 'translateY(-50%)',
  },
}));

function FilterChoices({ control, nestedIndex, errors, getValues }) {
  const classes = useStyles();
  const { fields, append, remove } = useFieldArray({ name: `properties[${nestedIndex}].choices`, control });
  const choicesList = fields.length > 0 ? fields : getValues()?.properties?.[nestedIndex]?.choices;
  const watchedType = useWatch({ control, name: `properties[${nestedIndex}].type`, defaultValue: 'text' });

  return (
    <>
      <div>
        {watchedType === 'text' &&
          choicesList?.map((field, idx) => (
            <div key={nanoid()}>
              <div className={classes.inputGroup}>
                <FormTextField
                  name={`properties[${nestedIndex}].choices[${idx}].name`}
                  label='Choice Name'
                  error={!!_.get(errors, `properties[${nestedIndex}].choices[${idx}].name`)}
                  helperText={_.get(errors, `properties[${nestedIndex}].choices[${idx}].name.message`)}
                  defaultValue={getValues()?.properties?.[nestedIndex]?.choices?.[idx]?.name}
                  fullWidth
                  size='small'
                />
                <FormTextField
                  name={`properties[${nestedIndex}].choices[${idx}].label`}
                  label='Choice Label'
                  error={!!_.get(errors, `properties[${nestedIndex}].choices[${idx}].label`)}
                  helperText={_.get(errors, `properties[${nestedIndex}].choices[${idx}].label.message`)}
                  defaultValue={getValues()?.properties?.[nestedIndex]?.choices?.[idx]?.label}
                  fullWidth
                  size='small'
                />

                <CustomTooltip title={<Typography variant='body1'>Delete Choice</Typography>}>
                  <IconButton
                    size='small'
                    className={classes.deleteChoice}
                    onClick={() => {
                      remove(idx);
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </CustomTooltip>
              </div>
            </div>
          ))}
      </div>

      {watchedType === 'text' && (
        <div style={{ marginTop: '1rem' }}>
          <Button
            variant='contained'
            size='small'
            startIcon={<AddIcon />}
            onClick={() => append({ name: '', label: '' })}
          >
            Add Choice Option
          </Button>
        </div>
      )}
    </>
  );
}

const CustomTooltip = withStyles(theme => ({
  tooltip: {
    backgroundColor: '#f5f5f9',
    color: 'rgba(0, 0, 0, 0.87)',
    maxWidth: 350,
    fontSize: theme.typography.pxToRem(16),
    border: '1px solid #dadde9',
  },
}))(Tooltip);

export default FilterChoices;
