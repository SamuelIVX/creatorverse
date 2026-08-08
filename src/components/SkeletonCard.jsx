/**
 * SkeletonCard: a shimmering placeholder card shown while the homepage list is
 * loading. Mirrors the real Card's layout (media + body lines) so the swap is
 * seamless. Pure presentational.
 * @returns {JSX.Element} The skeleton card.
 */
export default function SkeletonCard() {
  return (
    <div className="skeleton-card" aria-hidden="true">
      <div className="skeleton skeleton-media" />
      <div className="skeleton-body">
        <div className="skeleton skeleton-line skeleton-line-lg" />
        <div className="skeleton skeleton-line skeleton-line-sm" />
        <div className="skeleton skeleton-line skeleton-line-sm" />
      </div>
    </div>
  )
}
