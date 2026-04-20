/**
 * Select
 *
 * @param {string}   label
 * @param {string}   error
 * @param {string}   hint
 * @param {string}   value
 * @param {function} onChange
 * @param {Array}    options    — array of { value, label } objects
 * @param {string}   placeholder
 * @param {boolean}  disabled
 *
 * @example
 *   <Select
 *     label="Classe"
 *     value={courseId}
 *     onChange={e => setCourseId(e.target.value)}
 *     placeholder="— Choisir une classe —"
 *     options={courses.map(c => ({ value: c.id, label: c.title }))}
 *     error={errors.courseId}
 *   />
 */
function Select({ label, error, hint, value, onChange, options = [], placeholder, disabled }) {
  return (
    <FormGroup label={label} error={error} hint={hint}>
      <select
        className={`ui-input ui-select${error ? ' ui-input--error' : ''}`}
        value={value}
        onChange={onChange}
        disabled={disabled}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </FormGroup>
  );
}
