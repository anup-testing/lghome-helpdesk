import EmptyState from './EmptyState.jsx';

export default function DataTable({ columns, rows, loading, error, emptyLabel = 'Nothing here yet.' }) {
  if (loading) return <p className="hint">Loading...</p>;
  if (error) return <p className="error-text">{error.message}</p>;
  if (!rows || rows.length === 0) return <EmptyState label={emptyLabel} />;

  return (
    <div className="table-wrap">
      <table className="data-table">
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.key}>{col.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={row.id ?? i}>
              {columns.map((col) => (
                <td key={col.key}>{col.render ? col.render(row) : (row[col.key] ?? '-')}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
