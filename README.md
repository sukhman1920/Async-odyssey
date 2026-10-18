# AutoRadar - Async Odyssey

AutoRadar es una aplicación web para consultar un catálogo de modelos de coches deportivos de diferentes marcas. Está desarrollada con JavaScript y Vite, y utiliza APIs públicas para obtener información de los vehículos y buscar imágenes.

El proyecto se ha realizado para la misión Async Odyssey, poniendo en práctica las peticiones asíncronas, la manipulación del DOM y la organización del código en diferentes módulos.

---

## Funcionalidades

- Catálogo de modelos de nueve marcas de coches.
- Buscador por nombre del modelo o marca.
- Filtro para seleccionar una marca concreta.
- Alternancia entre modo deportivo y modo clásico.
- Carga de información e imágenes mediante APIs.
- Gestión de errores durante las peticiones.
- Caché en localStorage durante 24 horas para evitar repetir peticiones innecesarias.
- Diseño adaptable a diferentes tamaños de pantalla.
- Animaciones, indicador de progreso del desplazamiento y botón para volver al inicio.

---

## Tecnologías utilizadas

- HTML5
- CSS3
- JavaScript
- Vite
- Fetch API
- async/await
- Promise.all
- Métodos de arrays: map, filter y reduce
- DOM
- localStorage
- Intersection Observer API

---

## APIs utilizadas

### NHTSA vPIC

Esta API se utiliza para obtener los modelos disponibles de cada marca de vehículos.

Endpoint utilizado:

`https://vpic.nhtsa.dot.gov/api/vehicles/GetModelsForMake/{marca}?format=json`

### Wikimedia Commons

Se utiliza para buscar imágenes de los modelos de coches. También se intenta obtener información sobre la fuente, el autor y la licencia de las imágenes.

Si no se encuentra una imagen o se produce un error durante la petición, el catálogo puede seguir funcionando sin mostrarla.

---

## Estructura del proyecto

```text
Async-odyssey/
├── index.html
├── package.json
├── package-lock.json
├── public/
└── src/
    ├── api.js
    ├── logic.js
    ├── main.js
    └── render.js
```

Cada archivo tiene una función diferente:

- **main.js:** inicia la aplicación, gestiona los eventos y coordina la carga de los datos.
- **api.js:** contiene las funciones que realizan las peticiones a las APIs y gestionan la caché.
- **logic.js:** transforma los datos, filtra los coches, cuenta los resultados y añade las imágenes.
- **render.js:** se encarga de mostrar los coches, los mensajes de estado y los errores en la página.
- **style.css:** contiene los estilos, los temas, las animaciones y el diseño adaptable.

---

## Conceptos aplicados

### Peticiones asíncronas

Se utilizan async y await para trabajar con las peticiones a las APIs. También se comprueba response.ok para detectar errores HTTP y se utiliza try/catch para controlar los posibles fallos.

### Métodos de arrays

Se utilizan diferentes métodos para trabajar con los datos recibidos:

- **map:** transforma los modelos recibidos en objetos con una estructura común.
- **filter:** permite filtrar los coches según el texto de búsqueda.
- **reduce:** se utiliza para calcular el número de resultados.
- **Promise.all:** permite ejecutar varias operaciones asíncronas al mismo tiempo y esperar a que terminen.

### Módulos ES

El código está separado en diferentes archivos para que cada uno tenga una responsabilidad concreta. De esta forma, las peticiones, la lógica, el renderizado y la inicialización no están mezclados en un único archivo.

### Almacenamiento local

Se utiliza localStorage para guardar los resultados junto con la fecha en la que se almacenaron. Si no han pasado 24 horas, los datos se reutilizan. Si han caducado, se intenta obtenerlos de nuevo.

---

## Autopsia del proyecto

Durante el desarrollo se han tomado varias decisiones para organizar el código y mejorar el funcionamiento de la aplicación.

### 1. Separar el código en diferentes módulos

La decisión fue dividir el código en varios archivos, separando las peticiones, la lógica, el renderizado y la inicialización.

Una alternativa habría sido escribir todo el código en un único archivo JavaScript. Sin embargo, separar las responsabilidades facilita encontrar errores y modificar una parte sin tener que revisar toda la aplicación.

### 2. Utilizar Promise.all para las peticiones

Se ha utilizado Promise.all para ejecutar varias peticiones independientes de forma concurrente, en lugar de esperar a que termine cada una antes de comenzar la siguiente.

Esto permite reducir el tiempo de espera. Además, los errores de cada marca se controlan por separado para intentar cargar el resto del catálogo aunque alguna petición falle.

### 3. Añadir una caché de 24 horas

Se ha añadido una caché con localStorage para evitar repetir constantemente las mismas peticiones a las APIs.

Otra opción habría sido obtener todos los datos cada vez que se abre la página. La caché permite aprovechar los resultados anteriores y reducir las peticiones, aunque existe la posibilidad de que algunos datos no estén completamente actualizados hasta que caduquen.

### 4. Permitir que el catálogo funcione sin todas las imágenes

Se ha decidido que, si falla la búsqueda de una imagen, el coche siga apareciendo en el catálogo.

La alternativa habría sido detener la carga completa cuando alguna imagen no estuviera disponible. Se ha preferido mantener el resto de los resultados porque las imágenes dependen de un servicio externo y su disponibilidad no siempre está garantizada.

---

## Uso de inteligencia artificial

ChatGPT se ha utilizado de forma intensiva durante el desarrollo del proyecto. Gran parte del código se ha generado con ayuda de IA, incluyendo funcionalidades de JavaScript, estilos CSS, organización de los módulos, animaciones, gestión de errores y la implementación de la caché.

También se ha utilizado para resolver dudas, corregir errores, proponer mejoras y preparar la documentación.

Mi participación ha consistido en definir la idea y las funcionalidades de la aplicación, indicar los cambios que quería realizar, probar el resultado e ir ajustando el proyecto durante el desarrollo.

Reconozco que la inteligencia artificial ha tenido un papel importante en la implementación. Por eso, considero importante revisar el código y comprender cómo funciona, especialmente los conceptos relacionados con las peticiones asíncronas, los métodos de arrays, los módulos y la manipulación del DOM.

---

## Objetivo del proyecto

El objetivo principal ha sido desarrollar una aplicación que permita trabajar con APIs públicas y poner en práctica los conceptos de JavaScript vistos en la asignatura.

Además, el proyecto incluye gestión de errores, almacenamiento local y separación del código en módulos, buscando que la aplicación sea más organizada y fácil de mantener.

---

## Repositorio

https://github.com/sukhman1920/Async-odyssey
