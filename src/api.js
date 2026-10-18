
const API_URL = 'https://vpic.nhtsa.dot.gov/api/vehicles';
const IMAGE_API_URL = 'https://commons.wikimedia.org/w/api.php';

const CACHE_DURATION = 24 * 60 * 60 * 1000;

// BUSCAR DATOS GUARDADOS EN LOCALSTORAGE

function getCachedData(key) {
  try {
    const cached = localStorage.getItem(key);

    if (!cached) {
      return { hit: false, value: null };
    }

    const entry = JSON.parse(cached);

    if (
      typeof entry.timestamp !== 'number' ||
      Date.now() - entry.timestamp >= CACHE_DURATION
    ) {
      localStorage.removeItem(key);
      return { hit: false, value: null };
    }

    return { hit: true, value: entry.data };
  } catch (error) {
    console.warn('No se pudo leer la caché:', error);
    return { hit: false, value: null };
  }
}

// GUARDAR DATOS EN LOCALSTORAGE

function saveCachedData(key, data) {
  try {
    localStorage.setItem(
      key,
      JSON.stringify({
        timestamp: Date.now(),
        data: data,
      })
    );
  } catch (error) {
    // Si la caché falla, la aplicación puede seguir funcionando.
    console.warn('No se pudo guardar la caché:', error);
  }
}

// OBTENER MODELOS DE UNA MARCA

export async function getModelsByMake(make) {
  if (typeof make !== 'string' || !make.trim()) {
    throw new Error('Debes indicar una marca válida.');
  }

  const normalizedMake = make.trim();
  const cacheKey = `autoradar:v1:models:${normalizedMake.toLowerCase()}`;

  const cached = getCachedData(cacheKey);

  if (cached.hit) {
    console.log(`Caché utilizada: modelos de ${normalizedMake}`);
    return cached.value;
  }

  const url =
    `${API_URL}/GetModelsForMake/${encodeURIComponent(normalizedMake)}?format=json`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Error HTTP: ${response.status}`);
  }

  const data = await response.json();

  if (!Array.isArray(data.Results)) {
    throw new Error('La API ha devuelto un formato inesperado.');
  }

  saveCachedData(cacheKey, data.Results);

  return data.Results;
}

// OBTENER IMAGEN DE UN MODELO

export async function getCarImage(make, model) {
  const cacheKey =
    `autoradar:v1:image:${make.trim().toLowerCase()}:${model.trim().toLowerCase()}`;

  const cached = getCachedData(cacheKey);

  if (cached.hit) {
    console.log(`Caché utilizada: imagen de ${make} ${model}`);
    return cached.value;
  }

  const params = new URLSearchParams({
    action: 'query',
    generator: 'search',
    gsrsearch: `${make} ${model}`,
    gsrnamespace: '6',
    gsrlimit: '10',
    prop: 'imageinfo',
    iiprop: 'url|extmetadata',
    iiurlwidth: '800',
    format: 'json',
    origin: '*',
  });

  const response = await fetch(`${IMAGE_API_URL}?${params}`);

  if (!response.ok) {
    throw new Error(`Error al buscar imágenes: ${response.status}`);
  }

  const data = await response.json();
  const pages = Object.values(data.query?.pages || {});

  const page = pages.find((item) => {
    const imageInfo = item.imageinfo?.[0];
    return imageInfo && (imageInfo.thumburl || imageInfo.url);
  });

  if (!page) {
    saveCachedData(cacheKey, null);
    return null;
  }

  const imageInfo = page.imageinfo[0];
  const metadata = imageInfo.extmetadata || {};

  const author =
    metadata.Artist?.value?.replace(/<[^>]*>/g, '') ||
    'Autor no indicado';

  const license =
    metadata.LicenseShortName?.value ||
    'Licencia no indicada';

  const image = {
    url: imageInfo.thumburl || imageInfo.url,
    source: imageInfo.descriptionurl,
    author,
    license,
    attribution: `${page.title.replace('File:', '')} — ${author} (${license})`,
  };

  saveCachedData(cacheKey, image);

  return image;
}
