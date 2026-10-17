
export function renderCars(cars) {
  const carGrid = document.querySelector('#car-grid');
  const fragment = document.createDocumentFragment();

  cars.forEach((car) => {
    const article = document.createElement('article');
    article.classList.add('car-card', 'reveal-on-scroll');

    if (car.image && car.image.url) {
      const image = document.createElement('img');

      image.classList.add('car-image');
      image.src = car.image.url;
      image.alt = `Fotografía de ${car.make} ${car.name}`;
      image.loading = 'lazy';

      image.addEventListener('error', () => {
        image.remove();
      });

      article.append(image);
    }

    const content = document.createElement('div');
    content.classList.add('car-card-content');

    const eyebrow = document.createElement('p');
    eyebrow.classList.add('eyebrow');
    eyebrow.textContent = `${car.make.toUpperCase()} COLLECTION`;

    const title = document.createElement('h3');
    title.textContent = car.name;

    const modelId = document.createElement('p');
    modelId.classList.add('car-model-id');
    modelId.textContent = `Modelo ID: ${car.id}`;

    content.append(eyebrow, title, modelId);

    if (car.image && car.image.attribution) {
      const attribution = document.createElement('p');

      attribution.classList.add('image-attribution');
      attribution.textContent = car.image.attribution;

      content.append(attribution);
    }

    article.append(content);
    fragment.append(article);
  });

  carGrid.replaceChildren(fragment);

  const cards = carGrid.querySelectorAll('.reveal-on-scroll');

  if (!('IntersectionObserver' in window)) {
    cards.forEach((card) => card.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries, currentObserver) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          currentObserver.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.08,
      rootMargin: '0px 0px 40px 0px',
    }
  );

  cards.forEach((card) => observer.observe(card));
}

export function renderStatus(message) {
  document.querySelector('#status').textContent = message;
}

export function renderCount(count) {
  document.querySelector('#car-count').textContent =
    `${count} modelos`;
}

export function renderError(message) {
  document.querySelector('#car-grid').replaceChildren();

  renderStatus(message);

  document.querySelector('#car-count').textContent =
    'Catálogo no disponible';
}
