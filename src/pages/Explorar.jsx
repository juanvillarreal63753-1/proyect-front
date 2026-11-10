import { useMemo, useState } from "react";
import LayoutPublico from "../components/LayoutPublico/LayoutPublico.jsx";
import TarjetaEvento from "../components/TarjetaEvento/TarjetaEvento.jsx";
import DialogoDetalle from "../components/DialogoDetalle/DialogoDetalle.jsx";
import AficheEvento from "../components/AficheEvento/AficheEvento.jsx";
import { usePreferencias } from "../context/PreferenciasContext.jsx";
import { useRecurso } from "../hooks/useRecurso.js";
import { adaptarEventos } from "../data/adaptadores.js";
import { dinero } from "../data/catalogo.js";
import { consultar } from "../services/api.js";
import "./Explorar.css";

export default function Explorar() {
  const { idioma } = usePreferencias();
  const en = idioma === "en";
  const recurso = useRecurso("/eventos");
  const [busqueda, setBusqueda] = useState("");
  const [categoria, setCategoria] = useState("");
  const [ciudad, setCiudad] = useState("");
  const [orden, setOrden] = useState("fecha");
  const [detalle, setDetalle] = useState(null);

  const eventos = useMemo(
    () => adaptarEventos(recurso.datos?.datos ?? recurso.datos),
    [recurso.datos],
  );
  const categorias = [...new Set(eventos.map((evento) => evento.categoria))];
  const ciudades = [...new Set(eventos.map((evento) => evento.ciudad))];
  const resultados = eventos
    .filter((evento) =>
      `${evento.nombre} ${evento.categoria} ${evento.lugar} ${evento.ciudad}`
        .toLowerCase().includes(busqueda.toLowerCase())
    )
    .filter((evento) => !categoria || evento.categoria === categoria)
    .filter((evento) => !ciudad || evento.ciudad === ciudad)
    .sort((a, b) => {
      if (orden === "precio") return (a.precio ?? 0) - (b.precio ?? 0);
      if (orden === "popularidad") return (b.disponibilidad?.porcentajeVendido ?? 0) - (a.disponibilidad?.porcentajeVendido ?? 0);
      return new Date(a.fecha) - new Date(b.fecha);
    });

  async function abrirEvento(evento) {
    setDetalle({ titulo: en ? "Loading event..." : "Cargando evento...", descripcion: en ? "Please wait." : "Por favor espera.", cerrar: en ? "Close" : "Cerrar" });
    try {
      const respuesta = await consultar(`/eventos/${evento.slug}`);
      const datos = respuesta.datos ?? respuesta;
      setDetalle({
        titulo: datos.titulo ?? datos.nombre ?? evento.nombre,
        descripcion: datos.descripcion ?? "",
        contenido: (
          <div className="resumen-evento">
            <AficheEvento variante={evento.arte} />
            <p><strong>{en ? "Category: " : "Categoría: "}</strong>{evento.categoria}</p>
            <p><strong>{en ? "Date: " : "Fecha: "}</strong>{new Date(datos.fecha ?? evento.fecha).toLocaleString(en ? "en-US" : "es-CO", { dateStyle: "long", timeStyle: "short" })}</p>
            <p><strong>{en ? "Venue: " : "Recinto: "}</strong>{datos.recinto?.nombre ?? evento.lugar}</p>
            <p><strong>{en ? "Address: " : "Dirección: "}</strong>{datos.recinto?.direccion ?? "—"}</p>
            <p><strong>{en ? "City: " : "Ciudad: "}</strong>{datos.recinto?.ciudad ?? evento.ciudad}</p>
            <p><strong>{en ? "Price: " : "Precio: "}</strong>{dinero(datos.precioDesde ?? evento.precio)} COP</p>
          </div>
        ),
        cerrar: en ? "Close" : "Cerrar",
      });
    } catch (error) {
      setDetalle({ titulo: "Error", descripcion: en ? "Could not load event information." : "No se pudo cargar la información del evento.", cerrar: en ? "Close" : "Cerrar" });
      console.error("Error al consultar el evento:", error);
    }
  }

  return (
    <LayoutPublico destino="/" etiqueta={en ? "Home" : "Inicio"} descripcion={en ? "Find your next event with Taquilla." : "Encuentra tu próximo evento con Taquilla."}>
      <section className="ancho-home explorar-pagina">
        <div className="explorar-encabezado">
          <p className="explorar-ceja">TAQUILLA</p>
          <h1>{en ? "Explore events" : "Explorar eventos"}</h1>
          <p>{en ? "Find concerts, theatre, sports and festivals." : "Encuentra conciertos, teatro, deportes y festivales."}</p>
        </div>
        <div className="explorar-filtros">
          <label>{en ? "Search" : "Buscar"}<input value={busqueda} onChange={(e) => setBusqueda(e.target.value)} placeholder={en ? "Event or artist" : "Evento o artista"} /></label>
          <label>{en ? "Category" : "Categoría"}<select value={categoria} onChange={(e) => setCategoria(e.target.value)}><option value="">{en ? "All categories" : "Todas las categorías"}</option>{categorias.map((valor) => <option key={valor} value={valor}>{valor}</option>)}</select></label>
          <label>{en ? "City" : "Ciudad"}<select value={ciudad} onChange={(e) => setCiudad(e.target.value)}><option value="">{en ? "All cities" : "Todas las ciudades"}</option>{ciudades.map((valor) => <option key={valor} value={valor}>{valor}</option>)}</select></label>
          <label>{en ? "Sort by" : "Ordenar por"}<select value={orden} onChange={(e) => setOrden(e.target.value)}><option value="fecha">{en ? "Date" : "Fecha"}</option><option value="precio">{en ? "Price" : "Precio"}</option><option value="popularidad">{en ? "Popularity" : "Popularidad"}</option></select></label>
        </div>
        {recurso.cargando && <p role="status">{en ? "Loading events…" : "Cargando eventos…"}</p>}
        {recurso.error && <p role="alert">{en ? "Could not load events." : "No se pudieron cargar los eventos."} <button onClick={recurso.recargar}>{en ? "Try again" : "Reintentar"}</button></p>}
        {!recurso.cargando && !recurso.error && <p className="explorar-contador">{resultados.length} {en ? "events found" : "eventos encontrados"}</p>}
        <div className="eventos-grid">
          {resultados.map((evento) => <TarjetaEvento key={evento.id} evento={evento} en={en} onAbrir={abrirEvento} />)}
        </div>
        {!recurso.cargando && !resultados.length && <p className="sin-resultados">{en ? "No events match your search." : "No hay eventos que coincidan con tu búsqueda."}</p>}
      </section>
      <DialogoDetalle detalle={detalle} onCerrar={() => setDetalle(null)} />
    </LayoutPublico>
  );
}
