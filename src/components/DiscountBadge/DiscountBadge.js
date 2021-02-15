import React from 'react';

import { makeStyles } from '@material-ui/core';

import { calculatePercentage } from '../../utils/priceFormat';

const useStyles = makeStyles(() => ({
  badge: {
    width: '140px',
    height: '140px',
    position: 'absolute',
    top: '-8px',
    left: 'calc(100% - 132px)',
    overflow: 'hidden',

    '&:before': {
      content: '""',
      position: 'absolute',

      width: '40px',
      height: '8px',
      right: '100px',
      background: '#4D6530',
      borderRadius: '8px 8px 0px 0px',
    },
    '&:after': {
      content: '""',
      position: 'absolute',
      width: '8px',
      height: '40px',
      right: '0px',
      top: '100px',
      backgroundColor: '#4D6530',
      borderRadius: '0px 8px 8px 0px',
    },
  },

  item: {
    width: '200px',
    height: '40px',
    lineHeight: '40px',
    position: 'absolute',
    top: '30px',
    right: '-50px',
    zIndex: 2,
    overflow: 'hidden',
    transform: 'rotate(45deg)',
    border: '1px dashed',
    boxShadow: '0 0 0 3px goldenrod,  0px 21px 5px -18px rgba(0,0,0,0.6)',
    backgroundColor: 'goldenrod',
    textAlign: 'center',
    color: '#fff',
    fontSize: 16,
  },
}));

export function CardDiscountBadge({ product }) {
  const classes = useStyles();
  const percentValue = calculatePercentage(product?.originalPrice, product?.price);

  return (
    <div className={classes.badge}>
      <strong className={classes.item}>{percentValue}% OFF</strong>
    </div>
  );
}

const useStandaloneStyles = makeStyles(() => ({
  badge: {
    fontSize: '2em',
    lineHeight: '1.6rem',
    textTransform: 'uppercase',
    textAlign: 'center',
    fontWeight: 'bold',
    textShadow: '1px 1px 5px rgba(0,0,0,.15)',
    letterSpacing: '-2px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '6rem',
    height: '4rem',
    background: 'linear-gradient(to bottom, goldenrod 0%,#F6EB3B 100%)',
    color: 'white',
    paddingTop: '1rem',
    position: 'relative',
    filter: 'drop-shadow(0 .5rem .3em rgba(0,0,0,.5))',
    transform: 'translate3d(0, 0, 0)',
    marginLeft: '2rem',

    '&:after': {
      content: '""',
      width: 0,
      height: 0,
      borderRight: '3rem solid transparent',
      borderLeft: '3rem solid transparent',
      borderTop: '1.5rem solid #F6EB3B',
      position: 'absolute',
      top: '100%',
      left: 0,
    },
  },
}));

export function StandaloneDiscountBadge({ product }) {
  const classes = useStandaloneStyles();
  const percentValue = calculatePercentage(product?.originalPrice, product?.price);

  return <div className={classes.badge}>SAVE {percentValue}%</div>;
}

// import React from 'react';

// import { makeStyles } from '@material-ui/core';

// import { calculatePercentage } from '../../utils/priceFormat';

// const useStyles = makeStyles(() => ({
//   wrap: {
//     width: '100%',
//     height: '188px',
//     position: 'absolute',
//     top: '-8px',
//     left: '8px',
//     overflow: 'hidden',

//     '&:before': {
//       content: '""',
//       position: 'absolute',

//       width: '40px',
//       height: '8px',
//       right: '100px',
//       background: '#4D6530',
//       borderRadius: '8px 8px 0px 0px',
//     },
//     '&:after': {
//       content: '""',
//       position: 'absolute',
//       width: '8px',
//       height: '40px',
//       right: '0px',
//       top: '100px',
//       backgroundColor: '#4D6530',
//       borderRadius: '0px 8px 8px 0px',
//     },
//   },

//   item: {
//     width: '200px',
//     height: '40px',
//     lineHeight: '40px',
//     position: 'absolute',
//     top: '30px',
//     right: '-50px',
//     zIndex: 2,
//     overflow: 'hidden',
//     transform: 'rotate(45deg)',
//     border: '1px dashed',
//     boxShadow: '0 0 0 3px goldenrod,  0px 21px 5px -18px rgba(0,0,0,0.6)',
//     backgroundColor: 'goldenrod',
//     textAlign: 'center',
//     color: '#fff',
//     fontSize: 16,
//   },
// }));

// const useStandaloneStyles = makeStyles(() => ({
//   badge: {
//     fontSize: '2em',
//     lineHeight: '1.6rem',
//     textTransform: 'uppercase',
//     textAlign: 'center',
//     fontWeight: 'bold',
//     textShadow: '1px 1px 5px rgba(0,0,0,.15)',
//     letterSpacing: '-2px',
//     display: 'flex',
//     justifyContent: 'center',
//     alignItems: 'center',
//     width: '6rem',
//     height: '4rem',
//     background: 'linear-gradient(to bottom, goldenrod 0%,#F6EB3B 100%)',
//     color: 'white',
//     paddingTop: '1rem',
//     position: 'relative',
//     filter: 'drop-shadow(0 .5rem .3em rgba(0,0,0,.5))',
//     transform: 'translate3d(0, 0, 0)',
//     marginLeft: '2rem',

//     '&:after': {
//       content: '""',
//       width: 0,
//       height: 0,
//       borderRight: '3rem solid transparent',
//       borderLeft: '3rem solid transparent',
//       borderTop: '1.5rem solid #F6EB3B',
//       position: 'absolute',
//       top: '100%',
//       left: 0,
//     },
//   },
// }));

// export function CardDiscountBadge({ product }) {
//   const classes = useStyles();
//   const percentValue = calculatePercentage(product?.originalPrice, product?.price);

//   return (
//     <div className={classes.wrap}>
//       <strong className={classes.item}>{percentValue}% OFF</strong>
//     </div>
//   );
// }

// export function StandaloneDiscountBadge({ product }) {
//   const classes = useStandaloneStyles();
//   const percentValue = calculatePercentage(product?.originalPrice, product?.price);

//   return <div className={classes.badge}>SAVE {percentValue}%</div>;
// }
