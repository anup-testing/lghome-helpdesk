import { Route, Routes } from 'react-router-dom';

import LandingPage from './LandingPage.jsx';
import StaffLanding from './StaffLanding.jsx';
import ReportPage from './ReportPage.jsx';
import TrackPage from './TrackPage.jsx';
import FeedbackPage from './FeedbackPage.jsx';
import CustomerLayout from './portals/customer/CustomerLayout.jsx';
import CustomerDashboard from './portals/customer/pages/Dashboard.jsx';
import CustomerTicketDetails from './portals/customer/pages/TicketDetails.jsx';
import CustomerAppointments from './portals/customer/pages/Appointments.jsx';
import CustomerInvoices from './portals/customer/pages/Invoices.jsx';
import TechnicianLayout from './portals/technician/TechnicianLayout.jsx';
import TechnicianDashboard from './portals/technician/pages/Dashboard.jsx';
import TechnicianTodaysJobs from './portals/technician/pages/TodaysJobs.jsx';
import TechnicianAssignedTickets from './portals/technician/pages/AssignedTickets.jsx';
import TechnicianWorkOrder from './portals/technician/pages/WorkOrder.jsx';
import TechnicianEquipment from './portals/technician/pages/Equipment.jsx';
import TechnicianServiceHistory from './portals/technician/pages/ServiceHistory.jsx';
import DispatcherLayout from './portals/dispatcher/DispatcherLayout.jsx';
import DispatcherDashboard from './portals/dispatcher/pages/Dashboard.jsx';
import DispatcherAllTickets from './portals/dispatcher/pages/AllTickets.jsx';
import DispatcherAssignTechnician from './portals/dispatcher/pages/AssignTechnician.jsx';
import DispatcherScheduling from './portals/dispatcher/pages/Scheduling.jsx';
import DispatcherCustomers from './portals/dispatcher/pages/Customers.jsx';
import AdminLayout from './portals/admin/AdminLayout.jsx';
import AdminUsers from './portals/admin/pages/Users.jsx';
import AdminTechnicians from './portals/admin/pages/Technicians.jsx';
import AdminCustomers from './portals/admin/pages/Customers.jsx';
import AdminTickets from './portals/admin/pages/Tickets.jsx';
import AdminSettings from './portals/admin/pages/Settings.jsx';
import AdminBilling from './portals/admin/pages/Billing.jsx';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/staff" element={<StaffLanding />} />
      <Route path="/report" element={<ReportPage />} />
      <Route path="/track" element={<TrackPage />} />
      <Route path="/feedback" element={<FeedbackPage />} />

      <Route path="/customer" element={<CustomerLayout />}>
        <Route index element={<CustomerDashboard />} />
        <Route path="tickets/:id" element={<CustomerTicketDetails />} />
        <Route path="appointments" element={<CustomerAppointments />} />
        <Route path="invoices" element={<CustomerInvoices />} />
      </Route>

      <Route path="/technician" element={<TechnicianLayout />}>
        <Route index element={<TechnicianDashboard />} />
        <Route path="jobs/today" element={<TechnicianTodaysJobs />} />
        <Route path="tickets" element={<TechnicianAssignedTickets />} />
        <Route path="work-orders/:id" element={<TechnicianWorkOrder />} />
        <Route path="equipment" element={<TechnicianEquipment />} />
        <Route path="history" element={<TechnicianServiceHistory />} />
      </Route>

      <Route path="/dispatcher" element={<DispatcherLayout />}>
        <Route index element={<DispatcherDashboard />} />
        <Route path="tickets" element={<DispatcherAllTickets />} />
        <Route path="tickets/:id/assign" element={<DispatcherAssignTechnician />} />
        <Route path="scheduling" element={<DispatcherScheduling />} />
        <Route path="customers" element={<DispatcherCustomers />} />
      </Route>

      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminUsers />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="technicians" element={<AdminTechnicians />} />
        <Route path="customers" element={<AdminCustomers />} />
        <Route path="tickets" element={<AdminTickets />} />
        <Route path="settings" element={<AdminSettings />} />
        <Route path="billing" element={<AdminBilling />} />
      </Route>
    </Routes>
  );
}
