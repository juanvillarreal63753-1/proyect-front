import { useId, useRef, useState } from "react";
import Marca from "../Marca/Marca.jsx";
import MenuMovil from "../MenuMovil/MenuMovil.jsx";
import SelectorIdioma from "../SelectorIdioma/SelectorIdioma.jsx";
import { interfaz } from "../../data/interfaz.js";
import { Link } from "react-router-dom";
import "./Navbar.css";
import Accesibilidad from "../Accesibilidad/Accesibilidad.jsx";

export default function Navbar({
  nombre,
  tipo,
  idioma,
  onCambiarIdioma,
  destino,
  etiqueta,
  onCuenta,
}) {
  const [abierto, setAbierto] = useState(false);
  const boton = useRef(null);
  const id = useId();
  const t = interfaz[idioma];

  return (
    <header
      className="cabecera-home"
      onKeyDown={(evento) => {
        if (evento.key === "Escape" && abierto) {
          setAbierto(false);
          boton.current?.focus();
        }
      }}
    >
      <div className="ancho-home fila-cabecera">
        <Marca nombre={nombre} tipo={tipo} />

        <button
          className="ingreso-movil"
          onClick={() => onCuenta("ingresar")}
        >
          {t.ingresar}
        </button>

        <MenuMovil
          abierto={abierto}
          onAlternar={() => setAbierto(!abierto)}
          menuId={id}
          botonRef={boton}
          textos={t}
        />

        <nav
          id={id}
          className={`menu-home ${abierto ? "abierto" : ""}`}
          aria-label={t.navegacion}
        >
          <Link to="/" onClick={() => setAbierto(false)}>
            {t.inicio}
          </Link>

          <Link to="/explorar" onClick={() => setAbierto(false)}>
            {etiqueta}
          </Link>

          <div className="acciones-home">
            {tipo === "taquilla" && (
              <Accesibilidad />
            )}

            <SelectorIdioma
              idioma={idioma}
              onCambiar={onCambiarIdioma}
              etiqueta={t.idioma}
            />

            {/* 2. Botón con el icono de Lucide integrando accesibilidad */}
            

            <button
              className="ingresar-home"
              onClick={() => onCuenta("ingresar")}
            >
              {t.ingresar}
            </button>

            <button
              className="boton-home primario"
              onClick={() => onCuenta("registro")}
            >
              {t.registro}
            </button>
          </div>
        </nav>
      </div>
    </header>
  );
}