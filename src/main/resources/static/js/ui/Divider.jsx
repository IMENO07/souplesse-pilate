/**
 * Divider
 *
 * A horizontal separator with an optional centre label.
 *
 * @param {string} label — optional text displayed in the middle of the line
 *
 * @example
 *   <Divider />
 *   <Divider label="ou" />
 *   <Divider label="Informations du Coach" />
 */
function Divider({ label }) {
  if (!label) return <hr className="ui-divider" />;

  return (
    <div className="ui-divider-label">
      <span>{label}</span>
    </div>
  );
}
