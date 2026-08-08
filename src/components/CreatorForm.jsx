/**
 * Shared controlled form for creating or editing a creator.
 * Renders the four editable fields (name, url, description, imageURL), a live
 * image preview, plus a submit button and any extra children (e.g. the
 * EditCreator delete button). Parent owns form state and submit/change handlers.
 */
/**
 * Renders the creator form.
 * @param {Object} props
 * @param {Object} props.form - Current form values keyed by field name.
 * @param {(e: Event) => void} props.onChange - Change handler for the inputs.
 * @param {(e: Event) => void} props.onSubmit - Submit handler for the form.
 * @param {string} props.submitLabel - Text for the submit button.
 * @param {boolean} [props.submitting] - Disables the submit button while true.
 * @param {(string|null)} props.error - Error message to surface, if any.
 * @param {React.ReactNode} props.children - Extra controls (e.g. delete button).
 * @returns {JSX.Element} The form element.
 */
export default function CreatorForm({
  form,
  onChange,
  onSubmit,
  submitLabel,
  submitting = false,
  error,
  children,
}) {
  return (
    <form className="form-card" onSubmit={onSubmit}>
      <div className="field">
        <label className="field-label" htmlFor="name">
          Name
        </label>
        <input
          className="field-input"
          id="name"
          name="name"
          value={form.name}
          onChange={onChange}
          required
        />
      </div>

      <div className="field">
        <label className="field-label" htmlFor="url">
          Channel URL
        </label>
        <input
          className="field-input"
          id="url"
          name="url"
          type="url"
          value={form.url}
          onChange={onChange}
          required
        />
      </div>

      <div className="field">
        <label className="field-label" htmlFor="description">
          Description
        </label>
        <textarea
          className="field-textarea"
          id="description"
          name="description"
          value={form.description}
          onChange={onChange}
          required
        />
      </div>

      <div className="field">
        <label className="field-label" htmlFor="imageURL">
          Image URL (optional)
        </label>
        <input
          className="field-input"
          id="imageURL"
          name="imageURL"
          type="url"
          value={form.imageURL}
          onChange={onChange}
        />
        <div className="image-preview">
          {form.imageURL ? (
            <img src={form.imageURL} alt="" onError={(e) => (e.target.style.display = 'none')} />
          ) : (
            <div className="image-preview-empty">No image preview</div>
          )}
        </div>
      </div>

      {error && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}

      <div className="form-actions">
        <button className="btn btn-primary" type="submit" disabled={submitting}>
          {submitting ? 'Saving…' : submitLabel}
        </button>
        {children}
      </div>
    </form>
  )
}
