/**
 * EmptyState
 *
 * Shown when a list/table has no data. Centered layout with icon, title, and message.
 *
 * @param {node}   icon     — SVG icon element
 * @param {string} title    — main heading
 * @param {string} message  — sub message
 * @param {node}   action   — optional CTA button
 *
 * @example
 *   <EmptyState
 *     icon={<CalendarIcon />}
 *     title="Aucune classe créée"
 *     message="Ajoutez votre première séance pour commencer."
 *     action={<Button onClick={() => setSection('addCourse')}>Ajouter une Classe</Button>}
 *   />
 */
function EmptyState({ icon, title, message, action }) {
  return (
    <div className="ui-empty-state">
      {icon && <div className="ui-empty-state-icon">{icon}</div>}
      {title && <p className="ui-empty-state-title">{title}</p>}
      {message && <p className="ui-empty-state-message">{message}</p>}
      {action && <div className="ui-empty-state-action">{action}</div>}
    </div>
  );
}
