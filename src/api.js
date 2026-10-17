
const API_URL = 'https://vpic.nhtsa.dot.gov/api/vehicles';

export async function getModelsByMake(make) {
  if (typeof make !== 'string' || !make.trim()) {
    throw new Error('Debes indicar una marca válida.');
  }

  const url = `${API_URL}/GetModelsForMake/${encodeURIComponent(make)}?format=json`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Error HTTP: ${response.status}`);
  }

  const data = await response.json();

  if (!Array.isArray(data.Results)) {
    throw new Error('La API ha devuelto un formato inesperado.');
  }

  return data.Results;
}
