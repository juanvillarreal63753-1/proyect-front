import { proyecto } from "../config/proyecto.js";

export async function consultar(ruta, { signal } = {}) {
  const respuesta = await fetch(`${proyecto.api}${ruta}`, {
    signal,
    headers: { Accept: "application/json" },
  });

  let datos;
  try {
    datos = await respuesta.json();
  } catch {
    throw new Error("La API devolvió una respuesta que no es JSON.");
  }

  if (!respuesta.ok) {
    const error = new Error(
      datos?.error?.mensaje || `No se pudo consultar la API (HTTP ${respuesta.status}).`,
    );
    error.codigo = datos?.error?.codigo;
    error.campos = datos?.error?.campos;
    throw error;
  }
  return datos;
}
