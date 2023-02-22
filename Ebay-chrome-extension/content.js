
const API_KEY = "YOUR_API_KEY"

let latitude1, longitude1;
function getLocation() {
  return new Promise((resolve, reject) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(resolve, reject);
    } else {
      reject('Geolocation API is not available');
    }
  });
}
async function main() {
  try {
    const position = await getLocation();
    latitude1 = position.coords.latitude;
    longitude1 = position.coords.longitude;

    // console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);

    return { latitude1, longitude1 };
  } catch (error) {
    console.error(`Error getting location: ${error}`);
    return null;
  }
}





function fetchSelectedElement(href,lat,long) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    xhr.onreadystatechange = function() {
      if (xhr.readyState === XMLHttpRequest.DONE) {
        const parser = new DOMParser();
        const htmlDoc = parser.parseFromString(xhr.responseText, 'text/html');
        const shippingElement = htmlDoc.querySelector('#vi-ship-maincntr');
        // const element = shippingElement.querySelector(".ux-labels-values.col-12.ux-labels-values--itemLocation");
        const location = shippingElement.querySelector("span.ux-textspans.ux-textspans--BOLD.ux-textspans--SECONDARY");
  
        const locationQuery = location.innerText;

// // Construct the API URL with the location query and API key
        const apiUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(locationQuery)}&key=${API_KEY}`;

        // Make a request to the API
        fetch(apiUrl)
          .then(response => response.json())
          .then(data => {
            // Extract the latitude and longitude from the API response
            const latitude = data.results[0].geometry.location.lat;
            const longitude = data.results[0].geometry.location.lng;
            const distance = getDistanceFromLatLonInKm(lat,long,latitude,longitude)
            // console.log(`Distance: ${distance}`);
            resolve(distance);
          })
          .catch(error => {
            console.error(`Error getting location: ${error.message}`);
          });

        // Resolve with the selected element
        
        
      }
    };

    xhr.open('GET', href);
    xhr.send();
  });
}

function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(lat2-lat1);  // deg2rad below
  var dLon = deg2rad(lon2-lon1); 
  var a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2)
    ; 
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  var d = R * c; // Distance in km
  return d;
}

function deg2rad(deg) {
  return deg * (Math.PI/180)
}



const product = document.querySelectorAll('li.s-item.s-item__pl-on-bottom');
// const product = Array.from(products).slice(0, 3);

async function logLocation() {
  await main();
  product.forEach(element => {
    const details =  element.querySelector('.s-item__details.clearfix');
  
    const link = element.querySelector('a.s-item__link');
    const label = document.createElement('div');
    label.className = 's-item__detail s-item__detail--primary';
    label.style.color = 'green';
    // label.innerText = link.href;
    details.appendChild(label);

    fetchSelectedElement(link.href,latitude1,longitude1)
      .then(selectedElement => {
        // Access the selected element for this link
        // console.log(`Selected element for ${link.href}: ${selectedElement.textContent}`);
        label.innerText = selectedElement;
      })
      .catch(error => console.error(error));
    
   
  });
}

logLocation()
// console.log(selectedElement)







// // Define the location query

