import { nanoid } from 'nanoid'
import config from './../config/config';

const uploadToServer = async (req, res) => {
    if (req.files === null) {
        return res.status(400).json({ msg: 'No file uploaded' });
      }
    
      const file = req.files.file;
      const firtFileName= nanoid()
    try {
        file.mv(`./public/file-upload/${firtFileName}_${file.name}`, err => {
            if (err) {
              console.error(err);
              return res.status(500).send(err);
            }
            res.json({ fileName: file.name, filePath:`${config.DOMAIN}/public/file-upload/${firtFileName}_${file.name}` });
          });
    } catch (error) {
        
    }
     
    // console.log(req.file)
};


export default{
    uploadToServer,
};

const { google } = require('googleapis');
const fs = require('fs');

const CLIENT_ID = '555455187852-6ug38s305np2k70akjb473q2kp1cnmvs.apps.googleusercontent.com';
const CLIENT_SECRET = 'azW73CCarcrppTF2XpFHtSP9';
const REDIRECT_URI = 'https://developers.google.com/oauthplayground';

const ACCESS_TOKEN = 'ya29.a0AfH6SMDZ-tok5LZuyzjptZcSFrO2WMOV7UKH-zp_TBBz7eaLlzl81VbJ2NJRtufFQzV1K7ldaZuxjCaDK0HnqPVCxoHGSCmtkaC1TTY2CPJDnItQT2H2xXy7UFyfyZvugoVB-HLM-e0Od_1C-EogSr-LUW7r';
const REFRESH_TOKEN = '1//04uA9-Owd0b-cCgYIARAAGAQSNwF-L9IrfOTtVlQxMbQ62rKFl24hAezcFsAFmmdo0w2oYtz2VZGAHYKlVAlInm9KzQGo3TUt88k';

const oauth2Client = new google.auth.OAuth2(
    CLIENT_ID,
    CLIENT_SECRET,
    REDIRECT_URI
);

const TOKEN_PATH = 'token.json';

fs.readFile(TOKEN_PATH, (err, token) => {
    if (err) return getAccessToken(oauth2Client, ()=>{});
    oauth2Client.setCredentials(JSON.parse(token));
});

const drive = google.drive({
    version: 'v3',
    auth: oauth2Client,
});



const uploadFile = async (filePath1) => {
    try {
        const response = await drive.files.create({
            requestBody: {
                name: 'tenluutrendrive', //This can be name of your choice
                mimeType: 'image/jpg/pdf/mp4',
            },
            media: {
                mimeType: 'image/jpg/pdf/mp4',
                body: fs.createReadStream(filePath1),
            },
        });
        // console.log(response.data);
        return generatePublicUrl(response.data.id)

    } catch (error) {
        console.log("err upload to drive: " + error.message);
    }
}


async function deleteFile() {
    try {
        const response = await drive.files.delete({
            fileId: 'YOUR FILE ID',
        });
        // console.log(response.data, response.status);
    } catch (error) {
        console.log(error.message);
    }
}


async function generatePublicUrl(id) {
    try {
        const fileId = id;
        await drive.permissions.create({
            fileId: fileId,
            requestBody: {
                role: 'reader',
                type: 'anyone',
            },
        });

        /* 
        webViewLink: View the file in browser
        webContentLink: Direct download link 
        */
        const result = await drive.files.get({
            fileId: fileId,
            fields: 'webViewLink, webContentLink, id',
        });
        // console.log(result.data);
        return result.data.id
    } catch (error) {
        console.log(error.message);
    }
}

const SCOPES = ['https://www.googleapis.com/auth/drive'];


function getAccessToken(oAuth2Client, code) {
    oAuth2Client.getToken(code, (err, token) => {
        if (err) return console.error('Error retrieving access token', err);
        oAuth2Client.setCredentials(token);
        fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
            if (err) return console.error(err);
            console.log('Token stored to', TOKEN_PATH);
        });
    });
}

const getCode = (oAuth2Client) => {
    const authUrl = oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        prompt: 'consent',
        scope: SCOPES,
    });
    console.log('Authorize this app by visiting this url:', authUrl);
}
// getCode(oauth2Client)
// getAccessToken(oauth2Client, '4/0AX4XfWik7kyMoulYH7pV78RuamesINBHQqtPovT0oxH5uud1pRsnveK6_3XDiwWvLtkPtA')