
export function normalizeCars(models, make) {
  return models
    .map((car) => ({
      id: car.Model_ID,
      name: car.Model_Name,
      make: make,
    }))
    .filter((car) => car.name);
}

export function filterCars(cars, search) {
  const searchText = search.trim().toLowerCase();

  return cars.filter((car) =>
    `${car.make} ${car.name}`.toLowerCase().includes(searchText)
  );
}

export function countCars(cars) {
  return cars.reduce((total) => total + 1, 0);
}

export async function addImagesToCars(cars, getCarImage) {
  return Promise.all(
    cars.map(async (car) => {
      try {
        const image = await getCarImage(car.make, car.name);

        return {
          ...car,
          image,
        };
      } catch (error) {
        console.error(
          `No se pudo cargar la imagen de ${car.make} ${car.name}:`,
          error
        );

        return {
          ...car,
          image: null,
        };
      }
    })
  );
}
