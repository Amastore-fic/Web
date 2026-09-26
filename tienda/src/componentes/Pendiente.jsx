// Marcador para pantallas del MVP que aun no se construyen.
export default function Pendiente({ titulo, children }) {
  return (
    <section>
      <h1>{titulo}</h1>
      <div className="aviso">{children}</div>
    </section>
  )
}
