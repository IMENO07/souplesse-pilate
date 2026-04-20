/**
 * FormGroup  (internal primitive used by Input, Select, Textarea)
 *
 * Wraps any form control with a consistent label + error + hint layout.
 * You can also use it standalone to wrap custom controls.
 *
 * @param {string} label
 * @param {string} error    — renders in red below the control
 * @param {string} hint     — renders in grey below the control (hidden when error present)
 * @param {node}   children — the form control (input, select, etc.)
 *
 * @example — standalone usage with a custom control:
 *   <FormGroup label="Date & Heure" error={errors.dateTime}>
 *     <input ref={dtRef} type="datetime-local" className="ui-input" ... />
 *   </FormGroup>
 */
function FormGroup({ label, error, hint, children }) {
  return (
    <div className={`ui-form-group${error ? ' ui-form-group--error' : ''}`}>
      {label && <label className="ui-label">{label}</label>}
      {children}
      {error  && <span className="ui-form-error">{error}</span>}
      {!error && hint && <span className="ui-form-hint">{hint}</span>}
    </div>
  );
}
