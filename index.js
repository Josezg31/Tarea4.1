/**
 * Tres formas de almacenar valores en memoria en javascript:
 *      let: se puede modificar
 *      var: se puede modificar
 *      const: es constante y no se puede modificar
 */

// Importamos las bibliotecas necesarias.
// Concretamente el framework express.
const express = require("express");

// Inicializamos la aplicación
const app = express();

// Indicamos que la aplicación puede recibir JSON (API Rest)
app.use(express.json());

// Indicamos el puerto en el que vamos a desplegar la aplicación
const port = process.env.PORT || 8080;

// Arrancamos la aplicación
app.listen(port, () => {
  console.log(`Servidor desplegado en puerto: ${port}`);
});
let concesionarios = [ { nombre: "Concesionario A", direccion: "Calle Falsa 123", coches: 
  [ 
    { modelo: "Corsa", cv: 90, precio: 15000 }, 
    { modelo: "Astra", cv: 110, precio: 20000 }, 
  ], 
    }, 
    { nombre: "Concesionario B", direccion: "Avenida Siempre Viva 742", coches: 
  [ 
    { modelo: "Clio", cv: 75, precio: 13000 }, 
    { modelo: "Megane", cv: 100, precio: 18000 }, 
  ], 
    }, 
  ];

// Definimos una estructura de datos
// (temporal hasta incorporar una base de datos)
let coches = [
  { marca: "Renault", modelo: "Clio" },
  { marca: "Nissan", modelo: "Skyline R34" },
];

// Obtener todos los concesionarios 
app.get("/concesionarios", (request, response) => { 
  response.json(concesionarios);
});
// Crear un nuevo concesionario
app.post("/concesionarios", (request, response) => { 
  concesionarios.push(request.body); 
  response.json({ message: "Concesionario creado" }); 
});
// Obtener un concesionario por ID 
app.get("/concesionarios/:id", (request, response) => { 
  const id = request.params.id; 
  const result = concesionarios[id]; 
  response.json({ result }); 
});
// Actualizar un concesionario por ID
app.put("/concesionarios/:id", (request, response) => { 
  const id = request.params.id; 
  concesionarios[id] = request.body; 
  response.json({ message: "Concesionario actualizado" }); 
});
// Actualizar un concesionario por ID 
app.put("/concesionarios/:id", (request, response) => { 
  const id = request.params.id; 
  concesionarios[id] = request.body; 
  response.json({ message: "Concesionario actualizado" }); 
});
// Borrar un concesionario por ID 
app.delete("/concesionarios/:id", (request, response) => { 
  const id = request.params.id; 
  concesionarios = concesionarios.filter((item, index) => index != id); 
  response.json({ message: "Concesionario borrado" });
});
// Obtener todos los coches de un concesionario por ID 
app.get("/concesionarios/:id/coches", (request, response) => { 
  const id = request.params.id; 
  const result = concesionarios[id].coches; 
  response.json({ result }); 
});
// Añadir un nuevo coche a un concesionario por ID 
app.post("/concesionarios/:id/coches", (request, response) => { 
  const id = request.params.id; 
  concesionarios[id].coches.push(request.body); 
  response.json({ message: "Coche añadido" }); 
});
// Obtener un coche por ID de un concesionario por ID 
app.get("/concesionarios/:id/coches/:cocheId", (request, response) => { 
  const id = request.params.id; 
  const cocheId = request.params.cocheId; 
  const result = concesionarios[id].coches[cocheId]; 
  response.json({ result });
});
// Actualizar un coche por ID de un concesionario por ID 
app.put("/concesionarios/:id/coches/:cocheId", (request, response) => { 
  const id = request.params.id; 
  const cocheId = request.params.cocheId; 
  concesionarios[id].coches[cocheId] = request.body; 
  response.json({ message: "Coche actualizado" }); 
});
// Borrar un coche por ID de un concesionario por ID 
app.delete("/concesionarios/:id/coches/:cocheId", (request, response) => { 
  const id = request.params.id; 
  const cocheId = request.params.cocheId; 
  concesionarios[id].coches = concesionarios[id].coches.filter( (item, index) => index != cocheId 
);
 response.json({ message: "Coche borrado" }); 
});
// Lista todos los coches
app.get("/coches", (request, response) => {
  response.json(coches);
});

// Añadir un nuevo coche
app.post("/coches", (request, response) => {
  coches.push(request.body);
  response.json({ message: "ok" });
});

// Obtener un solo coche
app.get("/coches/:id", (request, response) => {
  const id = request.params.id;
  const result = coches[id];
  response.json({ result });
});

// Actualizar un solo coche
app.put("/coches/:id", (request, response) => {
  const id = request.params.id;
  coches[id] = request.body;
  response.json({ message: "ok" });
});

// Borrar un elemento del array
app.delete("/coches/:id", (request, response) => {
  const id = request.params.id;
  coches = coches.filter((item) => coches.indexOf(item) !== id);

  response.json({ message: "ok" });
});
