import axios from 'axios';

// !VA The Movie DB API key is managed in ContentViewer for now, since we need to build the get URL from pieces out of content.json.
// const KEY = '938c55d469841ac3afc6a90a3d774c3d';

const discogsKey='oscQdwisJmIUZvdLBuXI';
const discogsSecret = 'JjdBgFUgCFziYyxNjUEVXUFkhLqGUEkv';

export default axios.create({
  baseURL: 'https://api.discogs.com',
  headers: {
    'Content-Type': 'application/json',
    // Adding this results in a 204 response instead of 200
    // 'User-Agent': 'PersonalWebsite_VanAlbert',
    "Authorization": `Discogs key=${discogsKey}, secret=${discogsSecret}`
  },
  credentials: 'same-origin',
});