import { createContext, useContext, useEffect, useState } from "react";
import {
  ingresar as solicitarIngreso,
  verSesion,
  cerrarSesion as solicitarCierre,
} from "../services/cuentaService.js";

const SesionContext = createContext(null);

export function SesionProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [cargandoSesion, setCargandoSesion] = useState(true);

  useEffect(() => {
    let activo = true;

    verSesion()
      .then((datosUsuario) => {
        if (activo) setUsuario(datosUsuario);
      })
      .catch(() => {
        if (activo) setUsuario(null);
      })
      .finally(() => {
        if (activo) setCargandoSesion(false);
      });

    return () => {
      activo = false;
    };
  }, []);

  async function iniciarSesion(datos) {
    const datosUsuario = await solicitarIngreso(datos);
    setUsuario(datosUsuario);
    return datosUsuario;
  }

  async function cerrarSesion() {
    await solicitarCierre();
    setUsuario(null);
  }

  return (
    <SesionContext.Provider
      value={{ usuario, cargandoSesion, iniciarSesion, cerrarSesion }}
    >
      {children}
    </SesionContext.Provider>
  );
}

export function useSesion() {
  const contexto = useContext(SesionContext);
  if (!contexto) {
    throw new Error("useSesion debe utilizarse dentro de SesionProvider.");
  }
  return contexto;
}
