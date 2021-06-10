const htmlToImage = require('html-to-image');

require('html-to-image')(function (err, passwords) {
    // This code runs once the passwords have been loaded.
});



const fredContainerTest = document.querySelector('.fred__container');

const test = () => {
    console.log("bonjour")
}

htmlToImage.toJpeg(fredContainerTest, { quality: 0.95 })
    .then(function (dataUrl) {
        const link = document.createElement('a');
        link.download = 'my-image-name.jpeg';
        link.href = dataUrl;
        link.click();
    });


window.addEventListener('DOMContentLoaded', function (event) {

    console.log('fred');


})