// console.log('card.props.children.props.props.title :>> ');
// console.log(card.props.children.props.props.title);
import MovieDetails from '../MovieDetails';
import AlbumDetails from '../AlbumDetails';
import TVDetails from '../TVDetails';

export function myFunc(){
  return 'This is a helper function';
}

export function indexArray(arr) {
    let i = -1;
    return arr.map(( item ) => {
      item.index = (i=i+1);
      return item;
    });
  }

export function getYear(title, date) {
  // console.log('getYear title :>> ' + title);
  return date.substring(0,4);
}

export function nonBreakingSpace(string) {
  string.replace( ' ', '&nbsp;');
  return string;
}

export function getAirYears(first_air_date, last_air_date) {
  return `${first_air_date.substring(0, 4)} - ${last_air_date.substring(0, 4)}`;
}


export function isEmpty(obj) { 
  for(var prop in obj) { 
    if(obj.hasOwnProperty(prop)) 
    return false; 
    } 
    return true; 
}

export function setMediaProperties( data, record) {
    // console.log('data :>> ');
    // console.log(data);
    // console.log('record :>> ');
    // console.log(record);
    const imageRootPath = 'https://image.tmdb.org/t/p/w500';
    let mediaProperties = {};
    // !VA IMPORTANT This could be queried from content.json - don't need to create the property in callAPI, I don't think.
    const { type } = data;
    // console.log('data.title :>> ');
    // console.log(data.title);
    // console.log('record.descriptor :>> ');
    // console.log(record.descriptor);
    switch(true) {
    case type === 'movie':
      mediaProperties = {
        type: type,
        // !VA Properties from API
        title: data.title,
        overview: data.overview,
        poster: `${imageRootPath}${data.poster_path}`,
        backdrop: `${imageRootPath}${data.backdrop_path}`,
        credits: data.credits,
        date: data.release_date,
        // !VA Propeties from JSON
        index: record.index,
        cast_with_role: record.cast_with_role,
        cast_to_include: record.cast_to_include,
        wiki: record.wiki,
        imdb: record.dblink
      }
      break;
    case type === 'tv':
      mediaProperties = {
        type: type,
        // !VA Properties from API
        title: data.original_name,
        first_air_date: data.first_air_date,
        last_air_date: data.last_air_date,
        poster: `${imageRootPath}${data.poster_path}`,
        overview: data.overview,
        credits: data.credits,
        episodes: data.number_of_episodes,
        seasons: data.number_of_seasons,
        origin_country: data.origin_country,
        original_language: data.original_language,
        // !VA Properties from JSON
        index: record.index,
        cast_with_role: record.cast_with_role,
        cast_to_include: record.cast_to_include,
          wiki:record.wiki,
        imdb: record.dblink
      }
      // console.log('TV mediaProperties :>> ');
      // console.log(mediaProperties);
      break;
    case type === 'album':
      // !VA Properties from API
      mediaProperties = {
        artist_name: data.name,
        artist_info: data.profile,
        title: data.title,
        type: type,
        artist_image: data.artistimg,
        album_image: data.images[0].resource_url,
        release_date: data.released,
        // !VA Properties from JSON
        index: record.index,
        work_info: record.work_info,
        website: record.website,
        youtube_id: `https://www.youtube.com/embed/${record.youtube_id}`,
        youtube_caption: record.youtube_caption,
        wiki:record.wiki,
        discogs: record.dblink
      }
      break;
    default:
      console.log('Error in setMediaProperties - unknown media type');
    } 
    return mediaProperties;
  }

  export function getMediaComponent(item, type) {
    let card;
    card = (function () {
      if (item.type === 'movie') {
        return <>
        <MovieDetails props={item} />  
        </>
      } else if ( item.type === 'tv') {
          return <>
        <TVDetails media={item} />
          </>
      } else if ( item.type === 'album') {
          return <>
        <AlbumDetails media={item} />
          </>
      } else {
        console.log('ERROR in MakeMediaCard - unknown media type');
      }
    })();
    return card;
  } 
