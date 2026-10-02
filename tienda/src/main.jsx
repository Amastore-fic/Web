import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter } from 'react-router-dom'
import '@shared/diseno/tokens.css'
import { ROLES_TIENDA, recibirSesion } from '@shared/sesion/traspaso'
import './index.css'
import { api, sesion } from './api'
import App from './App.jsx'
import SesionProvider from './componentes/SesionProvider.jsx'

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 1, refetchOnWindowFocus: false } },
})

function montar() {
  createRoot(document.getElementById('root')).render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <SesionProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </SesionProvider>
      </QueryClientProvider>
    </StrictMode>
  )
}

// Si se llega desde el panel con la sesion en la direccion (#sesion=...),
// se recibe antes de mostrar la app; si no, se monta de inmediato.
recibirSesion({ sesion, api, roles: ROLES_TIENDA }).finally(montar)
