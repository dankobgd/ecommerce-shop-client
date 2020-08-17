import React, { useState, useEffect, useRef, useCallback } from 'react';

import tweenFunctions from './tween-functions';

function ScrollTop(props) {
  const {
    topPosition = 0,
    showBellow = 150,
    duration = 350,
    easeFn = 'easeOutCubic',
    style = {},
    toggledStyle = {},
    containerClassName = 'ScrollTop__Container',
    containerToggledClassName = 'ScrollTop__Container-toggled',
    children,
  } = props;

  const [show, setShow] = useState(false);
  let startPosition = useRef(0);
  let startTime = useRef(0);
  let currentTime = useRef(null);
  let raf = useRef(null);

  const handleScroll = useCallback(() => {
    if (window.pageYOffset > showBellow) {
      if (!show) {
        setShow(true);
      }
    } else if (show) {
      setShow(false);
    }
  }, [show, showBellow]);

  const stopScrolling = () => {
    window.cancelAnimationFrame(raf);
  };

  const scrollStep = timestamp => {
    if (!startTime) {
      startTime = timestamp;
    }
    currentTime = timestamp - startTime;

    const position = tweenFunctions[easeFn](currentTime, startPosition, topPosition, duration);

    if (window.pageYOffset <= topPosition) {
      stopScrolling();
    } else {
      window.scrollTo(window.pageYOffset, position);
      raf = window.requestAnimationFrame(scrollStep);
    }
  };

  const handleClick = () => {
    stopScrolling();
    startPosition = window.pageYOffset;
    currentTime = 0;
    startTime = null;
    raf = window.requestAnimationFrame(scrollStep);
  };

  useEffect(() => {
    handleScroll();
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('wheel', stopScrolling);
    window.addEventListener('touchstart', stopScrolling);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('wheel', stopScrolling);
      window.removeEventListener('touchstart', stopScrolling);
    };
  }, [show, handleScroll]);

  const defaultStyles = {
    main: {
      display: 'block',
      position: 'fixed',
      bottom: 20,
      right: -50,
      cursor: 'pointer',
      transition: 'all 0.4s ease-in-out',
      opacity: 0,
      visibility: 'hidden',
      zIndex: 1000,
    },
    toggled: {
      opacity: 1,
      visibility: 'visible',
      right: 20,
    },
  };

  const styleObject = {
    ...defaultStyles.main,
    ...style,
    ...(show && defaultStyles.toggled),
    ...(show && toggledStyle),
  };

  const element = (
    <div
      style={style}
      className={`${containerClassName} ${show && containerToggledClassName}`}
      role='button'
      aria-label='Scroll to top'
      aria-hidden={!show}
      tabIndex={show ? 0 : -1}
      onClick={handleClick}
      onKeyPress={handleClick}
    >
      {children}
    </div>
  );

  return React.cloneElement(element, { style: styleObject });
}

export default ScrollTop;
