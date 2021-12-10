import React, { useRef, useEffect, useCallback } from 'react';
import PageTopIcon from '../assets/page-to-top-icon.png';
import PageDownIcon from '../assets/page-down-icon.png';
import { Link } from 'react-router-dom';


// !VA IMPORTANT: The icon labels (Projects, Top 100, About, Contact) are assigned, shown and hidden in CSS pseudoelements, not here. It was best to move these captions out of the React space into the presentation layer. For more about this see the TODO.txt action log.
const NavbarMenuItems = ( props ) => {


  // !VA Initialize useRef for later assignment to the parent nav-bar-menu element of the individual nav items. 
  const ref = useRef();
  // !VA props.path uses useLocation to get the current route and is initialized in Navbar.js and passed through NavbarMenu.js via props
  const path = props.path;
  // !VA Derive the pathId, which is the string corresponding to the id of the element, from the route path. The path corresponds to the element id, except for the root path which corresponds to the 'projects' id.
  const getPathId = (path) => {
    path === '/' ? path = 'about' : path = path.substring( 1 );
    return path;
  }
  
  const makeActive = useCallback((id) => {
    // !VA Branch: 042121
    // !VA Set the active class and the backgroundImage icon for the selected navbar-link item, and reset all the unselected navbar-link items to their default formatting. The backgroundImage must be applied separately to the sticky and main navbars because the sticky navbar requires a red background icon while the main inline navbar requires a white one (to show on the red element background). So select each navbar-menu-items component based on its ID (which is applied in the useEffect hook at first render below) and apply the appropriate background icon.

    // !VA bgImagesActive is the array of red icons applied to the active element. bgImages is the array of inactive gray icons.
    // !VA Branch: navbarItemAnimate_01
    // !VA Trying to bind bgImages to the child span of child below.




    const bgImagesActive = [ null, null ];
    const bgImages = [ PageTopIcon, PageDownIcon ];
    // !VA For each child in the children collection, match the element id to the current path. If it matches, apply the active properties to the element and remove the active properties from all other elements.
    for (let i = 0; i < ref.current.children.length; i++) {
      const child = ref.current.children[i];
      // console.log('ref.current.children :>> ');
      // console.log(ref.current.children);
      if (child.id === id) {
        // console.log('child :>> ');
        // console.log(child);
        // console.log('child.children[0] :>> ');
        // console.log(child.children[0]);
        child.classList.add('active');
        // !VA Branch: 042121
        // !VA Access the id via ref.current and conditionals rather than using direct DOM access with getElementById.  
        if (ref.current.id === 'nav-sticky') {
          ref.current.children[i].children[0].style.backgroundImage = `url(${bgImagesActive[i]})`;
        }
        if (ref.current.id === 'nav-inline') {
          ref.current.children[i].children[0].style.backgroundImage = `url(${bgImages[i]})`;
        }
        child.style.backgroundColor = '#AD1310';
      } else if (child.id !== id) {
        // !VA The scrolltotop and scrollpagedown buttons have no children and will return undefined, so exclude them
        if (child.children[0]) {
          child.classList.remove('active');
          child.children[0].style.backgroundImage = `url(${bgImages[i]})`;
          child.style.backgroundColor = '#959595';
        }


        // console.log('child.children[0] :>> ');
        // console.log(child.children[0]);
        // !VA For all non-selected items, remove the active class, set the default background icon and color.

      }
    }
  }, [ ]);

  // !VA Set the default icon selection, icon background image, and menu caption to the Project properties on the first render. 
  // !VA Branch: 042121
  // !VA Also, since there are two different navbar-menu-items components (one for the sticky menu and one for the main nav menu ), assign each of them a semantic id so it is possible to select them independently of one another. The two navbar-menu-items components have different parents, so select them based on the parent node. 
  useEffect(() => {
    const pathId = getPathId(path);
    // !VA Branch: 042121
    // !VA Assign the id...
    if (ref.current) {
      ref.current.parentNode.classList.contains('sticky-navbar-menu') ? ref.current.id = 'nav-sticky' : ref.current.id = 'nav-inline';
    }
    makeActive(pathId);
  }, [ path, makeActive ]);

  // !VA Branch: 040921
  // !VA Set the active properties in the click target, not the route, because the click handler runs pre-render, so at runtime the route has not yet been updated. 
  const onIconClick = (e) => {
    // console.log('onIconClick running');
    console.log('onIconClick props.sticky :>> ');
    console.log(props.sticky);
    makeActive(e.target.id);
  }

  // !VA Handle the scrollToTop icon in the sticky menu 
  const scrollToTop = () => {
    console.log('scrollToTop');
    window.scroll({top:0,behavior:'smooth'})
  }
  // !VA Handle the scrollPageDown icon in the sticky menu 
  const scrollPageDown = () => {
    console.log('scrollPageDown');
    const foo = window.innerHeight;
    console.log('foo :>> ' + foo);
    // window.scrollBy({top: (window.innerHeight * .9), left: 0, behavior: 'smooth'}); 
    // console.log('foo :>> ' + foo);
    window.scrollBy({top: (window.innerHeight * .82), left: 0, behavior: 'smooth'}); 
  }
  // !VA Branch: 042121
  // !VA Removed div.navbar-item from buttons and links
  // !VA Added span to navbar-link to restrict scale animation to link text

  return (
    <div ref={ref} className="navbar-menu-items">
      <button id="scrolltotop" 
        className="navbar-link navbar-link-pager navbar-link-scrolltotop"  
          style={{ backgroundImage: `url(${PageTopIcon})` }}
          onClick = {scrollToTop}
        >
      </button>
      
      <button id="scrollpagedown" className="navbar-link navbar-link-pager navbar-link-scrollpagedown" 
          style={{ backgroundImage: `url(${PageDownIcon})` }}
          onClick = {scrollPageDown}
      >
      </button>
    </div>
  );

}

export default NavbarMenuItems;