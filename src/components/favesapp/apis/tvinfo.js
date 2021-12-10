import axios from 'axios';

// !VA The Movie DB API key is managed in ContentViewer for now, since we need to build the get URL from pieces out of content.json.
// const KEY = '938c55d469841ac3afc6a90a3d774c3d';

export default axios.create({
  baseURL: 'https://api.themoviedb.org/3/tv/',
});