import { Route, Routes } from 'react-router-dom';
import LandingPage from './LandingPage.jsx';
import ReportPage from './ReportPage.jsx';
import TrackPage from './TrackPage.jsx';
import FeedbackPage from './FeedbackPage.jsx';
import './App.css';

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/report" element={<ReportPage />} />
      <Route path="/track" element={<TrackPage />} />
      <Route path="/feedback" element={<FeedbackPage />} />
    </Routes>
  );
}

export default App;
