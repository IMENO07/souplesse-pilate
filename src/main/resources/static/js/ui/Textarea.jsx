/**
 * Textarea
 *
 * @param {string}   label
 * @param {string}   error
 * @param {string}   hint
 * @param {string}   value
 * @param {function} onChange
 * @param {string}   placeholder
 * @param {number}   rows        (default: 4)
 * @param {boolean}  disabled
 *
 * @example
 *   <Textarea
 *     label="Description"
 *     rows={5}
 *     value={description}
 *     onChange={e => setDescription(e.target.value)}
 *     placeholder="Décrivez le contenu de la séance…"
 *     error={errors.description}
 *   />
 */
function Textarea({ label, error, hint, value, onChange, placeholder, rows = 4, disabled }) {
  return (
    <FormGroup label={label} error={error} hint={hint}>
      <textarea
        className={`ui-input ui-textarea${error ? ' ui-input--error' : ''}`}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
        disabled={disabled}
      />
    </FormGroup>
  );
}
