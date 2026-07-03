export default function LeftNav({ reportLinks, currentReportNumber, onReportLinkClick }) {
  return (
    <aside className="left-nav">
      <p className="nav-title">Standard Widget / Layout</p>
      <ul>
        {reportLinks.map((reportLink) => (
          <li key={reportLink.key} className={currentReportNumber === reportLink.reportNumber ? 'active' : ''}>
            <button
              type="button"
              className="menu-button"
              onClick={() => onReportLinkClick(reportLink.firstPageKey)}
            >
              {reportLink.label}
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
}
