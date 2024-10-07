  // Function to fetch NEO data
  async function fetchNEOsData(startDate, endDate) {
    const apiUrl = `https://api.nasa.gov/neo/rest/v1/feed?start_date=${startDate}&end_date=${endDate}&api_key=LGqgPJedfST31QsqBqjS6D3ugweSgmf3yozJGhyG`;

    try {
      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error(`Error fetching NEO data: ${response.status}`);
      }
      const data = await response.json();
      return data.near_earth_objects;
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to fetch NEO data. Please check your internet connection or try again later.");
    }
  }

  // Function to display NEO data in cards
  function displayNEOsData(neos) {
    const container = document.getElementById('neos-cards-container');
    container.innerHTML = ''; // Clear previous cards

    // Loop through each NEO and create a card
    Object.keys(neos).forEach(date => {
      neos[date].forEach(neo => {
        const card = document.createElement('div');
        card.classList.add('neo-card');

        const velocityKph = parseFloat(neo.close_approach_data[0].relative_velocity.kilometers_per_hour);
        const missDistanceKm = parseFloat(neo.close_approach_data[0].miss_distance.kilometers);

        card.innerHTML = `
          <h3>${neo.name}</h3>
          <p><strong>Magnitude:</strong> ${neo.absolute_magnitude_h}</p>
          <p><strong>Diameter (km):</strong> ${neo.estimated_diameter.kilometers.estimated_diameter_min.toFixed(2)} - ${neo.estimated_diameter.kilometers.estimated_diameter_max.toFixed(2)}</p>
          <p><strong>Velocity (km/h):</strong> ${velocityKph.toFixed(2)}</p>
          <p><strong>Miss Distance (km):</strong> ${missDistanceKm.toFixed(2)}</p>
          <p><strong>Close Approach Date:</strong> ${neo.close_approach_data[0].close_approach_date_full}</p>
          <p><a href="${neo.nasa_jpl_url}" target="_blank" 
                     style="text-decoration: none; color: white; transition: text-decoration 0.3s;" 
                     onmouseover="this.style.textDecoration='underline'" 
                     onmouseout="this.style.textDecoration='none'">More Info</a>
          </p>`;
        container.appendChild(card);
      });
    });
  }

// Get input fields and button
const startDateInput = document.getElementById('start-date1');
const endDateInput = document.getElementById('end-date1');
const fetchNeosButton = document.getElementById('fetch-neos');

// Add onchange event listeners for debugging
startDateInput.addEventListener('change', () => {
  console.log("Start Date Changed: ", startDateInput.value); // Log the selected start date
});

endDateInput.addEventListener('change', () => {
  console.log("End Date Changed: ", endDateInput.value); // Log the selected end date
});

// Event listener for the "Fetch NEOs" button
fetchNeosButton.addEventListener('click', async () => {
  const startDate = startDateInput.value.trim();
  const endDate = endDateInput.value.trim();

  console.log("Start Date Input Value:", startDate);  // Should log the selected start date
  console.log("End Date Input Value:", endDate);      // Should log the selected end date

  if (!startDate || !endDate) {
    alert('Please select both start and end dates.');
    return;
  }

  try {
    const neos = await fetchNEOsData(startDate, endDate);
    if (neos) {
      displayNEOsData(neos);
    } else {
      alert('No NEO data available for the selected date range.');
    }
  } catch (error) {
    console.error(error);
  }
});
