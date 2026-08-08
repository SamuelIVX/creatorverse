/**
 * ToastContext: shared context carrying the toast push function so both the
 * provider (components/Toast.jsx) and the consumer hook (lib/useToast.js) can
 * access it without a circular import or a fast-refresh warning.
 */
import { createContext } from 'react'

export const ToastContext = createContext(null)
