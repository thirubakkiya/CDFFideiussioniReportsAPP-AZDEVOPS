export default function ResultPanel({
  sectionTitle,
  visibleRows,
  normalizedPage,
  totalPages,
  filteredRowsCount,
  rowPaginationWindow,
  onPrevious,
  onNext,
  onPageSelect,
}) {
  return (
    <article className="result-panel">
      <h3>{sectionTitle}</h3>

      <div className="table-wrap">
        {visibleRows.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Data Calcolo</th>
                <th>Numero Conto</th>
                <th>Divisa</th>
                <th>Denominazione o Rag. Sociale</th>
                <th>S. Oltre</th>
                <th>Importo Archivio</th>
                <th>Saldo Contabile</th>
              </tr>
            </thead>
            <tbody>
              {visibleRows.map((row) => (
                <tr key={`${row.numeroConto}-${row.oltre}`}>
                  <td>{row.dataCalcolo}</td>
                  <td>{row.numeroConto}</td>
                  <td>{row.divisa}</td>
                  <td>{row.denominazione}</td>
                  <td>{row.oltre}</td>
                  <td>{row.importoArchivio}</td>
                  <td>{row.saldoContabile}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="empty-result">Nessun risultato trovato per il filtro selezionato.</div>
        )}
      </div>

      <footer className="table-footer">
        <p>
          Pagina {normalizedPage} di {totalPages} | Risultati {filteredRowsCount}
        </p>
        <div className="pagination-standard" aria-label="Result pagination">
          <button type="button" onClick={onPrevious} disabled={normalizedPage <= 1}>
            {'<'}
          </button>
          {rowPaginationWindow.map((pageNumber) => (
            <button
              key={pageNumber}
              type="button"
              className={pageNumber === normalizedPage ? 'active' : ''}
              onClick={() => onPageSelect(pageNumber)}
            >
              {pageNumber}
            </button>
          ))}
          <button type="button" onClick={onNext} disabled={normalizedPage >= totalPages}>
            {'>'}
          </button>
        </div>
        <p>Powered by CDF Report Engine</p>
      </footer>
    </article>
  );
}
