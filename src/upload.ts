// YouTube API video uploader using JavaScript/Node.js
// You can find the full visual guide at: https://www.youtube.com/watch?v=gncPwSEzq1s
// You can find the brief written guide at: https://quanticdev.com/articles/automating-my-youtube-uploads-using-nodejs
//
// Upload code is adapted from: https://developers.google.com/youtube/v3/quickstart/nodejs

import fs from 'fs';
import readline from 'readline';
import assert from 'assert';
import { Auth, google } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';

type Credentials = {
  installed: {
    client_secret: string;
    client_id: string;
    redirect_uris: string[];
  };
};

// If modifying these scopes, delete your previously saved credentials in client_oauth_token.json
const SCOPES = ['https://www.googleapis.com/auth/youtube.upload'];
const TOKEN_PATH = '../' + 'client_oauth_token.json';

export function uploadVideo(videoFilePath: string, thumbFilePath: string, title: string, description: string, tags: string) {
  assert(fs.existsSync(videoFilePath));
  assert(fs.existsSync(thumbFilePath));

  // Load client secrets from a local file.
  fs.readFile('../client_secret.json', function processClientSecrets(err, content) {
    if (err) {
      console.log('Error loading client secret file: ' + err);
      return;
    }
    // Authorize a client with the loaded credentials, then call the YouTube API.
    authorize(JSON.parse(content.toString()), (auth: Auth.OAuth2Client) => uploadVideoAuthed(auth, videoFilePath, thumbFilePath, title, description, tags));
  });
}

/**
 * Upload the video file.
 *
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
function uploadVideoAuthed(auth: Auth.OAuth2Client, videoFilePath: string, thumbFilePath: string, title: string, description: string, tags: string) {
  const service = google.youtube('v3');

  service.videos.insert(
    {
      auth,
      part: ['snippet,status'],
      requestBody: {
        snippet: {
          title,
          description,
          tags: tags.split(','),
          categoryId: 'Education',
          defaultLanguage: 'en',
          defaultAudioLanguage: 'en',
        },
        status: {
          privacyStatus: 'private',
        },
      },
      media: {
        body: fs.createReadStream(videoFilePath),
      },
    },
    function (err, response) {
      if (err) {
        console.log('The API returned an error: ' + err);
        return;
      }
      console.log(response!.data);

      console.log('Video uploaded. Uploading the thumbnail now.');
      service.thumbnails.set(
        {
          auth: auth,
          videoId: response!.data.id as string,
          media: {
            body: fs.createReadStream(thumbFilePath),
          },
        },
        function (err, response) {
          if (err) {
            console.log('The API returned an error: ' + err);
            return;
          }
          console.log(response!.data);
        },
      );
    },
  );
}

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 *
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(credentials: Credentials, callback: (auth: OAuth2Client) => void) {
  const clientSecret = credentials.installed.client_secret;
  const clientId = credentials.installed.client_id;
  const redirectUrl = credentials.installed.redirect_uris[0];
  const oauth2Client = new google.auth.OAuth2(clientId, clientSecret, redirectUrl);

  // Check if we have previously stored a token.
  fs.readFile(TOKEN_PATH, function (err, token) {
    if (err) {
      getNewToken(oauth2Client, callback);
    } else {
      oauth2Client.credentials = JSON.parse(token.toString());
      callback(oauth2Client);
    }
  });
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 *
 * @param {google.auth.OAuth2} oauth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback to call with the authorized
 *     client.
 */
function getNewToken(oauth2Client: OAuth2Client, callback: (auth: OAuth2Client) => void) {
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });
  console.log('Authorize this app by visiting this url: ', authUrl);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.question('Enter the code from that page here: ', function (code) {
    rl.close();
    oauth2Client.getToken(code, function (err, token) {
      if (err) {
        console.log('Error while trying to retrieve access token', err);
        return;
      }
      oauth2Client.credentials = token!;
      storeToken(token as Credentials);
      callback(oauth2Client);
    });
  });
}

/**
 * Store token to disk be used in later program executions.
 *
 * @param {Object} token The token to store to disk.
 */
function storeToken(token: Credentials) {
  fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
    if (err) throw err;
    console.log('Token stored to ' + TOKEN_PATH);
  });
}
