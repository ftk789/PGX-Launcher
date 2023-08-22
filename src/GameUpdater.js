const https = require('https');
const fs = require('fs');
const AdmZip = require('adm-zip');
const path = require('path');
const os = require('os');
const { execFile } = require('child_process');


var url = 'https://pgx-news.ftk789.repl.co/downloadwin';



const platform = os.platform();

const desktopPath = path.join(os.homedir(), 'Desktop');

var folderPath = 'PGX'


if (!fs.existsSync(folderPath)) {
  fs.mkdir(folderPath, (err) => {
    if (err) {
      console.error('Error creating folder:', err);
    } else {
      console.log('Folder created successfully:', folderPath);
    }
  });
} else {
  console.log('Folder already exists:', folderPath);
}

var folderPath = path.join(desktopPath, 'PGX');


if (platform === 'win32') {
  var url = 'https://pgx-news.ftk789.repl.co/downloadwin';
  var exeFilePath = path.join(folderPath, 'PGX.exe');
  console.log("The System is " + platform)
} else if (platform === 'darwin') {
  var url = 'https://pgx-news.ftk789.repl.co/downloadmac';
  var exeFilePath = path.join(folderPath, 'PGX.app');

  console.log("The System is " + platform)

} else if (platform === 'linux') {
  console.log("The System is " + platform)

} else {
  console.error('Unsupported operating system.');
  process.exit(1);
}

const Status = document.getElementById("file-progress")



if (fs.existsSync(exeFilePath)) {
  console.log("Game is downloaded.")
}
else{
  fs.readdirSync(folderPath).forEach((file) => {
    const currentFilePath = path.join(folderPath, file);
    const stats = fs.statSync(currentFilePath);
    if (stats.isFile()) {
      fs.unlinkSync(currentFilePath);
    }
  });
}

async function getTextFromBody() {
  const url = 'https://pgx-news.ftk789.repl.co/get';

  try {
    const response = await axios.get(url);
    const text = response.data;
    //console.log(text); // The text from the response body

    // Use <pre> to preserve spaces and line breaks
    document.getElementById("News").innerHTML = '<pre>' + text + '</pre>';

    const match = text.match(/PGX_Update(.*)/);
        if (match && match[1]) {
          var Version = match[1].trim();
          var Version = Version.replace(/\s/g, '');
          var Version = Version + ".zip"
          console.log("Extracted text:", Version);

          // Now you can do further processing with the extracted text here
        } else {
          console.log("No match found for 'PGX_Update'");
        }

    // You can do further processing with the text here
  } catch (error) {
    console.error('Error fetching data:', error.message);
  }
  return Version;
}

var CurrentGameVersion = getTextFromBody();
console.log(CurrentGameVersion)



function createFolderIfNotExists(folderPath) {
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath);
  }
}

function sanitizeFileName(fileName) {
  return fileName.replace(/[?&=]/g, '_'); // Replace ? & = characters with underscores
}

function getFileNameFromURL(url) {
  const matches = url.match(/\/([^\/?#]+)[^\/]*$/);
  if (matches && matches.length > 1) {
    return sanitizeFileName(matches[1]);
  }
  return null;
}

function downloadFile(url, destinationFolder, callback) {
  Status.innerHTML = "Update detected, Updating..."
  document.getElementById("btn-start").disabled = true;
  https.get(url, (response) => {
    if (response.statusCode === 302 || response.statusCode === 301) {
      // Handle redirect
      downloadFile(response.headers.location, destinationFolder, callback);
      return;
    }

    const fileName = getFileNameFromURL(url);
    if (!fileName) {
      console.error('Error parsing filename from URL');
      if (callback) callback(new Error('Invalid URL'));
      return;
    }

    const filePath = path.join(destinationFolder, fileName);
    const file = fs.createWriteStream(filePath);
    let receivedBytes = 0;
    let totalBytes = parseInt(response.headers['content-length'], 10);

    response.on('data', (chunk) => {
      receivedBytes += chunk.length;
      const percentage = ((receivedBytes / totalBytes) * 100).toFixed(2);
      process.stdout.write(`\rDownloading... ${percentage}%`);
      document.getElementById("loading-progress").innerHTML = percentage + "%";
      document.getElementById("loading").style.width = percentage + "%";
    });

    response.pipe(file);
    file.on('finish', () => {
      file.close(() => {
        console.log('\nFile downloaded successfully.');
        if (callback) callback(null, filePath);
      });
    });
  }).on('error', (err) => {
    if (callback) callback(err);
  });
}

function unzipFile(filePath, destinationPath) {
  const zip = new AdmZip(filePath);
  zip.extractAllTo(destinationPath, true);
}

createFolderIfNotExists(folderPath);

const fileName = getFileNameFromURL(url);
getTextFromBody()
.then(CurrentGameVersion => {
  console.log(CurrentGameVersion);
  const filePath = path.join(folderPath, CurrentGameVersion);
  console.log(filePath);
  console.log(fs.existsSync(filePath))
if (!fileName) {
  console.error('Error parsing filename from URL');
} else {
  if (fs.existsSync(filePath)) {
    console.log(`File "${fileName}" already exists in the folder. Checking for updates...`);
    Status.innerHTML = "Checking for updates...";
    unzipFile(filePath, folderPath); // Unzip the existing file
    console.log('File unzipped successfully.');
    Status.innerHTML = "The game is up to date.";
    document.getElementById("btn-start").disabled = false;
  } else {
    // Clear the folder before downloading
    fs.readdirSync(folderPath).forEach((file) => {
      const currentFilePath = path.join(folderPath, file);
      const stats = fs.statSync(currentFilePath);
      if (stats.isFile()) {
        fs.unlinkSync(currentFilePath);
      }
    });

    downloadFile(url, folderPath, (err, downloadedFilePath) => {
      if (err) {
        console.error('Error downloading the file:', err);
      } else {
        unzipFile(downloadedFilePath, folderPath);
        console.log('File unzipped successfully.');
        Status.innerHTML = "The game has been updated successfully."
        document.getElementById("btn-start").disabled = false;
      }
    });
  }
}
})




  const startButton = document.getElementById("btn-start");
  startButton.addEventListener('click', startGame);

  function startGame(){
    const startButton = document.getElementById("btn-start");
    startGame2(startButton)
  }


function startGame2(startButton) {
  startButton.disabled = true;
  execFile(exeFilePath, (error, stdout, stderr) => {
    if (error) {
      console.error('Error:', error);
    } else {
      console.log('stdout:', stdout);
      startButton.disabled = false;
      console.log('stderr:', stderr);
    }
  });
  console.log(exeFilePath)

}


const exitButton = document.getElementById("btn-exit");
exitButton.addEventListener('click', window.close);