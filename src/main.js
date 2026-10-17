
import './style.css';
import { getModelsByMake } from './api.js';
import {
  normalizeCars,
  countCars,
  filterCars,
} from './logic.js';
import {
  renderCars,
  renderStatus,
  renderCount,
  renderError,
} from './render.js';

async function loadCars() {
  try {
    renderStatus('Cargando modelos Ferrari...');

    const models = await getModelsByMake('Ferrari');
    const cars = normalizeCars(models);

    
    const searchInput = document.querySelector('#car-search');

    searchInput.addEventListener('input', () => {
      const filteredCars = filterCars(cars, searchInput.value);

      renderCars(filteredCars);
      renderCount(filteredCars.length);

      if (filteredCars.length === 0) {
        renderStatus('No hay modelos que coincidan con tu búsqueda.');
      } else {
        renderStatus('Catálogo cargado correctamente.');
      }
    });


    if (cars.length === 0) {
      renderStatus('No se han encontrado modelos para esta marca.');
      renderCount(0);
      return;
    }

    renderCars(cars);
    renderCount(countCars(cars));
    renderStatus('Catálogo cargado correctamente.');
  } catch (error) {
    console.error('Error al cargar los modelos:', error);

    renderError(
      'No se ha podido cargar el catálogo. Comprueba tu conexión e inténtalo de nuevo.'
    );
  }
}

loadCars();
