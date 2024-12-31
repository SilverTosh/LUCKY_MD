const fs = require('fs-extra');
const { Sequelize } = require('sequelize');
if (fs.existsSync('set.env'))
    require('dotenv').config({ path: __dirname + '/set.env' });
const path = require("path");
const databasePath = path.join(__dirname, './database.db');
const DATABASE_URL = process.env.DATABASE_URL === undefined
    ? databasePath
    : process.env.DATABASE_URL;
module.exports = { session: process.env.SESSION_ID || 'eyJub2lzZUtleSI6eyJwcml2YXRlIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoieURlS0tpZFRCVWo1YlBHTHBtY1g3ZU1iMFBFRW1zT2NWZlNmZDd2M08wRT0ifSwicHVibGljIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiYUk1QXBBWVZDWGVJUDZBUUVEMktEUVV4QUFjNVFPUTF4NnZzblBoeDdDVT0ifX0sInBhaXJpbmdFcGhlbWVyYWxLZXlQYWlyIjp7InByaXZhdGUiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJ3TWJrczNYUitEWjhEL2pHMkw1UURHay9hdlFwMWVuWndtM3FFbXV6QVU0PSJ9LCJwdWJsaWMiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJJUnBrUGRLMU5BNUM2QTRuU2hzMGRVaGRkcTdyL3RUZS90N21aL2hwWmdJPSJ9fSwic2lnbmVkSWRlbnRpdHlLZXkiOnsicHJpdmF0ZSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6ImFEZWlVM3dZcnp4SzNwV1JqYy9tZ2xUb1cvc05maWZlTXlEUnZWMWR1MWM9In0sInB1YmxpYyI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6Im1VR3ZZM21vUmhYelRQSVJTUzc4Y0R4ZERsRm96djU3WTNJdzc0b3hHbVk9In19LCJzaWduZWRQcmVLZXkiOnsia2V5UGFpciI6eyJwcml2YXRlIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiR0RkRGF1WHZUcm53bWJXKzdJRm8zTysrc3I2OUZzb0tkT0g4ejg3N1BHUT0ifSwicHVibGljIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoicHcya2lEWUpUbFZNK25sVStYTGJJUXFBVTR0anFYVXFzcUtTck00Snh3QT0ifX0sInNpZ25hdHVyZSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6Ik1VRTdjOVBzMVpLQ25JdjBrdXFrWm1aLzdOV21hZFlzTElCQmo0L2VSWHFEb3BPQVY2R29jTnlVc015Si9lcE5xL204R25pT3BzUUtvSDF2b2kyaUR3PT0ifSwia2V5SWQiOjF9LCJyZWdpc3RyYXRpb25JZCI6MjE1LCJhZHZTZWNyZXRLZXkiOiJPeTlsSzhuUWl1Z0lFa05wc3ExUGlNNFdZSktBVWNuNEZ4WHBFTFFxeFNBPSIsInByb2Nlc3NlZEhpc3RvcnlNZXNzYWdlcyI6W10sIm5leHRQcmVLZXlJZCI6MzEsImZpcnN0VW51cGxvYWRlZFByZUtleUlkIjozMSwiYWNjb3VudFN5bmNDb3VudGVyIjowLCJhY2NvdW50U2V0dGluZ3MiOnsidW5hcmNoaXZlQ2hhdHMiOmZhbHNlfSwiZGV2aWNlSWQiOiJ6RmRyRkJEN1RKR3psMFkyVHJ3b3hnIiwicGhvbmVJZCI6IjFkNWRmMDYzLTdhZTQtNDA3ZS1iNzFlLWJlOTI2NDVlM2Y2YiIsImlkZW50aXR5SWQiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJjZXFRSGkrQkVvbEFwN0dlSzV4QXNUUDc3cHc9In0sInJlZ2lzdGVyZWQiOnRydWUsImJhY2t1cFRva2VuIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoic0cyTStMSVArd25FU3hIVjd4NmlISVB6UFdzPSJ9LCJyZWdpc3RyYXRpb24iOnt9LCJwYWlyaW5nQ29kZSI6IjFENUNXRVJCIiwibWUiOnsiaWQiOiIyNTQ3OTIyMTY2ODg6OEBzLndoYXRzYXBwLm5ldCJ9LCJhY2NvdW50Ijp7ImRldGFpbHMiOiJDT0R6aWJNQkVOL216cnNHR0FJZ0FDZ0EiLCJhY2NvdW50U2lnbmF0dXJlS2V5Ijoicy9zOWVFSUhCRDQ0bEV6azJCdXJvb2o1ejlTYUtYWFdLWGM3Ylg3SStWbz0iLCJhY2NvdW50U2lnbmF0dXJlIjoiSnJJRWJwT3E2TzlUTFhJZzhSczB3dHNuM0pJSFlFQzRUS3Z5NlN4TUw5MSt0QnYyQVBpU0JEc09tOXIzamREWUlwazZmRDJJSEUrZFIzZ1pOYlFkQXc9PSIsImRldmljZVNpZ25hdHVyZSI6IlhjVkMzd3VOMDltSDRiSU5IeVpwMWFONUhTRlRza0RPeTg5RWQvbmtnMVJmZ3NETWM0bElYdStZdVAycHhYVHNwcWQ5ekRqSnNOZWQzK2t1dHFPakFBPT0ifSwic2lnbmFsSWRlbnRpdGllcyI6W3siaWRlbnRpZmllciI6eyJuYW1lIjoiMjU0NzkyMjE2Njg4OjhAcy53aGF0c2FwcC5uZXQiLCJkZXZpY2VJZCI6MH0sImlkZW50aWZpZXJLZXkiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJCYlA3UFhoQ0J3UStPSlJNNU5nYnE2S0krYy9VbWlsMTFpbDNPMjEreVBsYSJ9fV0sInBsYXRmb3JtIjoiYW5kcm9pZCIsImxhc3RBY2NvdW50U3luY1RpbWVzdGFtcCI6MTczNTYzNTgyMywibXlBcHBTdGF0ZUtleUlkIjoiQUFBQUFLdzgifQ==',
    PREFIXE: process.env.PREFIX || ".",
    OWNER_NAME: process.env.OWNER_NAME || "peach",
    NUMERO_OWNER : process.env.NUMERO_OWNER || " 254792216688",              
    AUTO_READ_STATUS: process.env.AUTO_READ_STATUS || "yes",
    AUTO_DOWNLOAD_STATUS: process.env.AUTO_DOWNLOAD_STATUS || 'no',
    BOT : process.env.BOT_NAME || 'LUCKY_MD',
    URL : process.env.BOT_MENU_LINKS || 'https://telegra.ph/file/17c83719a1b40e02971e4.jpg',
    MODE: process.env.PUBLIC_MODE || "yes",
    PM_PERMIT: process.env.PM_PERMIT || 'yes',
    HEROKU_APP_NAME : process.env.HEROKU_APP_NAME,
    HEROKU_APY_KEY : process.env.HEROKU_APY_KEY ,
    WARN_COUNT : process.env.WARN_COUNT || '2' ,
    ETAT : process.env.PRESENCE || '',
    CHATBOT : process.env.PM_CHATBOT || 'no',
    DP : process.env.STARTING_BOT_MESSAGE || "no",
    ADM : process.env.ANTI_DELETE_MESSAGE || 'no',
    ANTICALL : process.env.ANTICALL || 'yes',
                  AUTO_REACT : process.env.AUTO_REACT || 'yes',
                  AUDIO_REPLY : process.env.AUDIO_REPLY|| 'yes', 
                  AUTO_REACT_STATUS : process.env.AUTO_REACT_STATUS || 'yes',
                  AUTO_REPLY : process.env.AUTO_REPLY || 'yes',
                  AUTO_READ : process.env.AUTO_READ || 'yes',
                  AUTO_SAVE_CONTACTS : process.env.AUTO_SAVE_CONTACTS || 'no',
                  AUTO_REJECT_CALL : process.env.AUTO_REJECT_CALL || 'yes',
                  AUTO_BIO : process.env.AUTO_BIO || 'yes',
                  AUDIO_REPLY : process.env.AUDIO_REPLY || 'yes',
                  AUTO_TAG_STATUS : process.env.AUTO_TAG_STATUS || 'yes',
    DATABASE_URL,
    DATABASE: DATABASE_URL === databasePath
        ? "postgresql://postgres:bKlIqoOUWFIHOAhKxRWQtGfKfhGKgmRX@viaduct.proxy.rlwy.net:47738/railway" : "postgresql://postgres:bKlIqoOUWFIHOAhKxRWQtGfKfhGKgmRX@viaduct.proxy.rlwy.net:47738/railway",
   
};
let fichier = require.resolve(__filename);
fs.watchFile(fichier, () => {
    fs.unwatchFile(fichier);
    console.log(`mise à jour ${__filename}`);
    delete require.cache[fichier];
    require(fichier);
});
