import PageHeader from '../../../components/PageHeader.jsx';
import DataTable from '../../../components/DataTable.jsx';
import { useApiList } from '../../../lib/useApiList.js';

const COLUMNS = [
  { key: 'type', label: 'Type' },
  { key: 'model', label: 'Model' },
  { key: 'serialNumber', label: 'Serial #' },
  { key: 'property', label: 'Property', render: (row) => (row.property ? `${row.property.address}, ${row.property.city}` : '-') },
  {
    key: 'installedAt',
    label: 'Installed',
    render: (row) => (row.installedAt ? new Date(row.installedAt).toLocaleDateString() : '-'),
  },
];

export default function Equipment() {
  const { data, loading, error } = useApiList('/equipment');

  return (
    <>
      <PageHeader title="Equipment" description="Equipment records at the properties you service." />
      <DataTable columns={COLUMNS} rows={data} loading={loading} error={error} emptyLabel="No equipment records yet." />
    </>
  );
}
