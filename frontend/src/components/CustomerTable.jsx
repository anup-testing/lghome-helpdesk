import DataTable from './DataTable.jsx';
import { useApiList } from '../lib/useApiList.js';

const COLUMNS = [
  { key: 'name', label: 'Name', render: (row) => row.user?.name ?? '-' },
  { key: 'email', label: 'Email', render: (row) => row.user?.email ?? '-' },
  { key: 'phone', label: 'Phone', render: (row) => row.user?.phone ?? '-' },
  { key: 'company', label: 'Company' },
  { key: 'createdAt', label: 'Since', render: (row) => new Date(row.createdAt).toLocaleDateString() },
];

export default function CustomerTable() {
  const { data, loading, error } = useApiList('/customers');
  return (
    <DataTable
      columns={COLUMNS}
      rows={data}
      loading={loading}
      error={error}
      emptyLabel="No customers yet."
    />
  );
}
