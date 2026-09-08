import PageHeader from '../../../components/PageHeader.jsx';
import DataTable from '../../../components/DataTable.jsx';
import { useApiList } from '../../../lib/useApiList.js';

const COLUMNS = [
  { key: 'name', label: 'Name' },
  { key: 'email', label: 'Email' },
  { key: 'role', label: 'Role' },
  { key: 'phone', label: 'Phone' },
  { key: 'createdAt', label: 'Since', render: (row) => new Date(row.createdAt).toLocaleDateString() },
];

export default function Users() {
  const { data, loading, error } = useApiList('/users');

  return (
    <>
      <PageHeader title="Users" description="Manage accounts and role assignments." />
      <DataTable columns={COLUMNS} rows={data} loading={loading} error={error} emptyLabel="No users yet." />
    </>
  );
}
