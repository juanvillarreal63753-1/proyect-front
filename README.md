# Taquilla

Proyecto React + Vite. Integra el diseño y los componentes del proyecto del profesor con la estructura de trabajo entregada por el estudiante.

## Instalar y ejecutar

Necesitas Node.js 20.19 o superior (rama 20), o Node.js 22.12 o superior.

En la terminal, abre la carpeta `taquilla` (la que contiene `package.json`) y ejecuta:

```bash
npm install
npm run dev
```

Abre la dirección local que Vite muestre en la terminal.

Para comprobar la compilación:

```bash
npm run build
npm run preview
```

## Integración de la API

La URL base está en `src/config/proyecto.js`. Por defecto se conecta a:

`https://yanethm-taquilla-api.fly.dev/api/v1`

Se consultan estos recursos:

- `GET /eventos`
- `GET /eventos/destacados`
- `GET /categorias`
- `GET /ciudades`

El cliente HTTP está en `src/services/api.js` y el hook `src/hooks/useRecurso.js` gestiona carga, errores, cancelación de peticiones y reintentos. `src/data/adaptadores.js` convierte la respuesta de la API al formato que utilizan las tarjetas.

Si la API no responde, el home muestra los eventos locales de ejemplo y un aviso; así la página no queda en blanco. Los filtros se aplican en el navegador sobre los eventos recibidos. La disponibilidad real de la API, sus datos actuales y las políticas CORS deben comprobarse al ejecutar el proyecto con conexión a internet.

Puedes cambiar la URL base creando un archivo `.env` a partir de `.env.example` y definiendo `VITE_API_URL`. No pongas contraseñas ni claves privadas en variables `VITE_`, porque se publican en el navegador.

## Estructura

- `src/pages/Home.jsx`: composición del inicio y conexión de los recursos de API.
- `src/components/`: componentes visuales reutilizables; cada componente mantiene su CSS.
- `src/hooks/`: lógica para eventos, diálogos y peticiones.
- `src/services/`: comunicación HTTP y preferencias de cookies.
- `src/context/`: idioma y consentimiento.
- `src/data/`: catálogo local de respaldo, traducciones y adaptadores de respuesta.
- `src/styles/`: tokens visuales y estilos globales.

## Alcance

La aplicación implementa el home público y una ficha de detalle de demostración. El registro, el inicio de sesión, la compra y la reserva de entradas no se realizan todavía; los botones de cuenta muestran un aviso informativo.


## Navegación y página Explorar

El proyecto usa `react-router-dom` con las rutas `/` (Inicio) y `/explorar` (listado de eventos).

Después de descomprimir, ejecuta `npm install` para instalar/actualizar dependencias y luego `npm run dev`.

Configura la API en `.env` usando `VITE_API_URL=https://yanethm-taquilla-api.fly.dev/api/v1`.


## Registro e inicio de sesión

Se agregaron las rutas `/registro` y `/ingresar`, junto con `src/context/SesionContext.jsx`.
La autenticación utiliza la cookie httpOnly de sesión de la API (`credentials: "include"`); el token no se guarda en `localStorage`.

La API debe permitir CORS con credenciales desde el origen exacto del frontend (por ejemplo, `http://localhost:5173`). Si el navegador muestra un error CORS o no conserva la cookie, el servidor debe autorizar ese origen y configurar correctamente la cookie para el entorno de desarrollo. No se puede leer una cookie httpOnly desde JavaScript.

El registro envía `nombre`, `correo` y `clave`. La verificación del correo y recuperación de contraseña aún no están conectadas a una pantalla.
