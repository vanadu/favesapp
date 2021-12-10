import React from 'react';
import HeaderImages from './HeaderImages';

const TopBanner = () => {
  return (
    <div className="top-banner full">
      <div className="top-banner-content">
        <div className="top-banner-left">
            <h1 className="top-banner-title">Favorites</h1>
            <p className="top-banner-text">
            A listing of some of my favorite movies, TV shows, videos and music.
            </p>

        </div>
        <div className="top-banner-right">
          <HeaderImages />
        </div>
      </div>
    </div>
  );
};

export default TopBanner;
