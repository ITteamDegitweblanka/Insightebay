// Simple backend connectivity test for Insight-eBay
fetch('http://localhost:5000/')
  .then(res => res.text())
  .then(text => {
    if (text.includes('eBay Performance API Running')) {
      alert('Backend connectivity: SUCCESS');
    } else {
      alert('Backend connectivity: Unexpected response: ' + text);
    }
  })
  .catch(err => {
    alert('Backend connectivity: FAILED\n' + err);
  });
