export default function PageHeader({ title, description }) {
  return (
    <div className="page-header ui-page-header">
      <h2>{title}</h2>
      {description && <p>{description}</p>}
    </div>
  );
}
