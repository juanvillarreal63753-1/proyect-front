import { useState } from "react";
import { Link } from "react-router-dom";
import { registrarCuenta } from "../services/cuentaService.js";
import "./Acceso.css";

export default function Registro() {
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [clave, setClave] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [exito, setExito] = useState(false);
  const [cargando, setCargando] = useState(false);

  async function enviar(evento) {
    evento.preventDefault();
    setMensaje("");
    setExito(false);
    setCargando(true);
    try {
      await registrarCuenta({ nombre, correo, clave });
      setExito(true);
      setMensaje("Tu solicitud de registro fue enviada. Revisa el proceso de verificación de correo indicado por la API.");
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
        <h1>Crear cuenta</h1>
        <p className="acceso-descripcion">Regístrate para comenzar a utilizar Taquilla.</p>
        <form className="acceso-formulario" onSubmit={enviar}>
          <label className="acceso-campo">
            Nombre completo
            <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} required autoComplete="name" />
          </label>
          <label className="acceso-campo">
            Correo electrónico
            <input type="email" value={correo} onChange={(e) => setCorreo(e.target.value)} required autoComplete="email" />
          </label>
          <label className="acceso-campo">
            Contraseña
            <input type="password" value={clave} onChange={(e) => setClave(e.target.value)} required minLength={8} autoComplete="new-password" />
          </label>
          {mensaje && <p className="acceso-mensaje" role={exito ? "status" : "alert"}>{mensaje}</p>}
          <button className="acceso-boton" type="submit" disabled={cargando}>
            {cargando ? "Creando cuenta..." : "Crear cuenta"}
          </button>
        </form>
        <p className="acceso-enlace">¿Ya tienes cuenta? <Link to="/ingresar">Iniciar sesión</Link></p>
      </section>
    </main>
  );
}
