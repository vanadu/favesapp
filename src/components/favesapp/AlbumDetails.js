import React from 'react';
import LinkIcons from './LinkIcons';


const AlbumDetails = (props) => {
  // !VA Use nested destructuring to write out the props that were passed from MediaViewer.js to variables
  const {props: { artist_name, artist_info, album_image, website,  work_info, youtube_id, wiki, discogs }} = props;


  return (
    <>
      <div className="media-content">
        <div className="movie-credits-title-header">
          <h2 className="movie-credits-title-banner">{artist_name}</h2>
        </div>
        <div className="movie-poster">
          <img src={album_image} alt="ALT" className="ui image"/>
          <p dangerouslySetInnerHTML={{__html: work_info}}></p>
        </div>
        <div className="movie-credits-cast col-right">
          <div className="movie-credits-cast-actors text-centered">
            <p dangerouslySetInnerHTML={{__html: artist_info}} ></p>
            <h3 dangerouslySetInnerHTML={{__html: website}} ></h3>
          </div>
        </div>
        <div className="album-youtube">
          <iframe width="350" height="197" src={youtube_id} title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
        </div>

      </div>
      <LinkIcons wiki={wiki} discogs={discogs} />
    </>
  );
};

export default AlbumDetails;