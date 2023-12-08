const { v4: uuid } = require('uuid');
const { getDownloadURL } = require('firebase-admin/storage');
const { bucket } = require('../services/firebaseConfig');

// Takes in the file to upload, the doc associated with it (ie, user),
// the field on the doc object as a string (ie, 'avatar'), and the path
// in the bucket as a string (ie, 'tweets' saves in tweets/filename)

const uploadFile = async (file, document, field, path, options = {}) => {
  const { local } = options;

  await deleteFile(document, field);

  // Generate name
  const extension = file.name.split('.')[1];
  const filename = `tweeter_${path}_${uuid()}.${extension}`;

  // Upload local file to bucket
  if (local) {
    const options = { destination: `${path}/${filename}` };
    await bucket.upload(file.path, options);
  }

  // Upload file stored in memory to bucket
  if (!local) {
    await bucket.file(`${path}/${filename}`).save(file.data);
  }

  // Get file url and name
  const fileRef = bucket.file(`${path}/${filename}`);
  const downloadURL = await getDownloadURL(fileRef);
  const downloadName = fileRef.name;

  // Save url and name to doc
  document[field].url = downloadURL;
  document[field].filename = downloadName;

  await document.save();
};

// Checks if documents contain a file reference, then deletes from
// bucket. Will save the document by default.
const deleteFile = async (document, field, save = true) => {
  if (document[field].url || document[field].filename) {
    const fileRef = bucket.file(document[field].filename);

    // Check if file exists in bucket
    const [exists] = await fileRef.exists();

    // Delete from bucket if existing
    if (exists) await bucket.file(document[field].filename).delete();

    // Wipe url and filename from document
    document[field].url = undefined;
    document[field].filename = undefined;

    if (!save) {
      return;
    }

    await document.save();
  }
};

module.exports = { uploadFile, deleteFile };
