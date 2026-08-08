/**
 * ToastProvider: renders a stack of transient notifications into a fixed region
 * and provides a push function via context. Auto-dismisses each toast after a
 * delay. The consumer hook lives in lib/useToast.js (separate file to keep
 * fast-refresh happy).
 */
import { useCallback, useRef, useState } from 'react'
import { ToastContext } from './ToastContext'

/**
 * Renders toast notifications into a fixed region.
 * @param {Object} props
 * @param {React.ReactNode} props.children - The app tree wrapped by the provider.
 * @returns {JSX.Element} The provider with the toast region.
 */
export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])
  const nextId = useRef(0)

  const dismiss = useCallback((id) => {
    setToasts((current) => current.filter((toast) => toast.id !== id))
  }, [])

  const push = useCallback(
    (message, type = 'success') => {
      const id = nextId.current++
      setToasts((current) => [...current, { id, message, type }])
      setTimeout(() => dismiss(id), 3500)
    },
    [dismiss],
  )

  return (
    <ToastContext.Provider value={push}>
      {children}
      <div className="toast-region" aria-live="polite">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`toast toast-${toast.type}`}
            role="status"
          >
            {toast.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}
