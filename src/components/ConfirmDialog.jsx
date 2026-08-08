/**
 * ConfirmDialog: a controlled modal for destructive confirmations.
 * Renders a native <dialog> (opened with showModal) with a title, message,
 * Cancel, and a danger-styled Confirm button. The native dialog provides focus
 * trapping, Escape dismissal, and focus restoration to the previously focused
 * element. Renders hidden while closed.
 */
import { useEffect, useRef } from 'react'

/**
 * Renders the confirm dialog.
 * @param {Object} props
 * @param {boolean} props.open - Whether the dialog is visible.
 * @param {string} props.title - Dialog heading text.
 * @param {string} props.message - Explanation of the action.
 * @param {string} props.confirmLabel - Text for the confirm button.
 * @param {boolean} [props.disabled] - Disables both buttons while an action is in flight.
 * @param {() => void} props.onConfirm - Handler for the confirm action.
 * @param {() => void} props.onCancel - Handler for cancel / dismiss.
 * @returns {JSX.Element} The dialog element (hidden while closed).
 */
export default function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = 'Confirm',
  disabled = false,
  onConfirm,
  onCancel,
}) {
  const dialogRef = useRef(null)
  const confirmRef = useRef(null)

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (open) {
      if (!dialog.open) {
        if (typeof dialog.showModal === 'function') {
          dialog.showModal()
        } else {
          dialog.setAttribute('open', '')
        }
        confirmRef.current?.focus()
      }
    } else if (dialog.open) {
      if (typeof dialog.close === 'function') {
        dialog.close()
      } else {
        dialog.removeAttribute('open')
      }
    }
  }, [open])

  return (
    <dialog
      ref={dialogRef}
      className="dialog"
      aria-labelledby="dialog-title"
      onCancel={(e) => {
        e.preventDefault()
        onCancel()
      }}
      onClick={(e) => {
        if (e.target === dialogRef.current) onCancel()
      }}
    >
      <h2 className="dialog-title" id="dialog-title">
        {title}
      </h2>
      <p className="dialog-message">{message}</p>
      <div className="dialog-actions">
        <button type="button" className="btn" onClick={onCancel} disabled={disabled}>
          Cancel
        </button>
        <button
          ref={confirmRef}
          type="button"
          className="btn btn-danger"
          onClick={onConfirm}
          disabled={disabled}
        >
          {confirmLabel}
        </button>
      </div>
    </dialog>
  )
}
