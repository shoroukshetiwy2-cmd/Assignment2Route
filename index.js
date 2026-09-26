const path = require("path");

// Q1
function showCurrentPath() {
    console.log({
        File: __filename,
        Dir: __dirname
    });
}

showCurrentPath();


// Q2
function getFileName(filePath) {
    return path.basename(filePath);
}

console.log(getFileName("/user/files/report.pdf"));


// Q3
function buildPath(pathObject) {
    return path.format(pathObject);
}

console.log(
    buildPath({
        dir: "/folder",
        name: "app",
        ext: ".js"
    })
);


// Q4
function getExtension(filePath) {
    return path.extname(filePath);
}

console.log(getExtension("/docs/readme.md"));


// Q5
function parsePath(filePath) {
    const parsedPath = path.parse(filePath);

    return {
        Name: parsedPath.name,
        Ext: parsedPath.ext
    };
}

console.log(parsePath("/home/app/main.js"));
// Q6
function checkAbsolute(filePath) {
    return path.isAbsolute(filePath);
}

console.log(checkAbsolute("/home/user/file.txt"));


// Q7
function joinSegments(...segments) {
    return path.join(...segments);
}

console.log(joinSegments("src", "components", "App.js"));


// Q8
function resolvePath(relativePath) {
    return path.resolve(relativePath);
}

console.log(resolvePath("./index.js"));


// Q9
function joinTwoPaths(path1, path2) {
    return path.join(path1, path2);
}

console.log(joinTwoPaths("/folder1", "folder2/file.txt"));


// Q10
const fs = require("fs");

function deleteFile(filePath) {
    fs.unlink(filePath, (err) => {
        if (err) {
            console.log("Error deleting file:", err.message);
            return;
        }

        console.log(`${path.basename(filePath)} is deleted.`);
    });
}

deleteFile("./deleteMe.txt");
// Q11
function createFolder(folderName) {
    if (!fs.existsSync(folderName)) {
        fs.mkdirSync(folderName);
    }

    console.log("Success");
}

createFolder("./newFolder");


// Q12
const EventEmitter = require("events");
const eventEmitter = new EventEmitter();

eventEmitter.on("start", () => {
    console.log("Welcome event triggered!");
});

eventEmitter.emit("start");


// Q13
eventEmitter.on("login", (username) => {
    console.log(`User logged in: ${username}`);
});

eventEmitter.emit("login", "Ahmed");


// Q14
function readFileSync(filePath) {
    const content = fs.readFileSync(filePath, "utf8");
    console.log(`The file content => "${content}"`);
}

readFileSync("./notes.txt");


// Q15
function writeFileAsync(filePath, content) {
    fs.writeFile(filePath, content, (err) => {
        if (err) {
            console.log("Error writing file:", err.message);
            return;
        }

        console.log("File written asynchronously.");
    });
}

writeFileAsync("./async.txt", "Async save");
// Q16
function checkDirectoryExists(directoryPath) {
    return fs.existsSync(directoryPath);
}

console.log(checkDirectoryExists("./notes.txt"));


// Q17
const os = require("os");

function getOSInfo() {
    return {
        Platform: os.platform(),
        Arch: os.arch()
    };
}

console.log(getOSInfo());


// Q18
function readFileInChunks(filePath) {
    const readStream = fs.createReadStream(filePath, {
        encoding: "utf8"
    });

    readStream.on("data", (chunk) => {
        console.log("Chunk:", chunk);
    });

    readStream.on("error", (err) => {
        console.log("Error reading file:", err.message);
    });
}

readFileInChunks("./big.txt");


// Q19
function copyFileUsingStreams(sourcePath, destinationPath) {
    const readStream = fs.createReadStream(sourcePath);
    const writeStream = fs.createWriteStream(destinationPath);

    readStream.pipe(writeStream);

    writeStream.on("finish", () => {
        console.log("File copied using streams");
    });

    readStream.on("error", (err) => {
        console.log("Error:", err.message);
    });
}

copyFileUsingStreams("./source.txt", "./dest.txt");


// Q20
const zlib = require("zlib");
const { pipeline } = require("stream");

function compressFile(sourcePath, destinationPath) {
    pipeline(
        fs.createReadStream(sourcePath),
        zlib.createGzip(),
        fs.createWriteStream(destinationPath),
        (err) => {
            if (err) {
                console.log("Pipeline failed:", err.message);
                return;
            }

            console.log("File compressed successfully");
        }
    );
}

compressFile("./data.txt", "./data.txt.gz");