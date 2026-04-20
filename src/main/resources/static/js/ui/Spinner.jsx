/**
 * Spinner
 *
 * @param {string} size — "sm" | "md" | "lg"  (default: "md")
 *
 * @example
 *   <Spinner />
 *   <Spinner size="sm" />   -- inline inside a Button
 *   <Spinner size="lg" />   -- full-page loading state
 */
function Spinner({ size = 'md' }) {
  return <span className={`ui-spinner ui-spinner--${size}`} aria-label="Chargement…" />;
}
