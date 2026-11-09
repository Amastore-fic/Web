import { Outlet } from 'react-router-dom'
import AvisoCambioPassword from './AvisoCambioPassword'
import Footer from './Footer'
import Header from './Header'

export default function Layout() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <AvisoCambioPassword />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
