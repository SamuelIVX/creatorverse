/**
 * ConfirmDialog: a controlled modal for destructive confirmations.
 * Renders a title, message, Cancel, and a danger-styled Confirm button; focuses
 * the confirm button when opened and does not render when closed.
 */
import { useEffect, useRef } from 'react'

/**
 * Renders the confirm dialog.
 * @param {Object} props
 * @param {boolean} props.open - Whether the dialog is visible.
 * @param {string} props.title - Dialog heading text.
 * @param {string} props.message - Explanation of the action.
 * @param {string} props.confirmLabel - Text for the confirm button.
 * @param {() => void} props.onConfirm - Handler for the confirm action.
 * @param {() => void} props.onCancel - Handler for cancel / dismiss.
 * @returns {JSX.Element|null} The dialog overlay, or null when closed.
 */
export default function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = 'Confirm',
  onConfirm,
  onCancel,
}) {
  const confirmRef = useRef(null)

  useEffect(() => {
    if (open && confirmRef.current) {
      confirmRef.current.focus()
    }
  }, [open])

  if (!open) return null

  return (
    <div className="dialog-overlay" role="presentation" onClick={onCancel}>
      <div
        className="dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="dialog-title"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="dialog-title" id="dialog-title">
          {title}
        </h2>
        <p className="dialog-message">{message}</p>
        <div className="dialog-actions">
          <button type="button" className="btn" onClick={onCancel}>
            Cancel
          </button>
          <button
            ref={confirmRef}
            type="button"
            className="btn btn-danger"
            onClick={onConfirm}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
