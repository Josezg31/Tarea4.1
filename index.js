// Importamos las bibliotecas necesarias.
// Concretamente el framework express y ciertas librerías de mongodb.
const express = require("express");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger.json");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

// Inicializamos la aplicación
const app = express();

// URL de conexión
const uri = "mongodb+srv://josezarzuelagarcia:X0H5GWRjYM62NCur@cluster0.8u7qd.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";// Indicamos que la aplicación puede recibir JSON (API Rest)

// Indicamos que la aplicación puede recibir JSON (API Rest)
app.use(express.json());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Indicamos el puerto en el que vamos a desplegar la aplicación
// eslint-disable-next-line no-undef
const port = process.env.PORT || 8080;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});
let db;

async function run() {
  try {
    console.log("Intentando conectar a MongoDB...");
    await client.connect();
    console.log("Conexión exitosa a MongoDB!");

    const database = client.db("concesionariosDB");
    console.log("Base de datos seleccionada:", database.databaseName);
    
    const concesionariosCollection = database.collection("concesionarios");

    // GET /concesionarios
    app.get("/concesionarios", async (req, res) => {
      try {
        const concesionarios = await concesionariosCollection.find({}).toArray();
        res.json(concesionarios);
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
    });

    // POST /concesionarios
    app.post("/concesionarios", async (req, res) => {
      try {
        const concesionario = req.body;
        const result = await concesionariosCollection.insertOne(concesionario);
        res.json(result);
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
    });

    // GET /concesionarios/:id
    app.get("/concesionarios/:id", async (req, res) => {
      try {
        const id = new ObjectId(req.params.id);
        const concesionario = await concesionariosCollection.findOne({ _id: id });
        if (concesionario) {
          res.json(concesionario);
        } else {
          res.status(404).json({ message: "Concesionario no encontrado" });
        }
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
    });

    // PUT /concesionarios/:id
    app.put("/concesionarios/:id", async (req, res) => {
      try {
        const id = new ObjectId(req.params.id);
        const updateData = req.body;
        const result = await concesionariosCollection.updateOne(
          { _id: id },
          { $set: updateData }
        );
        if (result.matchedCount === 0) {
          res.status(404).json({ message: "Concesionario no encontrado" });
        } else {
          res.json({ message: "Concesionario actualizado" });
        }
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
    });

    // DELETE /concesionarios/:id
    app.delete("/concesionarios/:id", async (req, res) => {
      try {
        const id = new ObjectId(req.params.id);
        const result = await concesionariosCollection.deleteOne({ _id: id });
        if (result.deletedCount === 0) {
          res.status(404).json({ message: "Concesionario no encontrado" });
        } else {
          res.json({ message: "Concesionario eliminado" });
        }
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
    });

    // GET /concesionarios/:id/coches
    app.get("/concesionarios/:id/coches", async (req, res) => {
      try {
        const id = new ObjectId(req.params.id);
        const concesionario = await concesionariosCollection.findOne({ _id: id });
        if (concesionario && concesionario.coches) {
          res.json(concesionario.coches);
        } else {
          res.status(404).json({ message: "Concesionario o coches no encontrados" });
        }
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
    });

    // POST /concesionarios/:id/coches
    app.post("/concesionarios/:id/coches", async (req, res) => {
      try {
        const id = new ObjectId(req.params.id);
        const nuevoCoche = { ...req.body, id: new ObjectId() };
        const result = await concesionariosCollection.updateOne(
          { _id: id },
          { $push: { coches: nuevoCoche } }
        );
        if (result.matchedCount === 0) {
          res.status(404).json({ message: "Concesionario no encontrado" });
        } else {
          res.json({ message: "Coche añadido" });
        }
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
    });

    // GET /concesionarios/:id/coches/:cocheIndex
    app.get("/concesionarios/:id/coches/:cocheIndex", async (req, res) => {
      try {
        const id = new ObjectId(req.params.id);
        const cocheIndex = parseInt(req.params.cocheIndex); // Convertir el índice a número
        const concesionario = await concesionariosCollection.findOne({ _id: id });
        if (concesionario && concesionario.coches) {
          if (cocheIndex >= 0 && cocheIndex < concesionario.coches.length) {
            const coche = concesionario.coches[cocheIndex]; // Obtener el coche por índice
            res.json(coche);
          } else {
            res.status(404).json({ message: "Índice de coche no válido" });
          }
        } else {
          res.status(404).json({ message: "Concesionario no encontrado" });
        }
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
    });

    // PUT /concesionarios/:id/coches/:cocheIndex
    app.put("/concesionarios/:id/coches/:cocheIndex", async (req, res) => {
      try {
        const id = new ObjectId(req.params.id);
        const cocheIndex = parseInt(req.params.cocheIndex); // Convertir el índice a número
        const cocheActualizado = req.body;
        const concesionario = await concesionariosCollection.findOne({ _id: id });

        if (concesionario && concesionario.coches) {
          if (cocheIndex >= 0 && cocheIndex < concesionario.coches.length) {
            const result = await concesionariosCollection.updateOne(
              { _id: id },
              { $set: { [`coches.${cocheIndex}`]: cocheActualizado } } // Actualizar el coche por índice
            );
            if (result.matchedCount === 0) {
              res.status(404).json({ message: "Concesionario no encontrado" });
            } else {
              res.json({ message: "Coche actualizado" });
            }
          } else {
            res.status(404).json({ message: "Índice de coche no válido" });
          }
        } else {
          res.status(404).json({ message: "Concesionario no encontrado" });
        }
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
    });

    // DELETE /concesionarios/:id/coches/:cocheIndex
    app.delete("/concesionarios/:id/coches/:cocheIndex", async (req, res) => {
      try {
        const id = new ObjectId(req.params.id);
        const cocheIndex = parseInt(req.params.cocheIndex); // Convertir el índice a número
        const concesionario = await concesionariosCollection.findOne({ _id: id });

        if (concesionario && concesionario.coches) {
          if (cocheIndex >= 0 && cocheIndex < concesionario.coches.length) {
            const result = await concesionariosCollection.updateOne(
              { _id: id },
              { $pull: { coches: concesionario.coches[cocheIndex] } } // Eliminar el coche por índice
            );
            if (result.matchedCount === 0) {
              res.status(404).json({ message: "Concesionario no encontrado" });
            } else {
              res.json({ message: "Coche eliminado" });
            }
          } else {
            res.status(404).json({ message: "Índice de coche no válido" });
          }
        } else {
          res.status(404).json({ message: "Concesionario no encontrado" });
        }
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
    });

    // Mover el app.listen dentro del try para asegurar que la BD está conectada
    app.listen(port, () => {
      console.log(`Servidor desplegado en http://localhost:${port}`);
      console.log(`Documentación disponible en http://localhost:${port}/api-docs`);
    });

  } catch (error) {
    console.error("Error de conexión:", error);
    process.exit(1); // Terminar el proceso si hay error
  }
}

// Ejecutar la función principal
console.log("Iniciando servidor...");
run().catch((error) => {
  console.error("Error fatal:", error);
  process.exit(1);
});
