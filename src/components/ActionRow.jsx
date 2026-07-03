export default function ActionRow({ secondaryLabel, primaryLabel }) {
  return (
    <div className="action-row">
      <button type="button">{secondaryLabel}</button>
      <button type="button">{primaryLabel}</button>
    </div>
  );
}
