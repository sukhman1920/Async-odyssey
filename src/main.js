
import './style.css';

import { getModelsByMake, getCarImage } from './api.js';

import {
  normalizeCars,
  filterCars,
  countCars,
  addImagesToCars,
} from './logic.js';

import {
  renderCars,
  renderStatus,
  renderCount,
  renderError,
} from './render.js';

const searchInput = document.querySelector('#car-search');
const brandFilter = document.querySelector('#brand-filter');
const themeToggle = document.querySelector('#theme-toggle');
const scrollNavbar = document.querySelector('#scroll-navbar');
const backToTop = document.querySelector('#back-to-top');
const scrollProgress = document.querySelector('#scroll-progress');

const brands = [
  'Ferrari',
  'Lamborghini',
  'McLaren',
  'Bugatti',
  'Porsche',
  'Aston Martin',
  'Maserati',
  'Bentley',
  'Rolls-Royce',
];

let allCars = [];

function setupBrandFilter() {
  brands.forEach((brand) => {
    const option = document.createElement('option');

    option.value = brand;
    option.textContent = brand;

    brandFilter.append(option);
  });
}

function updateCatalogue() {
  let filteredCars = filterCars(allCars, searchInput.value);

  if (brandFilter.value !== 'all') {
    filteredCars = filteredCars.filter(
      (car) => car.make === brandFilter.value
    );
  }

  renderCars(filteredCars);
  renderCount(countCars(filteredCars));

  if (filteredCars.length === 0) {
    renderStatus('No hay modelos que coincidan con los filtros.');
  } else {
    renderStatus('Catálogo cargado correctamente.');
  }
}

async function loadCars() {
  try {
    renderStatus('Cargando marcas y modelos...');
    renderCount(0);

    const results = await Promise.all(
      brands.map(async (make) => {
        try {
          const models = await getModelsByMake(make);
          return normalizeCars(models, make);
        } catch (error) {
          console.error(`Error al cargar ${make}:`, error);
          return [];
        }
      })
    );

    const normalizedCars = results.flat();

    console.log(
      results.map((cars, index) => ({
        marca: brands[index],
        modelos: cars.length,
      }))
    );

    if (normalizedCars.length === 0) {
      throw new Error('No se encontraron modelos.');
    }

    renderStatus('Buscando imágenes para el catálogo...');

    allCars = await addImagesToCars(normalizedCars, getCarImage);

    updateCatalogue();
  } catch (error) {
    console.error('Error al cargar AutoRadar:', error);

    renderError(
      'No se ha podido cargar el catálogo. Comprueba tu conexión e inténtalo de nuevo.'
    );
  }
}

searchInput.addEventListener('input', updateCatalogue);

brandFilter.addEventListener('change', updateCatalogue);

themeToggle.addEventListener('click', () => {
  const isClassic = document.body.classList.toggle('classic-mode');

  themeToggle.textContent = isClassic
    ? 'Modo deportivo'
    : 'Modo clásico';

  themeToggle.setAttribute('aria-pressed', String(isClassic));
});


let previousScrollPosition = window.scrollY;


function updateScrollControls() {
  const scrollPosition = window.scrollY;

  scrollNavbar.classList.toggle('is-visible', scrollPosition > 180);

  backToTop.classList.toggle('is-visible', scrollPosition > 400);

  const scrollableHeight =
    document.documentElement.scrollHeight - window.innerHeight;

  const progress =
    scrollableHeight > 0 ? scrollPosition / scrollableHeight : 0;

  scrollProgress.style.transform = `scaleX(${progress})`;
}


window.addEventListener('scroll', updateScrollControls, {
  passive: true,
});

window.addEventListener('resize', updateScrollControls);

backToTop.addEventListener('click', () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  });
});

setupBrandFilter();
updateScrollControls();
loadCars();

document.querySelector('#current-year').textContent =
  new Date().getFullYear();
