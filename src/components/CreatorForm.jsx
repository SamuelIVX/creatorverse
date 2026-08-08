/**
 * Shared controlled form for creating or editing a creator.
 * Renders the four editable fields (name, url, description, imageURL) plus a
 * submit button and any extra children (e.g. the EditCreator delete button).
 * Parent owns form state and submit/change handlers.
 */
/**
 * Renders the creator form.
 * @param {Object} props
 * @param {Object} props.form - Current form values keyed by field name.
 * @param {(e: Event) => void} props.onChange - Change handler for the inputs.
 * @param {(e: Event) => void} props.onSubmit - Submit handler for the form.
 * @param {string} props.submitLabel - Text for the submit button.
 * @param {(string|null)} props.error - Error message to surface, if any.
 * @param {React.ReactNode} props.children - Extra controls (e.g. delete button).
 * @returns {JSX.Element} The form element.
 */
export default function CreatorForm({
  form,
  onChange,
  onSubmit,
  submitLabel,
  error,
  children,
}) {
  return (
    <form onSubmit={onSubmit}>
      <label htmlFor="name">
        Name
        <input
          id="name"
          name="name"
          value={form.name}
          onChange={onChange}
          required
        />
      </label>
      <label htmlFor="url">
        URL
        <input
          id="url"
          name="url"
          value={form.url}
          onChange={onChange}
          required
        />
      </label>
      <label htmlFor="description">
        Description
        <textarea
          id="description"
          name="description"
          value={form.description}
          onChange={onChange}
          required
        />
      </label>
      <label htmlFor="imageURL">
        Image URL (optional)
        <input
          id="imageURL"
          name="imageURL"
          value={form.imageURL}
          onChange={onChange}
        />
      </label>
      {error && <p role="alert">{error}</p>}
      <button type="submit">{submitLabel}</button>
      {children}
    </form>
  )
}
