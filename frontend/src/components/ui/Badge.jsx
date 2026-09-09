export default function Badge({ type = 'status', value }) {
  const normalized = String(value).toLowerCase();
  return <span className={`ui-badge ui-badge-${type}-${normalized}`}>{value}</span>;
}
