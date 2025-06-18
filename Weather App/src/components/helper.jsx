export const convertTemperature = (temp, unit) => {
  if (unit === 'F') return (temp * 9) / 5 + 32;
  return temp;
};

export const getHumidityValue = (humidity) => {
  if (humidity < 30) return 'Low';
  if (humidity < 60) return 'Moderate';
  return 'High';
};

export const getVisibilityValue = (visibility) => {
  if (visibility > 10000) return 'Very Clear';
  if (visibility > 5000) return 'Clear';
  return 'Poor';
};

export const getWindDirection = (deg) => {
  const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  const index = Math.round(deg / 45) % 8;
  return directions[index];
};