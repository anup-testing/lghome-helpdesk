import PageHeader from '../../../components/PageHeader.jsx';
import CustomerTable from '../../../components/CustomerTable.jsx';

export default function Customers() {
  return (
    <>
      <PageHeader title="Customers" description="Customer directory and their properties." />
      <CustomerTable />
    </>
  );
}
