
export function normalizeCars(models) {
  return models.map((car) => ({
    id: car.Model_ID,
    name: car.Model_Name,
  }));
}

export function filterCars(cars, search) {
  const searchText = search.trim().toLowerCase();

  return cars.filter((car) =>
    car.name.toLowerCase().includes(searchText)
  );
}

export function countCars(cars) {
  return cars.reduce((total, car) => total + 1, 0);
}
