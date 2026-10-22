export default function StatusMessage({ type, title, message, onAction, actionLabel }) {
  return (
    <div className={`status status--${type}`} role={type === 'error' ? 'alert' : 'status'}>
      {type === 'loading' && <span className="spinner" aria-hidden="true" />}
      <h3 className="status__title">{title}</h3>
      {message && <p className="status__text">{message}</p>}
      {onAction && (
        <button type="button" className="btn" onClick={onAction}>
          {actionLabel}
        </button>
      )}
    </div>
  );
}
