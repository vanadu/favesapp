import React from 'react';
import ccodes from './json/country-codes.json';
import {getAirYears, nonBreakingSpace} from './helpers/helpers.js';
import LinkIcons from './LinkIcons';

const TVDetails = (props) => {
  // console.log('TVDetails props :>> ');
  // console.log(props);
  const displayLanguage = 'EN_US';
  let actors = [];
    // !VA Use nested destructuring to write out the props that were passed from MediaViewer.js to variables
  const {props: { title, poster, wiki, imdb, credits, cast_with_role, cast_to_include, first_air_date, last_air_date, episodes, origin_country, original_language }} = props;

  // !VA Actors should actually be immutable, see below, but leave it for now.
  // !VA Get the current display language (displayLanguage) to a lowercase 2-char string used in country-codes.json
  const curLang = displayLanguage.substring(0, 2).toLowerCase();

  // !VA Map over origin_country and run getLongCountryName to get the long country name corresponding to the 2-char country code returned from the API based on the current display language. NOTE: the return value of getLongCountryName is returned to the map method, which writes the long country name to work.country.
  let country = origin_country.map(( ocountry ) => getLongCountryName( ocountry ));
  // !VA country is still an array, so convert it to a string and concatenate
  country = country.join( ', ' );

  // !VA The function that produces the long country name that is fed to origin_country.map...
  function getLongCountryName( country ) {
    // !VA Loop through the ccodes JSON array.
    for (const obj of ccodes) {
      // !VA If the current country code matches the last two characters of the full 5 char locale ID, then return the long country name based on the current display language.
      if ( country === obj.code.substring( 3 )) {
        return obj.country[curLang];
      }
    }
  }

  const date = getAirYears(first_air_date, last_air_date);

  const origLang = ccodes.find((obj) =>  obj.code.substring(0,2).toLowerCase() === original_language );

  const language = origLang.language[displayLanguage.substring( 0, 2).toLowerCase()];

  // !VA Actors should actually be immutable but we will mutate it from the API property for now.
  // console.log(`title :>> ${title}; credits.cast :>> ${credits.cast}'; cast_with_role ;>> ${cast_with_role}; cast_to_include :>> ${cast_to_include}`);
  // console.log(title);
  // console.log('credits.cast :>> ');
  // console.log(credits.cast);

  actors = credits.cast;

  // console.log('actors :>> ');
  // console.log(actors);
  // console.log('title :>> ');
  // console.log(title);

  // !VA cast is defined in content.json as a two-item array. The first value is the number of cast members whose role is included in the render output. The second is the number of cast members from the API list of cast members to include in the render output. 
  const castWithRole = cast_with_role;
  // console.log('castWithRole :>> ' + castWithRole);
  const castToInclude = cast_to_include;
  // console.log('cast_to_include :>> ' + cast_to_include);


  // !VA Prune the actors list to only include the number of cast members specified in the cast array in content.json
  let castPruned = [];
  // !VA Push the castToInclude number of actors onto the castPruned array.
  for (let i = 0; i < castToInclude; i++) { 
    castPruned.push(actors[i]); 
  }

// console.log('castPruned :>> ');
// console.log(castPruned);

  actors = castPruned
  // !VA Get the first three actors. These are the leading roles.
  .filter(( castPruned, index ) => index < castWithRole)
  // !VA Append the role in parentheses to the leading actor's names
  .map( actor  => actor.name = `${nonBreakingSpace(actor.name)} (${nonBreakingSpace(actor.character)})`)
  // !VA Concatenate the above array with the following supporting actors names, which do not have the role appended.
  .concat(castPruned
  // !VA Get the names of the supporting actors, i.e. those whose index is greated that two in the cast list.
  .filter(( item, index ) => index >= castWithRole)
  // !VA Return just that name with no modification
  .map( actor  => `${nonBreakingSpace(actor.name)}` ))
  // !VA Join the items in the concatenated array to a string separated by a comma and space.
  .join( ', ' );

  return (
    <>
      <div className="media-content">
        <div className="tv-credits-title-header">
          <h2 className="tv-credits-title-banner">{title}</h2>
        </div>
        <div className="tv-credits-title-date">
          <p>[{date}]</p>
        </div>
        <div className="tv-poster">
            <img src={poster} alt="ALT" className="ui image"/>
        </div>
        <div className="tv-credits-cast">
          <h3 className="tv-credits-cast-header">- Cast -</h3>
          <div className="tv-credits-cast-actors text-centered">
            <p dangerouslySetInnerHTML={{__html: actors}} ></p>
          </div>
        </div>
        <div className="tv-credits-crew">
          <ul className="tv-credits-crew-list">
            <li className="movie-writer" dangerouslySetInnerHTML={{__html: props.writer}}>
            </li>
            <li className="movie-composer" >Total episodes: {episodes}
            </li>
            <li className="movie-composer">Country of origin: {country}
            </li>
            <li className="movie-composer">Original language: {language}
            </li>
          </ul>
        </div>
      </div>
    <LinkIcons wiki={wiki} imdb={imdb} />
    </>
  );
};

export default TVDetails;