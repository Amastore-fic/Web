import Alert from '@mui/material/Alert'
import Snackbar from '@mui/material/Snackbar'
 
// toast = { mensaje, tipo: 'success' | 'error' } | null
export default function Toast({ toast, onCerrar }) {
  return (
    <Snackbar
      open={Boolean(toast)}
      autoHideDuration={4000}
      onClose={(_, motivo) => motivo !== 'clickaway' && onCerrar()}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
    >
      {/* Se renderiza solo con toast para conservar el texto mientras se anima la salida */}
      <Alert
        onClose={onCerrar}
        severity={toast?.tipo ?? 'success'}
        variant="filled"
        sx={{ fontSize: 16, alignItems: 'center' }}
      >
        {toast?.mensaje}
      </Alert>
    </Snackbar>
  )
}