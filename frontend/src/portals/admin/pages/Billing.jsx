import PageHeader from '../../../components/PageHeader.jsx';
import DataTable from '../../../components/DataTable.jsx';
import { useApiList } from '../../../lib/useApiList.js';

const COLUMNS = [
  { key: 'id', label: 'Invoice', render: (row) => row.id.slice(-8) },
  { key: 'customer', label: 'Customer', render: (row) => row.customer?.user?.name ?? '-' },
  { key: 'amount', label: 'Amount', render: (row) => `$${Number(row.amount).toFixed(2)}` },
  { key: 'status', label: 'Status' },
  { key: 'dueDate', label: 'Due', render: (row) => (row.dueDate ? new Date(row.dueDate).toLocaleDateString() : '-') },
];

export default function Billing() {
  const { data, loading, error } = useApiList('/invoices');

  return (
    <>
      <PageHeader title="Billing" description="Invoices, payments, and outstanding balances across all customers." />
      <DataTable columns={COLUMNS} rows={data} loading={loading} error={error} emptyLabel="No invoices yet." />
    </>
  );
}
