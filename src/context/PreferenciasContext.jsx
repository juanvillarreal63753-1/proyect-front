import { createContext, useContext, useEffect, useState } from "react";
import {
  leerCookie,
  guardarCookie,
  borrarCookie,
} from "../services/cookies.js";
import { proyecto } from "../config/proyecto.js";

const PreferenciasContext = createContext(null);

const valoresAccesibilidad = {
  tamanoTexto: 100,
  altoContraste: false,
  reducirMovimiento: false,
  subrayarEnlaces: false,
  espaciadoLectura: false,
};

export function PreferenciasProvider({ children }) {
  const [consentimiento, setConsentimiento] = useState(() => {
    const valor = leerCookie("consentimiento");

    return ["aceptado", "rechazado"].includes(valor)
      ? valor
      : null;
  });

  const [accesibilidad, setAccesibilidad] = useState(() => {
    try {
      const guardado = localStorage.getItem("taquilla-accesibilidad");

      return guardado
        ? {
            ...valoresAccesibilidad,
            ...JSON.parse(guardado),
          }
        : { ...valoresAccesibilidad };
    } catch {
      return { ...valoresAccesibilidad };
    }
  });

  const [idioma, setIdioma] = useState(() => {
    return leerCookie("consentimiento") === "aceptado" &&
      leerCookie("idioma") === "en"
      ? "en"
      : "es";
  });

  const [error, setError] = useState(false);

  // Actualizar idioma y título
  useEffect(() => {
    document.documentElement.lang = idioma;

    document.title = `${proyecto.nombre} · ${
      idioma === "en" ? "Home" : "Inicio"
    }`;
  }, [idioma]);

  // Aplicar preferencias de accesibilidad
  useEffect(() => {
    const raiz = document.documentElement;

    raiz.style.setProperty(
      "--escala-texto",
      `${accesibilidad.tamanoTexto}%`
    );

    raiz.dataset.altoContraste = String(accesibilidad.altoContraste);
    raiz.dataset.reducirMovimiento = String(
      accesibilidad.reducirMovimiento
    );
    raiz.dataset.subrayarEnlaces = String(
      accesibilidad.subrayarEnlaces
    );
    raiz.dataset.espaciadoLectura = String(
      accesibilidad.espaciadoLectura
    );

    try {
      localStorage.setItem(
        "taquilla-accesibilidad",
        JSON.stringify(accesibilidad)
      );
    } catch {
      setError(true);
    }
  }, [accesibilidad]);

  // Cambiar idioma
  function cambiarIdioma(valor) {
    setIdioma(valor);

    try {
      if (consentimiento === "aceptado") {
        guardarCookie("idioma", valor);
      }

      setError(false);
    } catch {
      setError(true);
    }
  }

  // Guardar consentimiento
  function guardarConsentimiento(permitir) {
    try {
      const valor = permitir ? "aceptado" : "rechazado";

      guardarCookie("consentimiento", valor);

      if (permitir) {
        guardarCookie("idioma", idioma);
      } else {
        borrarCookie("idioma");
      }

      setConsentimiento(valor);
      setError(false);

      return true;
    } catch {
      setError(true);
      return false;
    }
  }

  // Cambiar accesibilidad
  function cambiarAccesibilidad(opcion, valor) {
    setAccesibilidad((actual) => ({
      ...actual,
      [opcion]: valor,
    }));
  }

  // Restablecer accesibilidad
  function restablecerAccesibilidad() {
    setAccesibilidad({ ...valoresAccesibilidad });
  }

  return (
    <PreferenciasContext.Provider
      value={{
        idioma,
        cambiarIdioma,
        consentimiento,
        guardarConsentimiento,
        error,
        accesibilidad,
        cambiarAccesibilidad,
        restablecerAccesibilidad,
      }}
    >
      {children}
    </PreferenciasContext.Provider>
  );
}

export function usePreferencias() {
  const valor = useContext(PreferenciasContext);

  if (!valor) {
    throw new Error("PreferenciasProvider requerido");
  }

  return valor;
}