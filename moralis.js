/* import moralis */
const Moralis = require("moralis/node");

module.exports = async () => {

    /* Moralis init code */
    const serverUrl = process.env.MORALIS_SERVER_URL;
    const appId = process.env.MORALIS_APP_ID;
    const masterKey = process.env.MORALIS_MASTER_KEY;

    Moralis.start({ serverUrl, appId, masterKey }).then(() => {
        console.log("Moralis started");
    });

}