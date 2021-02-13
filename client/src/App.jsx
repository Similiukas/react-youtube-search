import './style/style.css';
import { useState, useLayoutEffect, useRef } from 'react';
import Header from './components/Header';
import VideoPrieview from './components/VideoPreview';
import VideoResultsContainer from './components/VideoResultsContainer';

const DEFAULT_RESULT = { title: "Default title", channel: "Default channel", thumbnail: { url: "default.jpg" }, videoID: "tgbNymZ7vqY" };

function App() {
  const [json, setJSON] = useState({ items: Array(20).fill(DEFAULT_RESULT) });
  const [previewClass, setPreview] = useState("video-preview");
  const [resultsClass, setResults] = useState("video-results");
  const [selectedVideoID, setSelectedVideoID] = useState("tgbNymZ7vqY");
  const [height, setHeight] = useState(0);
  const ref = useRef(null);

  /**
   * Making a call to back-end for searching on YouTube
   * @param {string} term term to search for in YouTube
   * @param {string} token next page token
   */
  async function makeSearch(term, token) {
    var p = await fetch(`/api/search?term=${term}&token=${token}`);
    if (p.status == 200) {
      var response = await p.json();
      setJSON(response);
    }
    else console.error("Error in server");
  }

  var delayBool;  // Adding a delay to fetch function so user wouldn't spam a video
  async function videoSelect(videoInfo) {
    if (delayBool)  return 0;
    delayBool = true;
    // UI
    if (previewClass == "video-preview") setPreview(previewClass + " active");
    if (resultsClass == "video-results") setResults(resultsClass + " active");
    setSelectedVideoID(videoInfo.videoID);

    await new Promise(t => setTimeout(t, 1000));  // Delay part
    delayBool = false;

    fetch("/api/preview", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(videoInfo),
    });
  }

  // Layout for video preview height
  useLayoutEffect(() => {
    setHeight(ref.current.clientHeight);
  }, [height]);

  return (
    <div className="App">
        <Header refToDiv={ref} onSearch={(task) => makeSearch(task.text)}/>
        <hr/>
        <VideoPrieview className={previewClass} headerHeight={height} videoID={selectedVideoID}/>
        <VideoResultsContainer className={resultsClass} searchResult={json} serverCall={makeSearch} videoSelect={videoSelect}/>
    </div>
  );
}

export default App;
