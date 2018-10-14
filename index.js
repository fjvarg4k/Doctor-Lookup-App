const doctorBaseUrl = 'https://api.betterdoctor.com/2016-03-01/doctors?limit=20&';
const mapsBaseUrl = 'https://maps.googleapis.com/maps/api/geocode/json?';
const doctorAPIKey = 'a40b56e6e8f4d9f1512f27f37037cc15';
const mapsAPIKey = 'AIzaSyAuTCxa2Y4ThVfziIO7laRz8sf38ZMhCWU';

function formatQueryParams(params) {
  const queryItems = Object.keys(params)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`);
  return queryItems.join('&');
}

function displayResults(responseJson) {
  console.log(responseJson);
  $('.searchResults').empty();
  for (let i = 0; i < responseJson.data.length; i++) {
    let docFirstName = responseJson.data[i].profile.first_name;
    let docLastName = responseJson.data[i].profile.last_name;
    let docTitle = responseJson.data[i].profile.title;
    let docImg = responseJson.data[i].profile.image_url;
    let docLocation = getAddressByDistance(responseJson.data[i])
    // let location = `${responseJson.data[i].practices[0].visit_address.street} ${responseJson.data[i].practices[0].visit_address.city}, ${responseJson.data[i].practices[0].visit_address.state} ${responseJson.data[i].practices[0].visit_address.zip}`;
    $('.searchResults').append(
      `<ul class="doctor-info">
         <li>${docFirstName} ${docLastName}, ${docTitle}</li>
         <li><img src="${docImg}" alt="Image of Dr. ${docFirstName} ${docLastName}"></li>
         <li>${docLocation}</li>
       </ul>`
    )
  }
}

function getAddressByDistance(responseJson) {
  // console.log(responseJson.practices);
  for (let i = 0; i < responseJson.practices.length; i++) {
    if (responseJson.practices[i].within_search_area === true) {
      let location = `${responseJson.practices[i].visit_address.street} ${responseJson.practices[i].visit_address.city}, ${responseJson.practices[i].visit_address.state} ${responseJson.practices[i].visit_address.zip}`;
      return location;
    }
  }
}


// Using the provided user input and fetches the info from the BetterDoct API
function getDoctorInfo(queryType, query, userCoords, userDistance) {
  const params = {
    user_key: doctorAPIKey,
    name: queryType === 'doctor' ? query : '',
    query: queryType === 'symptom' ? query : '',
    location: `${userCoords[0]},${userCoords[1]},${userDistance}`
  };

  const queryString = formatQueryParams(params);
  // console.log(queryString);
  const url = `${doctorBaseUrl}${queryString}`;
  console.log(url);

  fetch(url)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then(responseJson => displayResults(responseJson))
    .catch(err => {
      $('#error-message').text(`Something went wrong: ${err.message}`)
    });
}
//
//
// // Grabs lat and long values from response Json
function getCoords(response) {
  let lat = response.results[0].geometry.location.lat;
  let long = response.results[0].geometry.location.lng;
  let coords = [lat, long];
  // return coords2;
  // console.log(coords);
  return coords;
}


// Takes the user zipcode, converts it to latitude and longitude
function getLocation(userZip, queryType, query, userDistance) {
  const url = `${mapsBaseUrl}key=${mapsAPIKey}&address=${userZip}`;
  console.log(url);

  return fetch(url)
    .then(response => {
      return response.json();
      // if (response.ok) {
      //   return response.json();
      // }
      // throw new Error(response.statusText);
    })
    .then(responseJson => {
      // console.log(responseJson);
      // latitude = responseJson.results[0].geometry.location.lat;
      // longitude = responseJson.results[0].geometry.location.lng;
      // console.log(latitude, longitude);
      // return [latitude, longitude];
      // let coords = getCoords(responseJson);
      // console.log(coords);
      // return coords;
      let userCoords = getCoords(responseJson);
      getDoctorInfo(queryType, query, userCoords, userDistance);
    })
    .catch(err => {
      $('#error-message').text(`Something went wrong: ${err.message}`)
    });
  // let latitude = results.geometry[0].location.lat;
  // let longitude = results.geometry[0].location.lng;
  // console.log(lat, long);

}

function getMapInfo() {

}


// Grabs the provided user input
function watchForm() {
  $('form').on('submit', event => {
    event.preventDefault();
    const searchType = $('#search-options').val();
    const searchTerm = $('#search-doctor-symptom-input').val();
    const searchZip = $('#search-zip-input').val();
    const searchDisance = $('#search-distance-input').val();
    getLocation(searchZip, searchType, searchTerm, searchDisance);
    // getDoctorInfo(searchType, searchTerm, coordinates, searchDisance);
  });
}

function startApp() {
  watchForm();
  console.log('App is running.');
}

$(startApp);
