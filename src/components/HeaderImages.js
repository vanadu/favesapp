import React, { Component } from 'react';
import HeaderAvatar from '../assets/headeravatar.png';

class HeaderImages extends Component {
  render() {
    return (
      <div className="header-avatar"
        style={{ backgroundImage: `url(${HeaderAvatar})` }}
      >
        {/* <img src={HeaderAvatar} alt="" className="header-image"/> */}
      </div>
    );
  }
}

export default HeaderImages;