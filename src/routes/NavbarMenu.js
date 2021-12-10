import React from 'react';
import NavbarMenuItems from './NavbarMenuItems';


const NavbarMenu = ( props ) => {
  return (
    <>
      <NavbarMenuItems sticky={props.sticky} path={props.path}/>
    </>
  );
};

export default NavbarMenu;