/**
 * useToast: reads the toast push function from ToastContext.
 * @returns {(message: string, type?: 'success' | 'error') => void} push function.
 */
import { useContext } from 'react'
import { ToastContext } from '../components/ToastContext'

export function useToast() {
  const push = useContext(ToastContext)
  if (!push) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return push
}
