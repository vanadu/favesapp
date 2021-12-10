import axios from 'axios';
import movieinfo from '../apis/movieinfo';
import tvinfo from '../apis/tvinfo';
import musicinfo from '../apis/musicinfo';

export function getApiData(record) {
  // console.log('makeApiCall record :>> ');
  // console.log(record);
  // !VA There is only one apiCall made per records record passed
  let axiosGet = [];
  // !VA The responses from the axios.all call.
  // !VA Destructure out the properties required from each item  to make the apiCall
  const { api_source, media_type, work_id, artist_id } = record;
  // !VA Make the API call. In each case, the call is made with axios.all, so we set axiosGet variables to define the properties for the get request.
    // !VA If the current call is a movie or tv record
    if ( api_source === 'tmdb' ) {
      // !VA Query strings for TMDB API call
      const tmdbKEY = '938c55d469841ac3afc6a90a3d774c3d';
      const tmdbAuthStr = `?api_key=${tmdbKEY}`;
      const tmdbAppendStr = `&append_to_response=credits,images`;
      // !VA Set the properties for the axios get request
      if ( media_type === 'movie') {
        axiosGet[0] = movieinfo.get( work_id + tmdbAuthStr + tmdbAppendStr );
      } else if ( media_type === 'tv') {
        axiosGet[0] = tvinfo.get( work_id + tmdbAuthStr + tmdbAppendStr );
      } else {
        console.log('ERROR in makeApiCall - unknown media_type');
      }
    // !VA For calls to discogs, we make two calls - one to the artists endpoint for artist data and one to the releases endpoint for album data.
    } else if ( api_source === 'discogs') {
      axiosGet[0] = musicinfo.get( `/artists/${artist_id}`)
      axiosGet[1] = musicinfo.get( `/releases/${work_id}`)
    } else {
      console.log('ERROR in makeApiCall - unknown api_source ');
    }
  // !VA Destructure out the properties required from each item  to make the apiCall
  return new Promise((resolve) => {
    let Responses;
    setTimeout(() => {
      resolve(
        axios.all(axiosGet)
          .then(axios.spread((...responses) => {
          const { api_source, media_type } = record;
          const firstCall = responses[0]
          const secondCall = responses[1]
          if ( api_source === 'tmdb') {
            // !VA Get the TMDB response.data - there is only one.
            Responses = firstCall.data;
          } else if ( api_source === 'discogs') {
            // !VA Get the Discogs response.data - there are two responses, one for artist and one for release. For the artist data, we only need the artist/band name, members, profile, and artist image, so destructure those out of the response. For the image, we need to create a new property with a different name or it will be overwritten by the images property in the release data when we merge the two objects.
            const { name, members, profile } = firstCall.data;
            const artistimg = firstCall.data.images[0].resource_url;
            // !VA For the second call, we take the entire object, so merge the properties from the first call with the object from the second call.
            Responses = { name, members, profile, artistimg, ...secondCall.data};
          }
          Responses.type = media_type;
          return Responses;
          }))
      )
    }, 500 )
  });
}