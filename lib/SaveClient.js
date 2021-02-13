const fs = require("fs");

var errorLog;
var accessLog;

/**
 * Reading the log files and storing them into variables (so woulnd't need to read them constantly)
 */
async function ReadLogs() {
    await fs.readFile("./logs/error.log", "utf-8", (err, data) => {
        if (err)    console.error(`Error reading error(dot)log file: ${err}`);
        errorLog = data;
    });
    await fs.readFile("./logs/access.log", "utf-8", (err, data) => {
        if (err)    console.error(`Error reading access(dot)log file: ${err}`);
        accessLog = data;
    });
}

/**
 * Writing data to the log files
 * @param {boolean} error boolean for error or access log
 * @param {String} data data to write to the log file
 */
function WritingAFIle(error, data) {
    return new Promise((resolve, reject) => {
        let file = error ? "error.log" : "access.log";
        fs.writeFile(`./logs/${file}`, data, (err) => {
            // If something went wrong writing the file
            if(err) reject(`Something went wrong writing a file: ${err}`);
            resolve("File written");
        })
    })
}
    
/**
 * Logging user data to files
 * @param {boolean} error boolean whether error log or not
 * @param {*} message additional message to write to a file
 * @param {*} httpRequest additional HTTP request
 */
async function CallingWriter(error, message = "", httpRequest = "") {
    let getClientAddress = "NONE";
    let userAgent = "NONE";
    if (httpRequest != ""){
        getClientAddress = (httpRequest.headers['x-forwarded-for'] || '').split(',')[0] || httpRequest.socket.remoteAddress;
        userAgent = httpRequest.headers['user-agent'];
    }
    let time = new Date().toLocaleString();

    let data;
    if (error) {
        data = errorLog + `\n[${time}]An Error of (${message})\nUser used an URL of (${httpRequest.originalUrl})\nThe user which got the error with IP: (${getClientAddress})\nUser Client: (${userAgent})`;
        errorLog = data;
    }
    else {
        data = accessLog + `\n[${time}]User connecting (${message})\nUser ip: (${getClientAddress})\nUser client: (${userAgent})`;
        accessLog = data;
    }

    return await WritingAFIle(error, data);
}

ReadLogs(); // Reading the logs on init
module.exports.Writer = CallingWriter;