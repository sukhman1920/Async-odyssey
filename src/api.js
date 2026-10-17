
const API_URL = 'https://vpic.nhtsa.dot.gov/api/vehicles';
const IMAGE_API_URL = 'https://commons.wikimedia.org/w/api.php';

export async function getModelsByMake(make) {
  if (typeof make !== 'string' || !make.trim()) {
    throw new Error('Debes indicar una marca válida.');
  }

  const url =
    `${API_URL}/GetModelsForMake/${encodeURIComponent(make)}?format=json`;

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

export async function getCarImage(make, model) {
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
    return null;
  }

  const imageInfo = page.imageinfo[0];
  const metadata = imageInfo.extmetadata || {};

  const author =
    metadata.Artist?.value?.replace(/<[^>]*>/g, '') || 'Autor no indicado';

  const license =
    metadata.LicenseShortName?.value || 'Licencia no indicada';

  return {
    url: imageInfo.thumburl || imageInfo.url,
    source: imageInfo.descriptionurl,
    author,
    license,
    attribution: `${page.title.replace('File:', '')} — ${author} (${license})`,
  };
}
