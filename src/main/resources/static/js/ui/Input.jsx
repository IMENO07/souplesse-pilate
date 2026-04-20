/**
 * Input
 *
 * @param {string}   label     — the visible label above the input
 * @param {string}   type      — "text" | "email" | "password" | "number" | "url" | "datetime-local"  (default: "text")
 * @param {string}   error     — red error message shown below
 * @param {string}   hint      — grey helper text shown below (hidden when error is present)
 * @param {string}   value
 * @param {function} onChange
 * @param {string}   placeholder
 * @param {boolean}  disabled
 * @param {object}   ref       — forwarded ref for the <input>
 *
 * @example
 *   <Input
 *     label="Adresse Email"
 *     type="email"
 *     value={email}
 *     onChange={e => setEmail(e.target.value)}
 *     error={errors.email}
 *     placeholder="sofia@souplesse.dz"
 *   />
 */
function Input({ label, type = 'text', error, hint, value, onChange, placeholder, disabled, inputRef, ...rest }) {
  return (
    <FormGroup label={label} error={error} hint={hint}>
      <input
        ref={inputRef}
        type={type}
        className={`ui-input${error ? ' ui-input--error' : ''}`}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        {...rest}
      />
    </FormGroup>
  );
}
