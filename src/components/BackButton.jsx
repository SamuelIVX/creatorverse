/**
 * BackButton: returns to the previous page when one exists, otherwise to the
 * homepage (covers direct-URL loads). Pure navigation; no props.
 * @returns {JSX.Element} A "Back" link.
 */
import { useNavigate } from 'react-router-dom'

export default function BackButton() {
  const navigate = useNavigate()

  const handleClick = (e) => {
    e.preventDefault()
    if (window.history.length > 1) {
      navigate(-1)
    } else {
      navigate('/')
    }
  }

  return (
    <button type="button" className="btn btn-ghost btn-sm" onClick={handleClick}>
      ← Back
    </button>
  )
}
