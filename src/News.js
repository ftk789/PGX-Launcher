const axios = require('axios');

// Function to show the full-screen overlay with the clicked image
function showImageOverlay(imgUrl) {
  const imageOverlay = document.getElementById('imageOverlay');
  imageOverlay.innerHTML = `<img src="${imgUrl}" alt="Image">`;
  imageOverlay.classList.add('show');
}

// Function to hide the full-screen overlay
function hideImageOverlay(event) {
  const imageOverlay = document.getElementById('imageOverlay');
  if (event.target === imageOverlay) {
    imageOverlay.classList.remove('show');
  }
}

document.addEventListener('DOMContentLoaded', async () => {
  try {
    const url = 'https://pgx-news.ftk789.repl.co/get';
    const response = await axios.get(url);
    let text = response.data;

    // Regular expression to find and replace IMG={URL} placeholders with image tags
    text = text.replace(/IMG=(.*?)\s/g, (match, imgUrl) => {
      return `<img src="${imgUrl}" alt="Image" onclick="showImageOverlay('${imgUrl}')">`;
    });

    // Use <pre> to preserve spaces and line breaks
    document.getElementById("News").innerHTML = '<pre>' + text + '</pre>';

    // Log the modified text for verification
    //console.log(text);

    // You can do further processing with the text here
  } catch (error) {
    console.error('Error fetching data:', error.message);
  }
});


