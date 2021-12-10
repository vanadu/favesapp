import React, { useEffect, useRef, useState } from 'react';
import NavbarMenu from './NavbarMenu';
import { useLocation } from 'react-router-dom';



const Navbar = () => {
  // !VA Functionality notes: We don't display/hide .sticky-navbar-menu when sticky, but rather have different navbar-menu elements for sticky and unsticky. Here we just push the sticky navbar on/off the top edge of the screen and hide/show its opacity. If we were to use the same navbar for sticky and unsticky, we wouldn't be able to animate it with moveUp, because by the time moveUp were run, it would already have mutated back into the regular inline navbar. This way, the inline navbar element just scrolls out of the viewport while the sticky navbar is displayed, and then scrolls back into the viewport once the sticky navbar has animated out of the viewport. NOTE: This has the sideeffect that the sticky navbar moveUp animation always displays when the page is loaded. The workaround for this is setting the visible/hidden delay in Navbar.js to hide the sticky navbar while the onload moveUp animation is running.
  // !VA Set isSticky state when the scroll reaches the top of navbar-menu
  const [isSticky, setSticky] = useState(false);
  // !VA Set isDelay state to 250ms. After this delay, set the visibility of sticky-navbar-menu to visible. This is to hide the element while the CSS moveUp animation runs on page load.  
  const [isDelay, setDelay] = useState(false);
  // const [hasScrolled, setScrolled] = useState(false);
  // !VA ref is the .sticky-wrapper element
  const ref = useRef(null);




  // !VA set isSticky when the bottom border of the .navbar-menu reaches the top of the screen
  const handleScroll = () => {
    if (ref.current) {  
      setSticky(ref.current.getBoundingClientRect().bottom <= 0);
    }
  };

  // !VA Call the useLocation hook now to get the current route path and pass it as props to child components. It is used in NavbarMenuItems to set the active selected menu item properties.
  const location = useLocation();
  const path = location.pathname;

  // !VA Hook for setting the timeout to set visibility of .sticky-navbar-menu to visible to compensate for the moveUp animation always running on first render, i.e. page load.
  useEffect(() => {
    const timer = setTimeout(() => {
      setDelay(true);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);


  // !VA Hook for handling the scroll event
  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', () => handleScroll);
    };
  });

  // !VA If isSticky is true, add the sticky class to .sticky-wrapper
  // !VA If isDelay is true, set the visibility of .sticky-navbar-menu to true
  // console.log(`isSticky :>> ${isSticky};`);


  return (
    <nav className={'navbar'}>
      <div className={`navbar-menu${isSticky ? ' sticky' : ''}`} ref={ref}>
        <div className="sticky-navbar-menu" style={{ visibility: `${isDelay ? 'visible' : 'hidden'}`}}>
          <NavbarMenu sticky={isSticky} path={path}/>
        </div>
        <NavbarMenu sticky={isSticky} path={path}/>
      </div>
    </nav>
  );
};

export default Navbar;