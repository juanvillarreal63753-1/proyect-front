function listaDe(valor) {
  if (Array.isArray(valor)) return valor;
  if (Array.isArray(valor?.datos)) return valor.datos;
  if (Array.isArray(valor?.eventos)) return valor.eventos;
  if (Array.isArray(valor?.items)) return valor.items;
  return [];
}

function texto(valor, alternativo = "") {
  if (typeof valor === "string" || typeof valor === "number") return String(valor);
  if (valor && typeof valor === "object") {
    return valor.nombre ?? valor.titulo ?? valor.name ?? alternativo;
  }
  return alternativo;
}

function normalizarCategoria(valor) {
  const categoria = texto(valor).trim().toLowerCase();
  const equivalencias = {
    conciertos: "Conciertos",
    concierto: "Conciertos",
    teatro: "Teatro",
    deportes: "Deportes",
    deporte: "Deportes",
    festivales: "Festivales",
    festival: "Festivales",
    comedia: "Comedia",
    familiares: "Familiares",
    familiar: "Familiares",
  };
  return equivalencias[categoria] ?? (categoria ? categoria[0].toUpperCase() + categoria.slice(1) : "Conciertos");
}

function convertirPrecio(valor) {
  if (valor === null || valor === undefined || valor === "") return null;
  if (typeof valor === "number") return Number.isFinite(valor) ? valor : null;
  const numero = Number(String(valor).replace(/[^0-9,.-]/g, "").replace(/\.(?=.*\.)/g, "").replace(",", "."));
  return Number.isFinite(numero) ? numero : null;
}

export function adaptarEventos(respuesta) {
  return listaDe(respuesta).map((item, indice) => {
    const categoria = normalizarCategoria(item.categoria ?? item.categoria_nombre);
    const fecha = String(item.fecha ?? item.fecha_evento ?? "2026-11-14").slice(0, 10);
    // La API de Taquilla entrega el precio mínimo en precioDesde.
    const precio = convertirPrecio(
      item.precioDesde ?? item.precio_desde ?? item.precio ?? item.valor ?? item.precio_minimo
    );
    const ciudad = texto(item.ciudad ?? item.municipio ?? item.recinto?.ciudad, "Manizales");
    const lugar = texto(item.lugar ?? item.escenario ?? item.ubicacion ?? item.recinto?.nombre, "Por confirmar");
    const nombre = texto(item.nombre ?? item.titulo ?? item.evento, `Evento ${indice + 1}`);
    const horario = texto(item.horario ?? item.fecha_texto, "") ||
      new Date(`${fecha}T12:00:00`).toLocaleDateString("es-CO", {
        weekday: "short", day: "numeric", month: "short",
      });
    return {
      ...item,
      id: item.id ?? item.evento_id ?? indice,
      nombre,
      categoria,
      etiqueta: texto(item.etiqueta, categoria.replace(/s$/i, "")),
      fecha,
      horario,
      lugar,
      ciudad,
      precio,
      arte: Number.isInteger(Number(item.arte)) ? Number(item.arte) % 8 : indice % 8,
    };
  }).filter((evento) => evento.nombre);
}

export function adaptarCategorias(respuesta) {
  return listaDe(respuesta)
    .map((item) => normalizarCategoria(item.nombre ?? item.categoria ?? item))
    .filter(Boolean);
}

export function adaptarCiudades(respuesta) {
  return listaDe(respuesta)
    .map((item) => texto(item.nombre ?? item.ciudad ?? item, ""))
    .filter(Boolean);
}

