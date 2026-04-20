/**
 * Button
 *
 * @param {string}   variant   — "primary" | "outline" | "ghost" | "danger"      (default: "primary")
 * @param {string}   size      — "sm" | "md" | "lg"                              (default: "md")
 * @param {boolean}  loading   — shows a spinner and disables the button
 * @param {boolean}  disabled
 * @param {function} onClick
 * @param {node}     children
 *
 * @example
 *   <Button variant="primary" size="lg" onClick={handleSubmit}>
 *     Publier la Classe →
 *   </Button>
 *
 *   <Button variant="outline" loading={isSaving}>
 *     Enregistrer
 *   </Button>
 *
 *   <Button variant="danger" size="sm" onClick={handleDelete}>
 *     Supprimer
 *   </Button>
 */
function Button({ variant = 'primary', size = 'md', loading = false, disabled = false, onClick, children, style = {}, className = '' }) {
  const base = 'ui-btn';
  const cls = [base, `${base}--${variant}`, `${base}--${size}`, loading ? `${base}--loading` : '', className]
    .filter(Boolean).join(' ');

  return (
    <button
      className={cls}
      onClick={onClick}
      disabled={disabled || loading}
      style={style}
    >
      {loading && <Spinner size="sm" />}
      <span style={{ opacity: loading ? 0.6 : 1 }}>{children}</span>
    </button>
  );
}
