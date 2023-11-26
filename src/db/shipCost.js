async function getCoordinates(cityName) {
  const apiUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(cityName)}`;

  try {
      const response = await fetch(apiUrl);
      const data = await response.json();

      if (data && data.length > 0) {
          console.log(data[0])
          return {
              latitude: parseFloat(data[0].lat),
              longitude: parseFloat(data[0].lon)
          };
      } else {
          console.log("abcabc")
      }
  } catch (error) {
      console.error(error);
  }
}

async function calculateShippingCost(cityName1, cityName2) {
  // const cityName1 = document.getElementById('city1').value;
  // const cityName2 = document.getElementById('city2').value;

  const { latitude: lat1, longitude: lon1 } = await getCoordinates(cityName1);
  const { latitude: lat2, longitude: lon2 } = await getCoordinates(cityName2);

  // console.log(lat1, lon1)
  
  const distance = calculateDistance(lat1, lon1, lat2, lon2);
  const cost = calculateCost(distance);
  displayResult(cost);
}

function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; 
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; 
  return distance;
}

function deg2rad(deg) {
  return deg * (Math.PI / 180);
}

function calculateCost(distance) {
  const ratePerKilometer = 0.1; 
  return distance * ratePerKilometer;
}

function displayResult(cost) {
  const resultContainer = document.getElementById('result');
  resultContainer.innerHTML = `<p>Estimated Shipping Cost: $${cost.toFixed(2)}</p>`;
}
