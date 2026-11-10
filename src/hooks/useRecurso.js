
import { useEffect, useState } from "react";
import { consultar } from "../services/api.js";

export function useRecurso(ruta) {
  const [estado, setEstado] = useState({
    ruta: null,
    datos: null,
    error: null,
    cargando: true,
  });

  const [intento, setIntento] = useState(0);

  useEffect(() => {
    if (!ruta) return;

    const controlador = new AbortController();
    let vigente = true;

    setEstado({
      ruta,
      datos: null,
      error: null,
      cargando: true,
    });

    async function cargarDatos() {
      try {
        const primeraRespuesta = await consultar(ruta, {
          signal: controlador.signal,
        });

        const paginacion = primeraRespuesta.paginacion;

        // Si la respuesta no tiene paginación,
        // conserva el comportamiento anterior.
        if (!paginacion?.paginas || paginacion.paginas <= 1) {
          if (vigente) {
            setEstado({
              ruta,
              datos: primeraRespuesta,
              error: null,
              cargando: false,
            });
          }
          return;
        }

        // Guardamos los eventos de la primera página.
        let todosLosDatos = [...(primeraRespuesta.datos ?? [])];

        // Solicitamos las páginas restantes.
        for (
          let pagina = 2;
          pagina <= paginacion.paginas;
          pagina++
        ) {
          const respuesta = await consultar(
            `${ruta}?pagina=${pagina}&porPagina=${paginacion.porPagina}`,
            { signal: controlador.signal },
          );

          todosLosDatos = [
            ...todosLosDatos,
            ...(respuesta.datos ?? []),
          ];
        }

        // Conservamos la estructura original de la respuesta.
        const respuestaCompleta = {
          ...primeraRespuesta,
          datos: todosLosDatos,
          paginacion: {
            ...paginacion,
            pagina: 1,
            paginas: 1,
            total: todosLosDatos.length,
          },
        };

        if (vigente) {
          setEstado({
            ruta,
            datos: respuestaCompleta,
            error: null,
            cargando: false,
          });
        }
      } catch (error) {
        if (vigente && error.name !== "AbortError") {
          setEstado({
            ruta,
            datos: null,
            error,
            cargando: false,
          });
        }
      }
    }

    cargarDatos();

    return () => {
      vigente = false;
      controlador.abort();
    };
  }, [ruta, intento]);

  const actual =
    estado.ruta === ruta
      ? estado
      : {
          datos: null,
          error: null,
          cargando: Boolean(ruta),
        };

  return {
    ...actual,
    recargar: () => setIntento((valor) => valor + 1),
  };
}
