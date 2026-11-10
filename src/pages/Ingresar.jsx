import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSesion } from "../context/SesionContext.jsx";
import "./Acceso.css";

export default function Ingresar() {
  const navegar = useNavigate();
  const { iniciarSesion } = useSesion();
  const [correo, setCorreo] = useState("");
  const [clave, setClave] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [cargando, setCargando] = useState(false);

  async function enviar(evento) {
    evento.preventDefault();
    setMensaje("");
    setCargando(true);
    try {
      await iniciarSesion({ correo, clave });
      navegar("/", { replace: true });
    } catch (error) {
      setMensaje(error.message);
    } finally {
      setCargando(false);
    }
  }

  return (
    <main className="acceso-pagina">
      <section className="acceso-tarjeta">
        <Link className="acceso-volver" to="/">← Volver a Taquilla</Link>
        <h1>Iniciar sesión</h1>
        <p className="acceso-descripcion">Ingresa a tu cuenta para continuar.</p>
        <form className="acceso-formulario" onSubmit={enviar}>
          <label className="acceso-campo">
            Correo electrónico
            <input type="email" value={correo} onChange={(e) => setCorreo(e.target.value)} required autoComplete="email" />
          </label>
          <label className="acceso-campo">
            Contraseña
            <input type="password" value={clave} onChange={(e) => setClave(e.target.value)} required autoComplete="current-password" />
          </label>
          {mensaje && <p className="acceso-mensaje" role="alert">{mensaje}</p>}
          <button className="acceso-boton" type="submit" disabled={cargando}>
            {cargando ? "Ingresando..." : "Ingresar"}
          </button>
        </form>
        <p className="acceso-enlace">¿No tienes cuenta? <Link to="/registro">Crear cuenta</Link></p>
      </section>
    </main>
  );
}
