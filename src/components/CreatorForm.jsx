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
