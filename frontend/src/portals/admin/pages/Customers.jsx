import PageHeader from '../../../components/PageHeader.jsx';
import CustomerTable from '../../../components/CustomerTable.jsx';

export default function Customers() {
  return (
    <>
      <PageHeader title="Customers" description="All customer accounts and their properties." />
      <CustomerTable />
    </>
  );
}
