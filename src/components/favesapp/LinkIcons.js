import React from 'react';
import wikiIcon from '../../assets/wiki-icon.png';
import imdbIcon from '../../assets/imdb-icon.png';

const LinkIcons = (props) => {
  return (
    <>
    <div className="media-links">
      <div className="media-links-icons">
        <a rel="noopener noreferrer" href={props.wiki} target="_blank">
          <img src={wikiIcon} alt={props.overview} className="movie-link-wiki" />
        </a>
        <a rel="noopener noreferrer" href={props.imdb} target="_blank">
          <img src={imdbIcon} alt={props.overview} className="movie-link-imdb"/>
        </a>
      </div>
    </div>
    </>
  );
};

export default LinkIcons;