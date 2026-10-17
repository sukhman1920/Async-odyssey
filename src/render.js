
export function renderCars(cars) {
  const carGrid = document.querySelector('#car-grid');
  const fragment = document.createDocumentFragment();

  cars.forEach((car) => {
    const article = document.createElement('article');
    article.classList.add('car-card');

    const content = document.createElement('div');
    content.classList.add('car-card-content');

    const eyebrow = document.createElement('p');
    eyebrow.classList.add('eyebrow');
    eyebrow.textContent = 'FERRARI COLLECTION';

    const title = document.createElement('h3');
    title.textContent = car.name;

    const modelId = document.createElement('p');
    modelId.classList.add('car-model-id');
    modelId.textContent = `Modelo ID: ${car.id}`;

    content.append(eyebrow, title, modelId);
    article.append(content);
    fragment.append(article);
  });

  carGrid.replaceChildren(fragment);
}

export function renderStatus(message) {
  document.querySelector('#status').textContent = message;
}

export function renderCount(count) {
  document.querySelector('#car-count').textContent =
    `${count} modelos`;
}

export function renderError(message) {
  const carGrid = document.querySelector('#car-grid');
  carGrid.replaceChildren();

  renderStatus(message);
  document.querySelector('#car-count').textContent =
    'Catálogo no disponible';
}
