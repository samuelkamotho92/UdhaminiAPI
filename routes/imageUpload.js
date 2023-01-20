const router = require('express').Router();
const { BlobServiceClient, StorageSharedKeyCredential } = require('@azure/storage-blob');

//upload images to azure blob storage
const credential = new StorageSharedKeyCredential(process.env.AZURE_STORAGE_ACCOUNT_NAME, process.env.AZURE_STORAGE_ACCOUNT_ACCESS_KEY);
const blobServiceClient = new BlobServiceClient(`https://${process.env.AZURE_STORAGE_ACCOUNT_NAME}.blob.core.windows.net`, credential);


router.post('/imageUpload', async (req, res) => {
    try {
        console.log(req.body);
        const { originalname } = req.body.image;
        const fileName = `${Date.now()}${path.extname(originalname)}`; // Get the file name and extension of the image        
        const containerClient = blobServiceClient.getContainerClient('images'); // Get a reference to the container in the storage account       
        const blockBlobClient = containerClient.getBlockBlobClient(fileName);  // Create a new block blob in the container        
        await blockBlobClient.upload(imageData, imageData.length); // Upload the image data to the blob        
        res.status(200).send(blockBlobClient.url); // Return the URL of the image
    } catch (error) {
        res.status(401).send("Error uploading image:" + error.message);
    }
});

router.delete('/imageDelete/:fileName', async (req, res) => {
    try {
        const containerClient = blobServiceClient.getContainerClient('images'); // Get a reference to the blob container        
        const blockBlobClient = containerClient.getBlockBlobClient(req.params.fileName);  // Delete the blob       
        await blockBlobClient.delete();
        res.status(200).send("image deleted successfully");
    } catch (error) {
        res.status(401).send("Error deleting image:" + error.message);
    }
});

module.exports = router;