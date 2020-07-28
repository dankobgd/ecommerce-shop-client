import React from 'react';
import { makeStyles } from '@material-ui/styles';
import { Link } from '@reach/router';

import notfoundGif from '../../assets/img/notfound.webp';

const useStyles = makeStyles({
  notfound: {
    width: '100vw',
    height: '100vh',
    margin: 0,
    padding: 0,
  },
  bg: {
    backgroundImage: `url(${notfoundGif})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    width: '100vw',
    height: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignContent: 'center',
  },
  group: {
    position: 'absolute',
    left: '50%',
    top: '50%',
    transform: 'translate(-50%, -50%)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
  },
  code: {
    color: 'white',
    fontSize: '15vmin',
    fontWeight: 'bold',
  },
  text: {
    color: 'white',
    fontSize: '6vmin',
    fontWeight: 'bold',
  },
  link: {
    color: 'white',
  },
});

function NotFound() {
  const classes = useStyles();

  return (
    <div className={classes.notfound}>
      <div className={classes.bg} />
      <div className={classes.group}>
        <div className={classes.code}>404</div>
        <div className={classes.text}>Page Not Found</div>
        <Link to='/'>
          <span className={classes.link}>Go Back</span>
        </Link>
      </div>
    </div>
  );
}

export default NotFound;
