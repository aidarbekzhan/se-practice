import React, { useState } from 'react';

// Fictional sample rooms
const INITIAL_ROOMS = [
  {
    id: 'room-101',
    name: 'Room 101 (Seminar Room)',
    isBlocked: false,
    bookings: [
      { id: 'b1', title: 'Calculus Discussion', start: 600, end: 660, timeStr: '10:00 - 11:00' }
    ]
  },
  {
    id: 'room-102',
    name: 'Room 102 (Lab)',
    isBlocked: true,
    bookings: []
  }
];

function toMinutes(timeStr) {
  if (!timeStr) return -1;
  const [h, m] = timeStr.split(':').map(Number);
  return h * 60 + m;
}

export default function App() {
  const [rooms, setRooms] = useState(() => {
    const saved = localStorage.getItem('smart_campus_bookings');
    return saved ? JSON.parse(saved) : INITIAL_ROOMS;
  });
  const [selectedRoomId, setSelectedRoomId] = useState('room-101');
  const [startTime, setStartTime] = useState('11:00');
  const [endTime, setEndTime] = useState('12:00');
  const [checkResult, setCheckResult] = useState(null);

  const currentRoom = rooms.find(r => r.id === selectedRoomId) || rooms[0];

  const handleCheck = () => {
    const start = toMinutes(startTime);
    const end = toMinutes(endTime);

    // v1 defect: Uses system clock instead of a supplied current time
    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    // AC1 & AC2: interval bounds and max 120 minutes
    if (start < 0 || end > 1440 || start >= end || (end - start) > 120 || start <= currentMinutes) {
      setCheckResult({ available: false });
      return;
    }

    // AC3: room blocked
    if (currentRoom.isBlocked) {
      setCheckResult({ available: false });
      return;
    }

    // AC4 defect: uses <= and >= on endpoints, falsely rejecting touching intervals!
    const overlaps = currentRoom.bookings.some(b => start <= b.end && end >= b.start);
    if (overlaps) {
      setCheckResult({ available: false });
      return;
    }

    // AC5 defect: v1 mutates existing bookings on check and stores in localStorage!
    const newBooking = {
      id: 'b-' + Date.now(),
      title: 'Checked Reservation',
      start: start,
      end: end,
      timeStr: startTime + ' - ' + endTime
    };
    const updatedRooms = rooms.map(r => {
      if (r.id === currentRoom.id) {
        return { ...r, bookings: [...r.bookings, newBooking] };
      }
      return r;
    });
    setRooms(updatedRooms);
    localStorage.setItem('smart_campus_bookings', JSON.stringify(updatedRooms));

    setCheckResult({ available: true });
  };

  return (
    <div className="container">
      <div className="card">
        <div className="header">
          <h1>Smart Campus Room Availability Checker</h1>
          <p>Check room availability and book meeting rooms on campus.</p>
        </div>

        <div className="form-group">
          <label>Select Room</label>
          <select
            className="form-control"
            value={selectedRoomId}
            onChange={e => setSelectedRoomId(e.target.value)}
          >
            {rooms.map(r => (
              <option key={r.id} value={r.id}>
                {r.name} {r.isBlocked ? '(Blocked)' : ''}
              </option>
            ))}
          </select>
        </div>

        <div className="grid-2">
          <div className="form-group">
            <label>Start Time</label>
            <input
              type="time"
              className="form-control"
              value={startTime}
              onChange={e => setStartTime(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>End Time</label>
            <input
              type="time"
              className="form-control"
              value={endTime}
              onChange={e => setEndTime(e.target.value)}
            />
          </div>
        </div>

        <div>
          <button className="btn btn-primary" onClick={handleCheck}>
            Check Availability
          </button>
        </div>

        {checkResult && (
          <div className={`result-card ${checkResult.available ? 'available' : 'unavailable'}`}>
            <span className={`badge ${checkResult.available ? 'badge-available' : 'badge-unavailable'}`}>
              {checkResult.available ? 'Available' : 'Unavailable'}
            </span>
          </div>
        )}
      </div>

      <div className="card">
        <h3>Existing Bookings for {currentRoom.name}</h3>
        {currentRoom.bookings.map(b => (
          <div key={b.id} className="booking-item">
            <span>{b.title}</span>
            <strong>{b.timeStr}</strong>
          </div>
        ))}
      </div>
    </div>
  );
}
