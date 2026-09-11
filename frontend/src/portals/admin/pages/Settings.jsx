import { useState } from 'react';
import PageHeader from '../../../components/PageHeader.jsx';
import Button from '../../../components/ui/Button.jsx';
import { apiClient } from '../../../lib/apiClient.js';

const SETTINGS_KEY = 'lgcare_admin_settings';
const DEFAULT_SETTINGS = {
  companyName: 'LG Home Comfort',
  supportEmail: 'support@lghomecomfort.com',
  supportPhone: '',
  defaultPriority: 'MEDIUM',
  emailNotifications: true,
  autoAssign: false,
};
const INITIAL_TECHNICIAN = { name: '', email: '', phone: '', password: '', skills: '' };

function readSettings() {
  try {
    const saved = localStorage.getItem(SETTINGS_KEY);
    return saved ? { ...DEFAULT_SETTINGS, ...JSON.parse(saved) } : DEFAULT_SETTINGS;
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export default function Settings() {
  const [settings, setSettings] = useState(readSettings);
  const [saved, setSaved] = useState(false);
  const [technician, setTechnician] = useState(INITIAL_TECHNICIAN);
  const [addingTechnician, setAddingTechnician] = useState(false);
  const [technicianNotice, setTechnicianNotice] = useState(null);
  const [technicianError, setTechnicianError] = useState(null);

  function update(field, value) {
    setSettings((current) => ({ ...current, [field]: value }));
    setSaved(false);
  }

  function saveSettings(event) {
    event.preventDefault();
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    setSaved(true);
  }

  function updateTechnician(field, value) {
    setTechnician((current) => ({ ...current, [field]: value }));
    setTechnicianNotice(null);
    setTechnicianError(null);
  }

  async function addTechnician(event) {
    event.preventDefault();
    setAddingTechnician(true);
    setTechnicianNotice(null);
    setTechnicianError(null);
    try {
      const created = await apiClient.post('/technicians', {
        ...technician,
        skills: technician.skills.split(',').map((skill) => skill.trim()).filter(Boolean),
      });
      setTechnician(INITIAL_TECHNICIAN);
      setTechnicianNotice(`${created.user.name} was added and can now sign in as a technician.`);
    } catch (error) {
      setTechnicianError(error.message);
    } finally {
      setAddingTechnician(false);
    }
  }

  return (
    <>
      <PageHeader title="Settings" description="Configure your company details and ticket workflow defaults." />

      <form className="settings-form" onSubmit={saveSettings}>
        <section className="settings-section">
          <div className="settings-section-heading">
            <h3>Company profile</h3>
            <p>Shown in customer-facing communications.</p>
          </div>
          <div className="settings-grid">
            <div className="field">
              <label htmlFor="company-name">Company name</label>
              <input id="company-name" value={settings.companyName} onChange={(event) => update('companyName', event.target.value)} />
            </div>
            <div className="field">
              <label htmlFor="support-email">Support email</label>
              <input id="support-email" type="email" value={settings.supportEmail} onChange={(event) => update('supportEmail', event.target.value)} />
            </div>
            <div className="field">
              <label htmlFor="support-phone">Support phone</label>
              <input id="support-phone" type="tel" value={settings.supportPhone} onChange={(event) => update('supportPhone', event.target.value)} placeholder="(416) 555-0123" />
            </div>
          </div>
        </section>

        <section className="settings-section">
          <div className="settings-section-heading">
            <h3>Ticket workflow</h3>
            <p>Set defaults for new customer requests.</p>
          </div>
          <div className="settings-grid">
            <div className="field">
              <label htmlFor="default-priority">Default priority</label>
              <select id="default-priority" value={settings.defaultPriority} onChange={(event) => update('defaultPriority', event.target.value)}>
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
                <option value="URGENT">Urgent</option>
              </select>
            </div>
          </div>
          <label className="settings-toggle">
            <input type="checkbox" checked={settings.emailNotifications} onChange={(event) => update('emailNotifications', event.target.checked)} />
            <span><strong>Email notifications</strong><small>Send updates when a ticket status changes.</small></span>
          </label>
          <label className="settings-toggle">
            <input type="checkbox" checked={settings.autoAssign} onChange={(event) => update('autoAssign', event.target.checked)} />
            <span><strong>Automatic assignment</strong><small>Assign new tickets to an available technician.</small></span>
          </label>
        </section>

        <div className="settings-actions">
          <Button type="submit">Save settings</Button>
          {saved && <p className="success-text">Settings saved in this browser.</p>}
        </div>
      </form>

      <form className="settings-section settings-technician-form" onSubmit={addTechnician}>
        <div className="settings-section-heading">
          <h3>Add technician</h3>
          <p>Create a technician account that can sign in and receive ticket assignments.</p>
        </div>
        <div className="settings-grid">
          <div className="field">
            <label htmlFor="technician-name">Full name</label>
            <input id="technician-name" value={technician.name} onChange={(event) => updateTechnician('name', event.target.value)} required />
          </div>
          <div className="field">
            <label htmlFor="technician-email">Email</label>
            <input id="technician-email" type="email" value={technician.email} onChange={(event) => updateTechnician('email', event.target.value)} required />
          </div>
          <div className="field">
            <label htmlFor="technician-phone">Phone</label>
            <input id="technician-phone" type="tel" value={technician.phone} onChange={(event) => updateTechnician('phone', event.target.value)} placeholder="(416) 555-0123" />
          </div>
          <div className="field">
            <label htmlFor="technician-password">Temporary password</label>
            <input id="technician-password" type="password" value={technician.password} onChange={(event) => updateTechnician('password', event.target.value)} required minLength="8" />
          </div>
          <div className="field">
            <label htmlFor="technician-skills">Skills</label>
            <input id="technician-skills" value={technician.skills} onChange={(event) => updateTechnician('skills', event.target.value)} placeholder="Heating, Cooling, Air Quality" />
          </div>
        </div>
        <div className="settings-actions">
          <Button type="submit" disabled={addingTechnician}>{addingTechnician ? 'Adding technician...' : 'Add technician'}</Button>
          {technicianNotice && <p className="success-text">{technicianNotice}</p>}
          {technicianError && <p className="error-text">{technicianError}</p>}
        </div>
      </form>
    </>
  );
}
