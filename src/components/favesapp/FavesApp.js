import React, { useState, useRef, useEffect, useCallback } from 'react';
import content from './json/content.json';
import { indexArray, setMediaProperties } from './helpers/helpers.js';
import { getApiData } from './services/getApiData.js';
import MovieDetails from './MovieDetails';
import AlbumDetails from './AlbumDetails';
import TVDetails from './TVDetails';

const FavesApp = () => {

  /* !VA  
  Status: 6735bd2 master
I was finally finally able to render cards based on the JSON records, i.e. individual cards. There is no error when up-scrolling after new records/cards have scrolled into view. However, there's still something funky about it structurally. Or maybe not:
* on init, the for loop in the first useEffect hook calls gets the first three records, passes each record to callApi, which then converts the record to a media card, and adds each card to the cards piece of state. That piece of state is then rendered. So there is a chain of record => card => cards on init that has to be replicated for each record to be added. 
* When the scrollObserver is invoked, the next record is identified and added to the newRecord piece of state. In the following useEffect hood, if a newRecord exists, then that record is passed to callApi, which converts the new record to a card and adds it to the cards piece of state. What I don't yet understand is the role of setNewRecords in that useEffect hook. It appears that its only purpose is to invoke the rersender, because if it's omitted, no new cards are added.  I think that is the cause of the extra renders. That is necessary because that useEffect hook determines the conditions under which callAPI is invoked, i.e. if newRecord.length === newRecord.index. But that was there prior to refactoring the code to render cards, not records. Needs to be reevaluated. Apparently that whole useEffect hook is there to make sure the key is properly populated with the index - but that can probably be done somewhere else now. Committing these comments and taking a break...
  
   */

  // !VA The app initializes with n media cards displayed, whereby n = initRecordCount. The nth record is displayed below the fold, so a scrollbar appears on the page. Scrolling down invokes the scrollObserver callback when the bottom boundary of the nth record enters the viewport. Initially, though, no scroll action has taken place on initialization, so only n media cards are displayed.
  let initRecordCount = 1;
  // !VA source is the content.json list with the index property added, which provides a unique sequential identifier to use as the key at render. NOTE: This source list is an array, not a ref, although a duplicate source list is also defined with useRef to prevent an infinite loop in the useEffect hook containing the for loop that calls the initial media cards displayed on page load.
  const source = indexArray([ ...content ]);
  // !VA intersectionRef is the bottom boundary of each rendered media card, watched by IntersectionObserver to trigger an action when it enters the viewport.
  const intersectionRef = useRef(null);
  // !VA newRecord - Piece of state to hold the record to be added in the scrollObserver method 
  const [ newRecord, setNewRecord ] = useState(null);
  // !VA newRecords - Piece of state to hold the updated array of records to display after a new record is added
  const [ newRecords, setNewRecords ] = useState(source.slice( 0, initRecordCount));
  // !VA This is deprecated, but if you don't wrap the useEffect with the for loop in a custom hook, you have to put the source content array in a ref, otherwise an infinite render loop will ensue. 
  // const sourceref = useRef(indexArray([ ...content ]));
  // !VA cards - the piece of state containing the array of cards to render
  const [ cards, setCards ] = useState([]);



  // !VA PROCESSING THE INITIAL CARDS TO RENDER (number of cards = initRecordCount )
  // !VA For the first n records in the source array (whereby n = initRecordCount) get the corresponding API data, run setMediaProperties to return the merged API/JSON data to display on the media card, and set the returned cards to the 'cards' piece of state. The useEffect within the custom useGetInitialCards hook only runs once, whereby each iteration of the for loop appends the current return from setMediaProperties to the cards state array. 
  const callApi = useCallback(
    (record) => {
      getApiData(record)
      .then(( Responses )=> {
        setCards(cards => ([ ...cards, setMediaProperties(Responses, record)]));
      })
      .catch(errors => {
        errors = 'ERROR - Data for this media item could not be retrieved'
      })
    },
    [ ],
  );

  // !VA The for loop fetches the initial n cards to display, where n = initRecordCount. Wrap this loop in a custom hook to eliminate the need to include dependencies in the useEffect hook depndency array as per this eslint warning: "React Hook useEffect has unnecessary dependencies: 'callApi', 'and 'initRecordCount'. Outer scope values like 'initRecordCount' aren't valid dependences because mutating them doesn't re-render the component." Also, wrapping the useEffect in a custom hook eliminates the need to include the source content array as a ref. Without the custom hook, if you use the source array instead of a ref, eslint prompts to include the source array as a dependency - but that always generates an infinite render loop. So you either have to wrap it in a custom hook or ignore the eslint warning.
  function useGetInitialCards() {
    useEffect(() => {
      for (let i = 0; i < initRecordCount; i++) {
        callApi(source[i])
      }
    }, [ ]);
  }
  useGetInitialCards();


  // !VA PROCESSING INFINITE-SCROLL CARDS DISPLAYED USING INTERSECTION OBSERVER
  // !VA On down-scroll, when the bottom boundary of the nth record enters the viewport, the value of the IntersectionObserver entries is greater than zero and the actions in that condition of the scrollObserver method are invoked, i.e. the index of the bottom-most record in the list queried and based on that index, the next record in the source list is set to state
  // !VA Note that en.intersectionRatio is always 0 on the up-scroll. 
  const scrollObserver = useCallback(
    node => {
      new IntersectionObserver(entries => {
        entries.forEach(en => {
          // let curNode = node.children[0].children[0].children[0].innerHTML;
          // console.log(`${curNode}: >> ${en.isIntersecting}`);
          if (en.intersectionRatio > 0) {
            // console.log('scrollObserver node > 0 :>> ' + curNode);
            // !VA currentRecord index is the last node in the children collection of the nodes' parent.
            const currentRecordIndex  = [...node.parentNode.children].indexOf(node);
            // console.log('currentRecordIndex :>> ' + currentRecordIndex);
            // !VA Set the next record to the newRecord piece of state
            setNewRecord(source[currentRecordIndex + 1]);
          } else {
            // console.log('scrollObserver node = 0 :>> ' + node.children[0].children[0].children[0].innerHTML);
            // !VA What to do here if the entries are not greater than zero
            // console.log('intersectionRatio = 0');
          }
        });
      }).observe(node);
    }, [ source ],
  );

  // !VA Invoke the scrollObserver to watch the bottom boundary of each record to determine whether it crosses into the viewport.
  useEffect(() => {
    if (intersectionRef.current) {  
      scrollObserver(intersectionRef.current);
    }
  }, [scrollObserver, intersectionRef]);

  // !VA If newRecord is not null, then it has been added to state by the scrollObserver method, indicating that the user has scrolled the page and the app needs to be rerendered with the next record in the source list. If the up-scroll causes the bottom boundary of a record to cross the viewport boundary, then on the subsequent down-scroll, React will add that record to the end of the list again, causing a duplicate record render and a duplicate key conflict. To fix this, when adding records, determine if the record being added is already in the list, and if it is, don't add it. To prevent adding already-existing records to the list when the user scrolls up and then down again, only add the newRecord to state if the current record index is equal to the count of existing records in newRecords. This prevents duplicate records from being added, and also prevents React from trying to add a record when the last record in the list is reached.
  useEffect(() => {
    // !VA If scrollObserver has add a new record AND the index of the newRecord is equal to the item count in the newRecords array...
    if (newRecord && newRecords.length === newRecord.index) {
        // !VA ...pass the record to callApi to merge the record data with the API data and generate the media card. From this point on, the RENDERED element is no longer the RECORD, but the CARD. 
        callApi(newRecord);
        // !VA Add the newRecord to the array of newRecords in state. Although the records are not rendered, they are still being WATCHED by scrollObserver. That might be something to reconsider, but for now, it works albeit with perhaps an extra render cycle since the setCards function results in a re-render that is actually unnecessary.
        setNewRecords( newRecords => [ ...newRecords, newRecord]);
    }
  }, [ newRecord, newRecords.length, callApi ]);

  // !VA Not using state for opacity - not sure if this is good React practice to directly access the DOM as below... 
  // const [opacity, setOpacity] = useState([]);

  // !VA isIntersecting also uses IntersectionObserver, but regulates the fadein/fadeout effect, so we keep this separate from the scrollObserver function, which is responsible for adding new cards.  
  const isIntersecting = useCallback(
    () => {
      // !VA Short format for the opacity values  
      const { format } = new Intl.NumberFormat("en-US", { maximumFractionDigits: 2 });
      // !VA Get the current media card container, defined as a ref in the JSX.
      const el = intersectionRef.current;
      // !VA On initial render, the el will be its initial value, i.e. null, so cull out the null.
      if (el) {
        // !VA Get the parent of the media card, i.e. the container element of all the media cards. 
        const parent = el.parentNode;
        // !VA Loop through the siblings of the current media card so they can all be observed for intersection with the viewport.
        for (const child of parent.children) {
          // !VA IntersectionObserver accepts a callback as argument 1, so we use the callback pattern with an inline function that then serves as the object of the .observe method. For each for/of iteration, the current child is passed to the .observe method - this gives us intersection data on all the current media card's siblings.
          new IntersectionObserver(entries => {
            // !VA opcty will hold the opacity value
            let opcty;
            // !VA the entries object is an array of a single item in which all the IntersectionObserver properties reside. Shorten it to en for readability.
            const en = entries[0];
            // !VA The default intersectionRatio, which is the ratio of the intersectionRect area (intersectionarea) to the boundingClientRect area (boundingarea), results in the cards fading in too slowly. The fade needs to finish by the time the cards are about half-way across the viewport border. So we change the boundingarea to (boundingClientRect.width *  boundingClientRect.height / 1.5) whereby the divisor sets the opacity fade speed. 
            const boundingarea = (en.boundingClientRect.height * en.boundingClientRect.width ) / 1.5;
            const intersectionarea = en.intersectionRect.height * en.intersectionRect.width;
            // !VA If the remainder of the division is greater than 1, discard the remainder to ensure that the opacity isn't a value greater than one. Otherwise, the division yields a decimal fraction, i.e. a valid opacity value.
            intersectionarea / boundingarea > 1 ? opcty = 1 : opcty = intersectionarea / boundingarea;
            // !VA Truncate the decimal fraction to 2 decimal places.
            en.target.style.opacity = format(opcty);
          }).observe(child);
        }
      }
    },
    [ ],
  );
  
  // !VA Scroll function to call isIntersecting, which applies the fade to cards entering/leaving the viewport.
  useEffect(() => {
    function watchScroll() {
      window.addEventListener("scroll", isIntersecting);
    }
    watchScroll();
    // Remove listener to prevent memory leaks
    return () => {
      window.removeEventListener("scroll", isIntersecting);
    };
  }, [ isIntersecting ]);

  

    // !VA Render/rerender the cards. The intial render includes only the first n cards (where n is initRecordCount). Subsequent renders include the cards from the previous render plus the card corresponding to the next record in the source list.
  let renderedItems = cards.map(( card) => {
    return <div className="media" key={card.index} ref={intersectionRef} >
      {card.type === 'movie' ?  <MovieDetails props={card} /> : null }
      {card.type === 'tv' ?  <TVDetails props={card} /> : null }
      {card.type === 'album' ?  <AlbumDetails props={card} /> : null }
    </div>
  });

  return (
      <>
        {renderedItems}
      </>
  );
};

export default FavesApp;