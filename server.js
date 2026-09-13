// =====================================================
// MICROSERVICIO: msEstado
// Proyecto: Sistema Distribuido de Inventario TIGO
//
// Función:
// Determinar el estado de disponibilidad de un producto
// dependiendo de la cantidad existente en inventario.
//
// Este microservicio será desplegado en Render Cloud.
// =====================================================


// Importamos Express para crear la API REST
const express = require("express");

// Importamos CORS para permitir peticiones
// desde otros microservicios y desde el frontend
const cors = require("cors");


// Creamos la aplicación Express
const app = express();


// =====================================================
// MIDDLEWARES
// =====================================================

// Permitimos solicitudes desde otros orígenes
app.use(cors());

// Permitimos recibir y procesar datos en formato JSON
app.use(express.json());


// =====================================================
// RUTA PRINCIPAL
// Permite comprobar si el microservicio está activo
// =====================================================

app.get("/", (req, res) => {

  res.status(200).json({

    servicio: "msEstado",

    mensaje:
      "Microservicio de estado de inventario funcionando",

    entorno:
      process.env.RENDER
        ? "Cloud - Render"
        : "Local"

  });

});


// =====================================================
// CONSULTAR ESTADO DE STOCK
//
// Ejemplo:
// GET /estado/25
//
// Resultado:
// DISPONIBLE
//
// La cantidad de stock se recibe como parámetro.
// =====================================================

app.get("/estado/:stock", (req, res) => {

  // Convertimos el parámetro recibido a número
  const stock = Number(req.params.stock);


  // ===================================================
  // VALIDACIÓN
  // ===================================================

  // Verificamos que el stock sea un número válido
  // y que no sea negativo
  if (
    Number.isNaN(stock) ||
    stock < 0
  ) {

    return res
      .status(400)
      .json({

        error: true,

        mensaje:
          "La cantidad de stock no es válida"

      });

  }


  // Variable donde guardaremos
  // el estado correspondiente
  let estado;


  // ===================================================
  // REGLAS DE NEGOCIO
  // ===================================================

  // Si no existen unidades
  if (stock === 0) {

    estado = "AGOTADO";

  }

  // Si quedan entre 1 y 10 unidades
  else if (stock <= 10) {

    estado = "STOCK BAJO";

  }

  // Si existen más de 10 unidades
  else {

    estado = "DISPONIBLE";

  }


  // ===================================================
  // RESPUESTA
  // ===================================================

  res.status(200).json({

    error: false,

    stock: stock,

    estado: estado

  });

});


// =====================================================
// PUERTO
//
// En nuestra computadora utilizará el puerto 3003.
//
// Cuando se despliegue en Render,
// Render proporcionará automáticamente su propio puerto.
// =====================================================

const PORT =
  process.env.PORT || 3003;


// =====================================================
// INICIO DEL MICROSERVICIO
// =====================================================

app.listen(
  PORT,
  "0.0.0.0",
  () => {

    console.log(
      "======================================"
    );

    console.log(
      "Microservicio msEstado iniciado"
    );

    console.log(
      `Puerto: ${PORT}`
    );

    console.log(
      `URL local: http://localhost:${PORT}`
    );

    console.log(
      "======================================"
    );

  }
);