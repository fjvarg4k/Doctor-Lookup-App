const doctorBaseUrl = 'https://api.betterdoctor.com/2016-03-01/doctors';
const mapsBaseUrl = 'https://maps.googleapis.com/maps/api/js';
const doctorAPIKey = // Insert your api key
const mapsAPIKey = // Insert your api key

// function formatQueryParams(params) {
//
// }
//
// function displayResults(responseJson) {
//
// }


// Using the provided user input and fetches the info from the BetterDoct API
function getDoctorInfo(queryType, query, zipcode) {
  getLocation(zipcode);
  console.log(queryType);
  // const params = {
  //   api_key: doctorAPIKey,
  //   name: queryType === 'doctor' ? query : '',
  //   q: queryType === 'symptom' ? query : '',
  //   location:
  // };
}


// Takes the user zipcode, converts it to latitude and longitude
function getLocation(userZip) {
  const url = `${mapsBaseUrl}?key=${mapsAPIKey}&address=${userZip}`;
  console.log(url);
}

// function getMapInfo() {
//
// }


// Grabs the provided user input
function watchForm() {
  $('form').on('submit', event => {
    event.preventDefault();
    console.log('watchForm is running');
    const searchType = $('#search-options').val();
    const searchTerm = $('#search-doctor-symptom-input').val();
    const searchZip = $('#search-zip-input').val();
    console.log(searchZip);
    getDoctorInfo(searchType, searchTerm, searchZip);
  });
}

function startApp() {
  watchForm();
  console.log('App is running.');
}

$(startApp);
