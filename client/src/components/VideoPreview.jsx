import { useState, useEffect } from 'react';

const VideoPreview = ({ className, headerHeight, videoID }) => {
    const [width, setWidth] = useState(headerHeight); // Main gif grid is 90 viewport width for styling
    // console.log(headerHeight);
    //  Resizing popup gif
     useEffect(() => {
        // function resizing() { setWidth(headerHeight); }
        // console.log("Hello?");
        window.addEventListener('resize', () => setWidth(headerHeight));
        // Cleaning up to prevent memory leak (https://www.pluralsight.com/guides/re-render-react-component-on-window-resize)
        // return _ => { window.removeEventListener('resize', resizing); }
    }, [headerHeight]);

    return (
        <div className={className}>
            <iframe 
                height={window.innerWidth > 1025 ? window.innerHeight - headerHeight - 15 : 'auto'}  // using 4:3 ratio
                src={`https://www.youtube.com/embed/${videoID}`}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen />
        </div>
    )
}

export default VideoPreview
