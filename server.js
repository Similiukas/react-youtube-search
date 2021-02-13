const express = require('express');
const fetch = require('node-fetch');
const helmet = require('helmet');
const cors = require('cors');
const compression = require('compression');
const path = require('path');
const app = express();
const SaveLogs = require("./lib/SaveClient");

// app.use(helmet());       // Preventing vulnerabilites. However with these turned on, Firefox blocks React inline scripts
// app.use(cors());         // Even if REACT_APP_INLINE_RUNTIME_CHECK .env var is false. (Then Chrome allows but Firefox blocks it)
app.use(compression());     // Compressing requests
// For getting the POST request payload as json file
app.use(express.json());
app.use(express.static(path.join(__dirname, 'client/build')));

const YT_API_KEY = process.env.YT_API_KEY;
const RESULTS_PER_PAGE = 20;
// Main GET request for search
app.get("/api/search", (req, res) => {
    if (req.query.term == null){
        SaveLogs.Writer(true, "Teapot Error", req);
        res.status(418).send("I'm a Teapot :) (But actually just wrong input. Term can not be null)");
    }
    else {
        SaveLogs.Writer(false, `Making a youtube search with term: (${req.query.term}) and token: (${req.query.token})`, req)
        .then((results) => {
            console.log("Success writing log", results);
            searchYoutube(req.query.term, req.query.token)
            .then(response => {
                res.status(200).json(response);
            })
            .catch(error => {
                console.error("Error from yt search:", error);
                SaveLogs.Writer(true, `Error searching using YouTube search [${error}]`, req);
                res.status(500).send("There has been an error searching in YouTube. Whoopsie");
            })      
        })
        .catch((err) => console.error("Error writing a file:", err));
    }
})

// If user pressed on a video for preview
app.post("/api/preview", (req, res) => {
    SaveLogs.Writer(false, `Video Preview of (${JSON.stringify(req.body)})`, req)
    res.status(200).send("Got that");
})

function searchYoutube(term, token) {    
    return new Promise((resolve, reject) => {
        fetch(`https://youtube.googleapis.com/youtube/v3/search?part=snippet${token != "undefined" ? "&pageToken="+token : ""}&maxResults=${RESULTS_PER_PAGE}&q=${encodeURI(term)}&key=${YT_API_KEY}`, {
            headers: {
                'Accept': 'application/json' 
            }
        })
        .then(response => response.json())
        .then(data => {
            console.log("Success connecting:", data);
            if (data?.error)    reject(JSON.stringify(data));
            var obj = { items: []};
            for (let i = 0; i < RESULTS_PER_PAGE; ++i) {
                obj.items[i] ??= {
                    title: data.items[i].snippet.title,
                    thumbnail: data.items[i].snippet.thumbnails.medium,
                    channel: data.items[i].snippet.channelTitle,
                    videoID: data.items[i].id.videoId
                };
            }
            obj.query ??= term;
            obj.nextPageToken ??= data.nextPageToken;
            resolve(obj);
        })
        .catch((error) => {
            SaveLogs.Writer(true, `Error connecting to YouTube (searchYoutube()): ${error}`);
            reject(error)
        })
    })

}


app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname+'/client/build/index.html'));
})

const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log("Server listening on port ", port);
})