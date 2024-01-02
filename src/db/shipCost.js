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

const transShipment1 = "Ha Noi, Viet Nam"
const transShipment2 = "Ho Chi Minh, Viet Nam"
const transShipment3 = "Da Nang, Viet Nam"

async function calculateShippingCost(cityName1, cityName2) {
  const { latitude: lat1, longitude: lon1 } = await getCoordinates(cityName1);
  const { latitude: lat2, longitude: lon2 } = await getCoordinates(cityName2);

  const { latitude: lat3, longitude: lon3 } = await getCoordinates(transShipment1);
  const { latitude: lat4, longitude: lon4 } = await getCoordinates(transShipment2);
  const { latitude: lat5, longitude: lon5 } = await getCoordinates(transShipment3);

  const distance1 = calculateDistance(lat1, lon1, lat2, lon2);
  const hh1 = Math.min(calculateDistance(lat1, lon1, lat3, lon3), Math.min(calculateDistance(lat1, lon1, lat4, lon4), calculateDistance(lat1, lon1, lat5, lon5)));
  const hh2 = Math.min(calculateDistance(lat2, lon2, lat3, lon3), Math.min(calculateDistance(lat2, lon2, lat4, lon4), calculateDistance(lat2, lon2, lat5, lon5)));
  const distance2 = hh1 + hh2 + 150;

  // console.log(distance1, distance2, hh1, hh2)


  const distance = Math.min(distance1, distance2);

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