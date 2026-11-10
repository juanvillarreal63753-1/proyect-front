import { useState } from "react";
import { usePreferencias } from "../../context/PreferenciasContext.jsx";
import "./Accesibilidad.css";

export default function Accesibilidad() {
  const { accesibilidad, cambiarAccesibilidad, restablecerAccesibilidad } =
    usePreferencias();

  const [abierto, setAbierto] = useState(false);

  function cambiarTamano(cantidad) {
    const nuevoTamano = Math.min(
      130,
      Math.max(90, accesibilidad.tamanoTexto + cantidad),
    );

    cambiarAccesibilidad("tamanoTexto", nuevoTamano);
  }

  return (
    <div className="accesibilidad-contenedor">
      <button
        className="accesibilidad-boton"
        onClick={() => setAbierto(!abierto)}
        aria-expanded={abierto}
        aria-controls="panel-accesibilidad"
        aria-label="Abrir opciones de accesibilidad"
        title="Accesibilidad"
      >
        <span aria-hidden="true">♿</span>
      </button>

      {abierto && (
        <section
          id="panel-accesibilidad"
          className="accesibilidad-panel"
          aria-label="Opciones de accesibilidad"
        >
          <div className="accesibilidad-encabezado">
            <h2>Accesibilidad</h2>

            <button onClick={() => setAbierto(false)} aria-label="Cerrar menú">
              ×
            </button>
          </div>

          {/* TAMAÑO DEL TEXTO */}

          <div className="accesibilidad-grupo">
            <strong>Tamaño del texto</strong>

            <div className="tamano-controles">
              <button
                onClick={() => cambiarTamano(-10)}
                disabled={accesibilidad.tamanoTexto <= 90}
                aria-label="Disminuir tamaño del texto"
              >
                −
              </button>

              <span>{accesibilidad.tamanoTexto}%</span>

              <button
                onClick={() => cambiarTamano(10)}
                disabled={accesibilidad.tamanoTexto >= 130}
                aria-label="Aumentar tamaño del texto"
              >
                +
              </button>
            </div>
          </div>

          {/* ALTO CONTRASTE */}

          <label className="accesibilidad-opcion">
            <span>
              <strong>Alto contraste</strong>
              <small>Más diferencia entre el texto y el fondo.</small>
            </span>

            <input
              type="checkbox"
              checked={accesibilidad.altoContraste}
              onChange={(e) =>
                cambiarAccesibilidad("altoContraste", e.target.checked)
              }
            />
          </label>

          {/* REDUCIR MOVIMIENTO */}

          <label className="accesibilidad-opcion">
            <span>
              <strong>Reducir movimiento</strong>
              <small>Sin animaciones ni transiciones.</small>
            </span>

            <input
              type="checkbox"
              checked={accesibilidad.reducirMovimiento}
              onChange={(e) =>
                cambiarAccesibilidad("reducirMovimiento", e.target.checked)
              }
            />
          </label>

          {/* SUBRAYAR ENLACES */}

          <label className="accesibilidad-opcion">
            <span>
              <strong>Subrayar enlaces</strong>
              <small>Los enlaces se distinguen sin depender del color.</small>
            </span>

            <input
              type="checkbox"
              checked={accesibilidad.subrayarEnlaces}
              onChange={(e) =>
                cambiarAccesibilidad("subrayarEnlaces", e.target.checked)
              }
            />
          </label>

          {/* ESPACIADO */}

          <label className="accesibilidad-opcion">
            <span>
              <strong>Espaciado de lectura</strong>
              <small>Más espacio entre líneas y letras.</small>
            </span>

            <input
              type="checkbox"
              checked={accesibilidad.espaciadoLectura}
              onChange={(e) =>
                cambiarAccesibilidad("espaciadoLectura", e.target.checked)
              }
            />
          </label>

          {/* DECLARACIÓN */}

          <details className="accesibilidad-declaracion">
            <summary>Declaración de accesibilidad</summary>

            <p>
              Taquilla busca ofrecer una experiencia accesible para todos los
              usuarios, facilitando la lectura, la navegación y el uso de sus
              funcionalidades.
            </p>
          </details>

          {/* RESTABLECER */}

          <button
            className="accesibilidad-restablecer"
            onClick={restablecerAccesibilidad}
          >
            Restablecer
          </button>
        </section>
      )}
    </div>
  );
}
