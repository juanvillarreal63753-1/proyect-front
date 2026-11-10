import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import LayoutPublico from "../components/LayoutPublico/LayoutPublico.jsx";
import HeroTaquilla from "../components/HeroTaquilla/HeroTaquilla.jsx";
import BuscadorEventos from "../components/BuscadorEventos/BuscadorEventos.jsx";
import CategoriasEventos from "../components/CategoriasEventos/CategoriasEventos.jsx";
import SeccionEventos from "../components/SeccionEventos/SeccionEventos.jsx";
import AficheEvento from "../components/AficheEvento/AficheEvento.jsx";
import DialogoDetalle from "../components/DialogoDetalle/DialogoDetalle.jsx";
import { usePreferencias } from "../context/PreferenciasContext.jsx";
import { useDetalle } from "../hooks/useDetalle.js";
import { useEventos } from "../hooks/useEventos.js";
import { useRecurso } from "../hooks/useRecurso.js";
import {
  eventos as eventosLocales,
  categorias as categoriasLocales,
  categoriasEn,
  dinero,
} from "../data/catalogo.js";
import {
  adaptarEventos,
  adaptarCategorias,
  adaptarCiudades,
} from "../data/adaptadores.js";

export default function Home() {
  const { idioma } = usePreferencias();
  const navegar = useNavigate();
  const en = idioma === "en";
  const { detalle, setDetalle } = useDetalle(idioma);

  // Datos reales de la API. Si el servicio falla, se conserva el catálogo local
  // para que la página no quede en blanco.
  const recursoEventos = useRecurso("/eventos");
  const recursoDestacados = useRecurso("/eventos/destacados");
  const recursoCategorias = useRecurso("/categorias");
  const recursoCiudades = useRecurso("/ciudades");

  const eventosApi = useMemo(
    () => adaptarEventos(recursoEventos.datos?.datos ?? recursoEventos.datos),
    [recursoEventos.datos],
  );
  const destacadosApi = useMemo(
    () =>
      adaptarEventos(recursoDestacados.datos?.datos ?? recursoDestacados.datos),
    [recursoDestacados.datos],
  );
  const eventos = eventosApi.length ? eventosApi : eventosLocales;
  const destacados = destacadosApi.length ? destacadosApi : eventos;
  const categoriasApi = useMemo(
    () =>
      adaptarCategorias(
        recursoCategorias.datos?.datos ?? recursoCategorias.datos,
      ),
    [recursoCategorias.datos],
  );
  const categorias = categoriasApi.length ? categoriasApi : categoriasLocales;
  const ciudadesApi = useMemo(
    () =>
      adaptarCiudades(recursoCiudades.datos?.datos ?? recursoCiudades.datos),
    [recursoCiudades.datos],
  );
  const ciudades = ciudadesApi.length
    ? ciudadesApi
    : ["Manizales", "Pereira", "Bogotá", "Medellín", "Armenia"];

  const { filtros, resultados, buscar, setFiltros, filtrarCategoria } =
    useEventos(eventos);
  const cantidades = categorias.map(
    (categoria) =>
      eventos.filter((evento) => evento.categoria === categoria).length,
  );

  function abrirEvento(evento) {
    setDetalle({
      titulo: evento.nombre,
      descripcion: `${evento.horario} · ${evento.lugar}, ${evento.ciudad}`,
      contenido: (
        <div className="resumen-evento">
          <AficheEvento variante={evento.arte} />
          <p>{dinero(evento.precio)} COP</p>
          <small>
            {en
              ? "Event information from the Taquilla catalogue."
              : "Información del evento del catálogo de Taquilla."}
          </small>
        </div>
      ),
      cerrar: en ? "Close" : "Cerrar",
    });
  }

  const cargando = recursoEventos.cargando || recursoDestacados.cargando;
  const errorApi = recursoEventos.error && recursoDestacados.error;

  return (
    <LayoutPublico
      destino="#eventos"
      etiqueta={en ? "Explore" : "Explorar"}
      descripcion={
        en
          ? "Concerts, theatre, sports and festivals in one place."
          : "Conciertos, teatro, deportes y festivales en un solo lugar."
      }
      onCuenta={(tipo) =>
        navegar(tipo === "registro" ? "/registro" : "/ingresar")
      }
    >
      {errorApi && (
        <div className="aviso-api" role="status">
          {en
            ? "The API is not available right now. Showing sample events."
            : "La API no está disponible en este momento. Se muestran eventos de ejemplo."}
          <button
            type="button"
            onClick={() => {
              recursoEventos.recargar();
              recursoDestacados.recargar();
            }}
          >
            {en ? "Try again" : "Reintentar"}
          </button>
        </div>
      )}
      {cargando && (
        <p className="estado-api" role="status">
          {en ? "Loading events…" : "Cargando eventos…"}
        </p>
      )}
      <HeroTaquilla
        en={en}
        destacado={destacados[1] ?? destacados[0] ?? eventosLocales[1]}
        abrirEvento={abrirEvento}
        setFiltros={setFiltros}
        filtrarCategoria={filtrarCategoria}
      >
        <BuscadorEventos
          en={en}
          eventos={eventos}
          ciudades={ciudades}
          onBuscar={buscar}
          filtrosAplicados={filtros}
        />
      </HeroTaquilla>
      <div className="ancho-home">
        <CategoriasEventos
          categorias={categorias}
          categoriasEn={categoriasEn}
          cantidades={cantidades}
          filtros={filtros}
          en={en}
          filtrarCategoria={filtrarCategoria}
        />
        <SeccionEventos
          id="eventos"
          titulo={
            filtros
              ? en
                ? "Search results"
                : "Resultados de búsqueda"
              : en
                ? "Featured events"
                : "Eventos destacados"
          }
          descripcion={
            filtros
              ? `${resultados.length} ${en ? "results" : "resultados"}`
              : en
                ? "Explore our event selection"
                : "Explora nuestra selección de eventos"
          }
          eventos={filtros ? resultados : destacados.slice(0, 4)}
          en={en}
          onAbrir={abrirEvento}
          onVerTodos={() => buscar({})}
        />
        {!filtros && (
          <SeccionEventos
            id="eventos-ciudad"
            titulo={en ? "Events in Manizales" : "Eventos en Manizales"}
            descripcion={
              en
                ? "Discover events in your city"
                : "Descubre los eventos de tu ciudad"
            }
            eventos={eventos
              .filter((evento) => evento.ciudad === "Manizales")
              .slice(0, 4)}
            en={en}
            onAbrir={abrirEvento}
            onVerTodos={() => buscar({ ciudad: "Manizales" })}
          />
        )}
      </div>
      <DialogoDetalle detalle={detalle} onCerrar={() => setDetalle(null)} />
    </LayoutPublico>
  );
}
