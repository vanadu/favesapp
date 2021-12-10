import React from 'react';
import LinkIcons from './LinkIcons';
import {getYear, nonBreakingSpace} from './helpers/helpers.js';


const MovieDetails = (props) => {

  // console.log('MovieDetails props :>> ');
  // console.log(props);

  // !VA Use nested destructuring to write out the props that were passed from MediaViewer.js to variables
  const {props: { title, cast_with_role, cast_to_include, date, poster, wiki, imdb, credits }} = props;
  // !VA Actors should actually be immutable, see below, but leave it for now.
  let actors = [];

  // Get the 4 char date from the long date string
  const year = getYear(title, date);

  // !VA Actors should actually be immutable but we will mutate it from the API property for now.
  actors = credits.cast;

  // !VA cast is defined in content.json as a two-item array. The first value is the number of cast members whose role is included in the render output. The second is the number of cast members from the API list of cast members to include in the render output. 
  const castWithRole = cast_with_role;
  const castToInclude = cast_to_include;

  // !VA Prune the actors list to only include the number of cast members specified in the cast array in content.json
  let castPruned = [];
  // !VA Push the castToInclude number of actors onto the castPruned array.
  for (let i = 0; i < castToInclude; i++) { 
    castPruned.push(actors[i]); 
  }


  // !VA Based on the castPruned array, get the cast name, with the name of the role played included for the first n actors in the actors list (n = castWithRole)
  actors = castPruned
    // !VA Get the pruned list of actors.
    .filter(( castPruned, index ) => index < castWithRole)
    // !VA Append the role in parentheses to the leading actor's names
    // .map( actor  => actor.name = `${nonBreakingSpace(actor.name)} (${nonBreakingSpace(actor.character)})`)
    .map((actor) => {
      actor.lead = `${nonBreakingSpace(actor.name)} (${nonBreakingSpace(actor.character)})`;
      return actor.lead;
    })
    // !VA Concatenate the above array with the following supporting actors names, which do not have the role appended.
    .concat(castPruned
    // !VA Get the names of the supporting actors, i.e. those whose index is greated that two in the cast list.
    .filter(( item, index ) => index >= castWithRole)
    // !VA Return just that name with no modification
    .map( actor  => `${nonBreakingSpace(actor.name)}` ))
    // !VA Join the items in the concatenated array to a string separated by a comma and space.
    .join( ', ' );



  // !VA Process the crew credits
  // !VA Define the jobs to include in the render
  const exec_str = 'Executive Producer';
  const producer_str = 'Producer';
  const director_str = 'Director';
  const composer_str = 'Original Music Composer';
  const screenplay_str = 'Screenplay';

  // !VA Prune the crew object to only include the job description strings above that correspond to used props. 
  const jobs = [ producer_str, director_str, exec_str, composer_str, screenplay_str]
  const crew = credits.crew.filter(( item) => jobs.includes(item.job));
  // !VA Function to return any crew items whose job property equals the jobname argument.
  const pruneByJob = (crew, jobname ) => crew.filter(item => item.job === jobname);

  // !VA These variables will be populated with the given names of the people in these jobs from the API 
  let exec, producer, screenplay, director, composer;

  // !VA We only want the top-level producer displayed, so if there's one or more Executive Producers, merge them into the exec variable, write the prop and do NOT write the producer prop to JSX. Otherwise, write the producer prop with the producer to JSX. 
  if (crew.map(item => item.job === exec_str ).includes(true)) {
    exec = `${exec_str}: ${pruneByJob(crew, exec_str).map(item => `${nonBreakingSpace(item.name)}`).join(', ')}`;
  } else {
    producer = pruneByJob(crew, producer_str).map(item => `${nonBreakingSpace(item.name)}`).join(', ');
    producer ? producer = `Producer: ${producer}` : producer = null;
  }

  // !VA This could be DRYer but let's keep these separate for readability rather than try to refactor this logic into a single function.  
  // !VA If the job is listed in the crew credits, populate the prop and render, otherwise return null and render nothing. 
  let jobname = '';
  jobname = 'Screenplay';
  screenplay = pruneByJob(crew, jobname).map(item => `${nonBreakingSpace(item.name)}`).join(', ');
  screenplay ? screenplay = `${jobname}: ${screenplay}` : screenplay = null;

  jobname = 'Director';
  director = pruneByJob(crew, jobname).map(item => `${nonBreakingSpace(item.name)}`).join(', ');
  director ? director = `${jobname}: ${director}` : director = null;

  jobname = 'Original Music Composer';
  composer = pruneByJob(crew, jobname).map(item => `${nonBreakingSpace(item.name)}`).join(', ');
  composer ? composer = `Music Composer: ${composer}` : composer = null;


  // !VA Render the JSX
  return (
    <>
      <div className="media-content">
        <div className="movie-credits-title-header">
          <h2 className="movie-credits-title-banner">{title}</h2>
        </div>
        <div className="movie-credits-title-date">
          <p>[{year}]</p>
        </div>
        <div className="movie-poster">
            <img src={poster} alt="ALT" className="ui image"/>
        </div>
        <div className="movie-credits-cast col-right">
          <h3 className="movie-credits-cast-header">- Cast -</h3>
          <div className="movie-credits-cast-actors text-centered">
            <p dangerouslySetInnerHTML={{__html: actors}} ></p>
          </div>
        </div>
        <div className="movie-credits-crew">
          <ul className="movie-credits-crew-list">
            <li className="movie-director" dangerouslySetInnerHTML={{__html: director}}>
            </li>
            <li className="movie-exec" dangerouslySetInnerHTML={{__html: exec}}>
            </li>
            {/* VA! producer (including innerHTML) output conditionally in component if no Executive Producer.  */}
            {/* <div dangerouslySetInnerHTML={{__html: producer}} /> */}
            <li dangerouslySetInnerHTML={{__html: producer}}></li>
            <li className="movie-screenplay" dangerouslySetInnerHTML={{__html: screenplay}}>
            </li>
            <li className="movie-composer" dangerouslySetInnerHTML={{__html: composer}}>
            </li>
          </ul>
        </div>
      </div>
      <LinkIcons wiki={wiki} imdb={imdb} />
    </>
  );
};

export default MovieDetails;