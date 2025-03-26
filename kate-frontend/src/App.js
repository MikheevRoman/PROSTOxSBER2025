import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import EventList from './components/EventList/EventList';
import CreateEvent from './components/CreateEvent/CreateEvent';
import EventDetails from './components/EventDetails/EventDetails';
import EditEvent from './components/EditEvent/EditEvent';
import AddPurchase from './components/Purchases/AddPurchase';

function App() {
  return (
    <Router>
      <div className="app-container">
        <Routes>
          <Route path="/" element={<EventList />} />
          <Route path="/create-event" element={<CreateEvent />} />
          <Route path="/event/:eventId" element={<EventDetails />} />
          <Route path="/event/:eventId/edit" element={<EditEvent />} />
          <Route path="/event/:eventId/add-purchase" element={<AddPurchase />} />
          <Route path="/event/:eventId/edit-purchase/:purchaseId" element={<AddPurchase />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
