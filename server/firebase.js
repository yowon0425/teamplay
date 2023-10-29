// const firebase = require("firebase-admin");
// const config = require("./config");

// const db = firebase.initializeApp(config.firebaseConfig);

// module.exports = db;

const admin = require("firebase-admin");
const firestore = require("firebase-admin/firestore");
const fstorage = require("firebase-admin/storage");
const serviceAccount = require("./firebaseAdminSDK.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "gs://teamplay-a0079.appspot.com",
});

const db = firestore.getFirestore();
const bucket = admin.storage().bucket();

module.exports = {
  db,
  bucket,
};
