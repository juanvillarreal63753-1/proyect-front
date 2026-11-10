import { proyecto } from "../config/proyecto.js";

async function solicitar(ruta, metodo = "GET", datos = null) {
  const opciones = {
    method: metodo,
    credentials: "include",
    headers: {
      Accept: "application/json",
    },
  };

  if (datos !== null) {
    opciones.headers["Content-Type"] = "application/json";
    opciones.body = JSON.stringify(datos);
  }

  let respuesta;
  try {
    respuesta = await fetch(`${proyecto.api}${ruta}`, opciones);
  } catch {
    throw new Error(
      "No se pudo conectar con la API. Revisa tu conexión y la configuración CORS del servidor."
    );
  }

  const resultado = await respuesta.json().catch(() => ({}));

  if (!respuesta.ok) {
    const error = new Error(
      resultado?.error?.mensaje ||
      resultado?.mensaje ||
      resultado?.detail ||
      `Ocurrió un error (HTTP ${respuesta.status}).`
    );
    error.codigo = resultado?.error?.codigo || resultado?.codigo || "error_api";
    error.estado = respuesta.status;
    throw error;
  }

  return resultado;
}

export async function registrarCuenta({ nombre, correo, clave }) {
  return solicitar("/usuarios", "POST", { nombre, correo, clave });
}

export async function ingresar({ correo, clave }) {
  const resultado = await solicitar("/sesion", "POST", { correo, clave });
  return resultado.usuario;
}

export async function verSesion() {
  try {
    const resultado = await solicitar("/sesion");
    return resultado.usuario;
  } catch (error) {
    if (error.estado === 401) {
      return null;
    }

    throw error;
  }
}

export async function cerrarSesion() {
  return solicitar("/sesion", "DELETE");
}

export async function verificarCorreo(datos) {
  return solicitar("/verificacion", "POST", datos);
}
