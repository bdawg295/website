function learnMore() {
    window.location.href = "#about";
  }
  
  // Check if styles.css and script.js are being directly accessed
const verifyFileAccess = (file) => {
  fetch(file, { method: 'HEAD' })
    .then((response) => {
      if (!response.ok) {
        // Redirect if the request is invalid
        window.location.href = '/';
      }
    })
    .catch((error) => {
      console.error('Error verifying access:', error);
      window.location.href = '/'; // Redirect on error
    });
};


verifyFileAccess('styles.css');
verifyFileAccess('script.js');
