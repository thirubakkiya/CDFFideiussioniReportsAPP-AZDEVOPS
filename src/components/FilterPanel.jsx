export default function FilterPanel({
  heading,
  date,
  filterLabel,
  filterOptions,
  selectedType,
  onTypeChange,
}) {
  return (
    <article className="filter-panel">
      <h2>{heading}</h2>

      <div className="filters-row">
        <label>
          <span>* Data Calcolo</span>
          <input type="text" value={date} readOnly />
        </label>

        <label>
          <span>{filterLabel}</span>
          <select value={selectedType} onChange={onTypeChange}>
            {filterOptions.map((type) => (
              <option value={type} key={type}>
                {type}
              </option>
            ))}
          </select>
        </label>
      </div>
    </article>
  );
}
