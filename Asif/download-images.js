const fs = require('fs');
const https = require('https');

const files = [
    { url: "https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?auto=compress&cs=tinysrgb&w=600", path: "src/assets/images/latte_real.jpg" }, // Latte
    { url: "https://images.pexels.com/photos/1603901/pexels-photo-1603901.jpeg?auto=compress&cs=tinysrgb&w=600", path: "src/assets/images/sandwich_real.jpg" }, // Club Sandwich
    { url: "https://images.pexels.com/photos/3026804/pexels-photo-3026804.jpeg?auto=compress&cs=tinysrgb&w=600", path: "src/assets/images/brownie_real.jpg" } // Brownie
];

files.forEach(file => {
    console.log('Downloading ' + file.path + '...');
    https.get(file.url, (res) => {
        if (res.statusCode !== 200) {
            console.error(`Failed to download ${file.path}: Status ${res.statusCode}`);
            return;
        }
        const stream = fs.createWriteStream(file.path);
        res.pipe(stream);
        stream.on('finish', () => {
            stream.close();
            console.log('Successfully saved ' + file.path);
        });
    }).on('error', (e) => {
        console.error('Error downloading ' + file.path + ': ' + e.message);
    });
});
