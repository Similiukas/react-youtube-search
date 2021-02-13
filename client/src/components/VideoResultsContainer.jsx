import { useState, useEffect } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import VideoResult from './VideoResult';

const VideoResults = ({ className, searchResult, serverCall, videoSelect }) => {
    const [searchItemsArray, setState] = useState(Array.from({ length: searchResult.items.length }));
    const [searchItems, setSearchItems] = useState(searchResult.items);
    const [previousResult, setPreviousItems] = useState(null);

    useEffect(() => {
        if (previousResult != null && previousResult.query === searchResult.query) {    // Loading more
            setSearchItems(previousResult.items.concat(searchResult.items));
            setState(Array.from({ length: previousResult.items.length + searchResult.items.length }));
        }
        else {
            setSearchItems(searchResult.items);
            setState(Array.from({ length: searchResult.items.length }));
        }
    }, [searchResult])

    async function loadMore() {
        if (previousResult == null) {
            setPreviousItems(searchResult);
        }
        else setPreviousItems({ items: searchItems, query: searchResult.query });

        await serverCall(searchResult.query, searchResult.nextPageToken);
    }

    return (
        <InfiniteScroll
            className={className}
            dataLength={searchItemsArray.length}
            next={loadMore}
            hasMore={searchResult.items[0].title != "Default title" && searchResult.items[0].channel != "Default channel"}  // If trying to load more on default values
            loader={<h4>Loading...</h4>}
        >
            {searchItemsArray.map((i, index) => (
                <VideoResult key={index} index={index} info={searchItems[index]} videoSelect={videoSelect}/>
            ))}
        </InfiniteScroll>
    )
}

export default VideoResults
