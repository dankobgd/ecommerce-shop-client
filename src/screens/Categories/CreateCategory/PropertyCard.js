import React from 'react';

import {
  AppBar,
  Avatar,
  Button,
  Container,
  Dialog,
  IconButton,
  makeStyles,
  Slide,
  Toolbar,
  Typography,
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import _ from 'lodash';
import { useDrag, useDrop } from 'react-dnd';

import CustomTooltip from '../../../components/CustomTooltip/CustomTooltip';
import { FormSelect, FormSwitch, FormTextField } from '../../../components/Form';
import FilterChoices from './FilterChoices';

const useStyles = makeStyles(theme => ({
  appBar: {
    position: 'relative',
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1,
    color: '#fff',
  },

  cardOuter: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    border: '1px solid #3f51b5',
    backgroundColor: '#f3f3f3',
    padding: 10,
    margin: '1rem 0 1rem 0',
    borderRadius: 4,
    position: 'relative',
    width: '100%',
  },
  cardInner: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  editCard: {
    marginLeft: 'auto',
  },
  deleteCard: {
    color: 'red',
    position: 'absolute',
    top: '50%',
    left: '100%',
    transform: 'translateY(-50%)',
  },
}));

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction='up' ref={ref} {...props} />;
});

function PropertyCard({ card, idx, control, remove, moveCard, errors, getValues }) {
  const classes = useStyles();

  const [dialogOpen, setDialogOpen] = React.useState(false);
  const handleOpenDialog = () => {
    setDialogOpen(true);
  };
  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

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
    <>
      <div className={classes.cardOuter} style={{ opacity }} ref={ref}>
        <div className={classes.cardInner}>
          <Avatar
            style={{
              width: 28,
              height: 28,
              marginRight: '1rem',
              color: '#fff',
              backgroundColor: '#757de8',
            }}
          >
            {idx + 1}
          </Avatar>

          {getValues()?.properties?.[idx]?.label || getValues()?.properties?.[idx]?.name || `Property ${idx + 1}`}

          <CustomTooltip title={<Typography variant='body1'>Edit Property</Typography>}>
            <IconButton
              color='primary'
              size='small'
              className={classes.editCard}
              onClick={() => {
                handleOpenDialog();
              }}
            >
              <EditIcon />
            </IconButton>
          </CustomTooltip>
          <CustomTooltip title={<Typography variant='body1'>Delete Property</Typography>}>
            <IconButton
              size='small'
              className={classes.deleteCard}
              onClick={() => {
                remove(idx);
              }}
            >
              <DeleteIcon />
            </IconButton>
          </CustomTooltip>
        </div>
      </div>

      {!!errors?.properties?.[idx] && (
        <span
          style={{
            color: '#e53935',
            fontSize: 12,
            marginTop: '-16px',
            marginLeft: 16,
            display: 'block',
            fontWeight: 500,
          }}
        >{`Property ${idx + 1} has errors`}</span>
      )}

      <Dialog fullScreen open={dialogOpen} onClose={handleCloseDialog} TransitionComponent={Transition}>
        <AppBar className={classes.appBar}>
          <Toolbar>
            <IconButton edge='start' color='inherit' onClick={handleCloseDialog} aria-label='close'>
              <CloseIcon />
            </IconButton>
            <Typography variant='h6' className={classes.title}>
              Sound
            </Typography>
            <Button autoFocus color='inherit' onClick={handleCloseDialog}>
              save
            </Button>
          </Toolbar>
        </AppBar>
        <Container component='section' maxWidth='xs'>
          <FormTextField
            fullWidth
            name={`properties[${idx}].name`}
            label='Property Name'
            error={!!_.get(errors, `properties[${idx}].name`)}
            helperText={_.get(errors, `properties[${idx}].name.message`)}
            defaultValue={getValues()?.properties?.[idx]?.name}
          />
          <FormTextField
            fullWidth
            name={`properties[${idx}].label`}
            label='Property Label'
            error={!!_.get(errors, `properties[${idx}].label`)}
            helperText={_.get(errors, `properties[${idx}].label.message`)}
            defaultValue={getValues()?.properties?.[idx]?.label}
          />
          <FormSelect
            fullWidth
            name={`properties[${idx}].type`}
            label='Filter Type'
            error={!!_.get(errors, `properties[${idx}].type`)}
            helperText={_.get(errors, `properties[${idx}].type.message`)}
            defaultValue={getValues()?.properties?.[idx]?.type || 'text'}
            options={[
              { label: 'text', value: 'text' },
              { label: 'bool', value: 'bool' },
            ]}
          />
          <FormSwitch
            name={`properties[${idx}].filterable`}
            label='Filterable'
            error={!!_.get(errors, `properties[${idx}].filterable`)}
            helperText={_.get(errors, `properties[${idx}].filterable.message`)}
            defaultValue={getValues()?.properties?.[idx]?.filterable}
          />

          <FilterChoices control={control} nestedIndex={idx} errors={errors} getValues={getValues} />
        </Container>
      </Dialog>
    </>
  );
}

export default PropertyCard;
