const VideoResult = ({ index, info, videoSelect }) => {
    // Decoding HTML (for unescaped characters like "'") and avoiding XSS https://stackoverflow.com/a/34064434/9819103
    function decodeHTML(input) {
        var doc = new DOMParser().parseFromString(input, "text/html");
        return doc.documentElement.textContent;
    }

    return (
        <div 
            className="video-results-div" 
            style={{backgroundColor: `rgb(${120 - 2 * index}, ${80 + 3 * index}, ${170 + 2 * index})`}}
            onClick={() => videoSelect(info)}   // For some reason if not having arrow function videoSelect is called on mount
        >
            <p className="video-title">{info != null ? decodeHTML(info.title) : ""}</p>
            <p className="video-channel">Channel: {info != null ? decodeHTML(info.channel) : ""}</p>
            <img className="video-thumbnail" src={info != null ? info.thumbnail.url : "default.jpg"} alt="YouTube video thumbnail" />
        </div>
    )
}

export default VideoResult
