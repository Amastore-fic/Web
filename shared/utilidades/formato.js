const moneda = new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' })
const fecha = new Intl.DateTimeFormat('es-MX', { dateStyle: 'medium', timeStyle: 'short' })

// La API manda los montos como string ("649.00"); aqui solo se formatean.
export const formatearMoneda = (monto) => moneda.format(Number(monto))

export const formatearFecha = (iso) => fecha.format(new Date(iso))

export const ETIQUETAS_ESTADO_PEDIDO = {
  pendiente_pago: 'Pendiente de pago',
  pagado: 'Pagado',
  en_preparacion: 'En preparacion',
  enviado: 'Enviado',
  cancelado: 'Cancelado',
}
