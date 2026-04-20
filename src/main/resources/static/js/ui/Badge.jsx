/**
 * Badge
 *
 * @param {string} variant — "default" | "ocean" | "success" | "warning" | "danger"  (default: "default")
 * @param {node}   children
 *
 * @example
 *   <Badge variant="success">Confirmé</Badge>
 *   <Badge variant="danger">Complet</Badge>
 *   <Badge variant="ocean">Reformer</Badge>
 *   <Badge variant="warning">2 places restantes</Badge>
 */
function Badge({ variant = 'default', children, className = '' }) {
  return (
    <span className={`ui-badge ui-badge--${variant} ${className}`}>
      {children}
    </span>
  );
}
