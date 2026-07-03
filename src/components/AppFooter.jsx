export default function AppFooter({ reportLabel, designName }) {
  return (
    <footer className="app-footer">
      <span>CDF Report Platform</span>
      <span>{reportLabel}</span>
      <span>{designName}</span>
    </footer>
  );
}
