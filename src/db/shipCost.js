async function getCoordinates(cityName) {
  const apiUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(cityName)}`;

  try {
      const response = await fetch(apiUrl);
      const data = await response.json();

      if (data && data.length > 0) {
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

  // console.log(cityName1)
  // console.log(cityName2)

  const { latitude: lat1, longitude: lon1 } = await getCoordinates(cityName1);
  const { latitude: lat2, longitude: lon2 } = await getCoordinates(cityName2);

  // console.log(lat1, lon1)

  const distance = calculateDistance(lat1, lon1, lat2, lon2);
  const cost = calculateCost(distance);
  return Math.floor(cost);;
}

function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; 
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; 
  return distance;
}

function deg2rad(deg) {
  return deg * (Math.PI / 180);
}

function calculateCost(distance) {
  const ratePerKilometer = 100; 
  return distance * ratePerKilometer;
}


export { calculateShippingCost }