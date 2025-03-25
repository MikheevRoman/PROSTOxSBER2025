import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import EventList from './components/EventList/EventList';
import CreateEvent from './components/CreateEvent/CreateEvent';
import EventDetails from './components/EventDetails/EventDetails';

function App() {
  // В реальном приложении это будет храниться в Redux или Context API
  const [events, setEvents] = useState([]);

  const createEvent = (eventData) => {
    // Генерация уникального ID
    const newEvent = {
      ...eventData,
      id: Date.now().toString(),
      organizerId: 'currentUser', // Для примера, в реальности это будет ID текущего пользователя
      participants: ['currentUser'], // Организатор автоматически становится участником
      purchases: [],
      tasks: [],
    };

    setEvents(prevEvents => [...prevEvents, newEvent]);
    return newEvent;
  };

  return (
    <Router>
      <div className="app-container">
        <Routes>
          <Route path="/" element={<EventList events={events} />} />
          <Route path="/create-event" element={<CreateEvent onCreateEvent={createEvent} />} />
          <Route path="/event/:eventId" element={<EventDetails events={events} setEvents={setEvents} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
