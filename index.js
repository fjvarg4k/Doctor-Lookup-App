const doctorBaseUrl = 'https://api.betterdoctor.com/2016-03-01/doctors';
const mapsBaseUrl = 'https://maps.googleapis.com/maps/api/geocode/json?';
const doctorAPIKey = 'Insert your api key';
const mapsAPIKey = 'Insert your api key';

function formatQueryParams(params) {

}

function displayResults(responseJson) {

}


// Using the provided user input and fetches the info from the BetterDoct API
function getDoctorInfo(queryType, query, zipcode) {
  let coords = getLocation(zipcode);
  console.log(coords);
  // let longitude;
  // let latitude;
  // coords.then(result => {
  //   // console.log(result);
  //   longitude = result.results[0].geometry.location.lat;
  //   latitude = result.results[0].geometry.location.lng;
  //   console.log(longitude, latitude);
  // });
  // const params = {
  //   api_key: doctorAPIKey,
  //   name: queryType === 'doctor' ? query : '',
  //   q: queryType === 'symptom' ? query : '',
  //   location:
  // };
}


// Takes the user zipcode, converts it to latitude and longitude
function getLocation(userZip) {
  let longitude;
  let latitude;
  // let coords;
  const url = `${mapsBaseUrl}key=${mapsAPIKey}&address=${userZip}`;
  console.log(url);

  return fetch(url)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then(responseJson => {
      // console.log(responseJson);
      // latitude = responseJson.results[0].geometry.location.lat;
      // longitude = responseJson.results[0].geometry.location.lng;
      // console.log(latitude, longitude);
      // return [latitude, longitude];
      return responseJson;
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
    getDoctorInfo(searchType, searchTerm, searchZip);
  });
}

function startApp() {
  watchForm();
  console.log('App is running.');
}

$(startApp);
