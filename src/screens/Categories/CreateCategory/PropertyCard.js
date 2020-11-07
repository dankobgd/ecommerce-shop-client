import React from 'react';

import { IconButton, makeStyles } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import _ from 'lodash';
import { useDrag, useDrop } from 'react-dnd';
import { useDispatch } from 'react-redux';

import { FormSelect, FormSwitch, FormTextField } from '../../../components/Form';
import toastSlice, { errorToast } from '../../../store/toast/toastSlice';

const useStyles = makeStyles(() => ({
  cardOuter: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    border: '1px solid purple',
    backgroundColor: '#f5f5f5',
    padding: 10,
    margin: '1rem 0 1rem 0',
    borderRadius: 4,
    position: 'relative',
    width: '100%',
  },
  cardInputGroup: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  deleteCard: {
    position: 'absolute',
    top: '50%',
    left: '100%',
    transform: 'translateY(-50%)',
  },
}));

function PropertyCard({ card, errors, idx, remove, moveCard }) {
  const classes = useStyles();
  const dispatch = useDispatch();

  const ref = React.useRef(null);
  const [, drop] = useDrop({
    accept: 'card',
    hover(item, monitor) {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.idx;
      const hoverIndex = idx;
      if (dragIndex === hoverIndex) {
        return;
      }
      const hoverBoundingRect = ref.current?.getBoundingClientRect();
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const clientOffset = monitor.getClientOffset();
      const hoverClientY = clientOffset.y - hoverBoundingRect.top;

      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }
      moveCard(dragIndex, hoverIndex);
      item.idx = hoverIndex;
    },
  });

  const [{ isDragging }, drag] = useDrag({
    item: { type: 'card', id: card.id, idx },
    collect: monitor => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const opacity = isDragging ? 0 : 1;
  drag(drop(ref));

  return (
    <div className={classes.cardOuter} style={{ opacity }} ref={ref}>
      <div className={classes.cardInputGroup}>
        <FormTextField
          name={`properties[${idx}].name`}
          label='Property Name'
          error={!!_.get(errors, `properties[${idx}].name`)}
          helperText={_.get(errors, `properties[${idx}].name.message`)}
          size='small'
        />
        <FormTextField
          name={`properties[${idx}].label`}
          label='Property Label'
          error={!!_.get(errors, `properties[${idx}].label`)}
          helperText={_.get(errors, `properties[${idx}].label.message`)}
          size='small'
        />
      </div>

      <div className={classes.cardInputGroup}>
        <FormSelect
          style={{ width: '50%' }}
          name={`properties[${idx}].type`}
          label='Filter Type'
          error={!!_.get(errors, `properties[${idx}].type`)}
          helperText={_.get(errors, `properties[${idx}].type.message`)}
          options={[
            { label: 'text', value: 'text' },
            { label: 'number', value: 'number' },
            { label: 'bool', value: 'bool' },
          ]}
          defaultValue='text'
          size='small'
        />
        <FormSwitch
          style={{ width: '50%' }}
          name={`properties[${idx}].filterable`}
          label='Filterable'
          error={!!_.get(errors, `properties[${idx}].filterable`)}
          helperText={_.get(errors, `properties[${idx}].filterable.message`)}
          defaultValue
        />

        <IconButton
          className={classes.deleteCard}
          onClick={() => {
            if (idx === 0) {
              dispatch(toastSlice.actions.addToast(errorToast('Must have at least one property')));
              return;
            }
            remove(idx);
          }}
        >
          <DeleteIcon />
        </IconButton>
      </div>
    </div>
  );
}

export default PropertyCard;
