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
/**
 * Card / CardHeader / CardBody / CardFooter
 *
 * Composable card layout. Use together or individually.
 *
 * @param {node}   children
 * @param {string} className  — extra classes
 * @param {object} style      — inline styles
 *
 * @example — Full card:
 *   <Card>
 *     <CardHeader icon={<PlusIcon />} title="Ajouter une Classe" />
 *     <CardBody>
 *       <Input label="Titre" ... />
 *     </CardBody>
 *     <CardFooter>
 *       <Button>Publier →</Button>
 *     </CardFooter>
 *   </Card>
 *
 * @example — Simple card with no header:
 *   <Card style={{ padding: 24 }}>
 *     <p>Contenu libre</p>
 *   </Card>
 */
function Card({ children, className = '', style = {} }) {
  return (
    <div className={`ui-card ${className}`} style={style}>
      {children}
    </div>
  );
}

/**
 * CardHeader
 *
 * @param {node}   icon    — an SVG or emoji placed left of the title
 * @param {string} title   — card heading text
 * @param {node}   actions — optional right-side actions (e.g. a Button)
 */
function CardHeader({ icon, title, actions }) {
  return (
    <div className="ui-card-header">
      <div className="ui-card-header-left">
        {icon && <span className="ui-card-header-icon">{icon}</span>}
        <span className="ui-card-header-title">{title}</span>
      </div>
      {actions && <div className="ui-card-header-actions">{actions}</div>}
    </div>
  );
}

/**
 * CardBody
 *
 * @param {boolean} noPad  — remove default padding (useful for full-width tables)
 */
function CardBody({ children, noPad = false, style = {} }) {
  return (
    <div className="ui-card-body" style={{ ...(noPad ? { padding: 0 } : {}), ...style }}>
      {children}
    </div>
  );
}

/**
 * CardFooter
 *
 * @param {string} align — "left" | "right" | "between"  (default: "right")
 */
function CardFooter({ children, align = 'right' }) {
  return (
    <div className={`ui-card-footer ui-card-footer--${align}`}>
      {children}
    </div>
  );
}
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
