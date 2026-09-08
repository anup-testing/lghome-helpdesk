import PageHeader from '../../../components/PageHeader.jsx';
import DataTable from '../../../components/DataTable.jsx';
import { useApiList } from '../../../lib/useApiList.js';

const COLUMNS = [
  { key: 'name', label: 'Name', render: (row) => row.user?.name ?? '-' },
  { key: 'email', label: 'Email', render: (row) => row.user?.email ?? '-' },
  { key: 'phone', label: 'Phone', render: (row) => row.user?.phone ?? '-' },
  { key: 'skills', label: 'Skills', render: (row) => (row.skills?.length ? row.skills.join(', ') : '-') },
];

export default function Technicians() {
  const { data, loading, error } = useApiList('/technicians');

  return (
    <>
      <PageHeader title="Technicians" description="Technician roster, skills, and territories." />
      <DataTable columns={COLUMNS} rows={data} loading={loading} error={error} emptyLabel="No technicians yet." />
    </>
  );
}
