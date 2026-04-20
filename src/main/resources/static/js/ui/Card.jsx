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
