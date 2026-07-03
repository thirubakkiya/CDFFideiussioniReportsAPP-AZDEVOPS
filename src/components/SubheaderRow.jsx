export default function SubheaderRow({ reportLabel, designName, date }) {
  return (
    <header className="subheader-row" aria-label="Main header row">
      <div className="subheader-cell app-name">Crediti di Firma</div>
      <div className="subheader-cell page-name">{reportLabel}</div>
      <div className="subheader-cell design-name">{designName}</div>
      <div className="subheader-cell calc-date">{date}</div>
    </header>
  );
}
