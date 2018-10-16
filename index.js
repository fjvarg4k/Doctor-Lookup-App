const doctorBaseUrl = 'https://api.betterdoctor.com/2016-03-01/doctors?limit=20&';
const mapsBaseUrl = 'https://maps.googleapis.com/maps/api/geocode/json?';
const doctorAPIKey = 'a650db307823e26e95107e6d3347d319';
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
    let docGender = responseJson.data[i].profile.gender;
    let docTitle = responseJson.data[i].profile.title;
    let docImg = responseJson.data[i].profile.image_url;
    let practiceInfo = getPraticeInfo(responseJson.data[i]);
    if (practiceInfo.length > 0) {
      let location = practiceInfo[0];
      let acceptsNewPatients = practiceInfo[1];
      let phoneNumber = practiceInfo[2]["number"];
      let numberType = practiceInfo[2]["type"];

      $('.searchResults').append(
        `<div class="doctor-container">
           <ul class="doctor-info">
             <li>${docFirstName} ${docLastName}, ${docTitle}</li>
            ${getGender(docGender)}
             <li><img src="${docImg}" alt="Image of Dr. ${docFirstName} ${docLastName}"></li>
             ${getAcceptsPatients(acceptsNewPatients)}
             <li>
               <ul class="contact-info">
                 <h3>Office Location & Contact Info</h3>
                 <li>${location}</li>
                 <li><span class="capitalize">${numberType}</span>: (${phoneNumber.substr(0,3)})${phoneNumber.substr(3,3)}-${phoneNumber.substr(6)}</li>
               </ul>
             </li>
           </ul>
        </div>`
      )
    }
  }
}


// Checks if gender value for the specified doctor is available
function getGender(gender) {
  return (gender === 'male' || gender === 'female') ?  `<li>Gender: <span class="capitalize">${gender}</span></li>` : `<li>Gender: N/A</li>`;
}

// Checks if a doctor takes new patients
function getAcceptsPatients(accepts) {
  return accepts ? `<li>Accepts new patients</li>` : ' ';
}

// Checks a doctor's different practices and grabs requested values for the ones that are within the search area
function getPraticeInfo(responseJson) {
  let informationOfDoctor = [];
  for (let i = 0; i < responseJson.practices.length; i++) {
    if (responseJson.practices[i].within_search_area === true) {
      let location = `${responseJson.practices[i].visit_address.street} ${responseJson.practices[i].visit_address.city}, ${responseJson.practices[i].visit_address.state} ${responseJson.practices[i].visit_address.zip}`;
      let acceptsPatients = responseJson.practices[i].accepts_new_patients;
      let phoneNumbers = getPhoneNumbers(responseJson.practices[i]);
      informationOfDoctor.push(location, acceptsPatients, phoneNumbers);
      return informationOfDoctor;
    }
  }
  return informationOfDoctor;
}

// Grabs available phone numbers for a specific practice
function getPhoneNumbers(response) {
  for (let i = 0; i < response.phones.length; i++) {
    return response.phones[i];
  }
}


// Uses provided user input and fetches info from BetterDoct API
function getDoctorInfo(queryType, query, userCoords, userDistance) {
  const params = {
    user_key: doctorAPIKey,
    name: queryType === 'doctor' ? query : '',
    query: queryType === 'specialty' ? query : '',
    location: `${userCoords[0]},${userCoords[1]},${userDistance}`
  };

  const queryString = formatQueryParams(params);
  const url = `${doctorBaseUrl}${queryString}`;
  console.log(url);

  fetch(url)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then(responseJson => {
      if (responseJson.data.length > 0) {
        displayResults(responseJson);
      } else {
        $('#error-message').text('No results were found.');
      }
    })
    .catch(err => {
      $('#error-message').text('No results were found.')
    });
}

// Grabs lat and long values from response Json
function getCoords(response) {
  let lat = response.results[0].geometry.location.lat;
  let long = response.results[0].geometry.location.lng;
  let coords = [lat, long];
  return coords;
}


// Takes user zipcode, converts to latitude and longitude
function getLocation(userZip, queryType, query, userDistance) {
  const url = `${mapsBaseUrl}key=${mapsAPIKey}&address=${userZip}`;
  console.log(url);

  return fetch(url)
    .then(response => {
      // return response.json();
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then(responseJson => {
      let userCoords = getCoords(responseJson);
      getDoctorInfo(queryType, query, userCoords, userDistance);
    })
    .catch(err => {
      $('#error-message').text(`Something went wrong: ${err.message}`)
    });
}

// Grabs provided user input
function watchForm() {
  $('form').on('submit', event => {
    $('.load-screen').css('display', 'none');
    $('.title-subtext').css('display', 'block');
    $('main').css('height', 'auto');
    event.preventDefault();
    const searchType = $('#search-options').val();
    const searchTerm = $('#search-doctor-specialty-input').val();
    const searchZip = $('#search-zip-input').val();
    const searchDisance = $('#search-distance-input').val();
    getLocation(searchZip, searchType, searchTerm, searchDisance);
  });
}

function startApp() {
  watchForm();
}

$(startApp);
