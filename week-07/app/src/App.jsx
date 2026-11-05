import React, { useState } from 'react';
import { checkRoomAvailability, toMinutes, formatMinutes } from './availability.js';

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

export default function App() {
  const [rooms, setRooms] = useState(INITIAL_ROOMS);
  const [selectedRoomId, setSelectedRoomId] = useState('room-101');
  const [isBlocked, setIsBlocked] = useState(false);
  const [currentTime, setCurrentTime] = useState('09:00');
  const [startTime, setStartTime] = useState('11:00');
  const [endTime, setEndTime] = useState('12:00');
  const [isEndOfDay, setIsEndOfDay] = useState(false);
  const [decision, setDecision] = useState(null);

  const currentRoom = rooms.find(r => r.id === selectedRoomId) || rooms[0];

  const handleCheck = () => {
    const startMinutes = toMinutes(startTime);
    const endMinutes = isEndOfDay ? 1440 : toMinutes(endTime);
    const currentMinutes = toMinutes(currentTime);

    const roomToCheck = {
      ...currentRoom,
      isBlocked: isBlocked || currentRoom.isBlocked
    };

    // Pure check: evaluates availability without modifying existing bookings (AC5)
    const result = checkRoomAvailability(roomToCheck, startMinutes, endMinutes, currentMinutes);
    setDecision(result);
  };

  return (
    <div className="container">
      <div className="card">
        <div className="header">
          <h1>Smart Campus Room Availability Checker</h1>
          <p>Verify room availability for meeting slots according to campus booking policy.</p>
        </div>

        <div className="grid-2">
          <div className="form-group">
            <label htmlFor="room-select">Selected Room</label>
            <select
              id="room-select"
              className="form-control"
              value={selectedRoomId}
              onChange={e => {
                const id = e.target.value;
                setSelectedRoomId(id);
                const r = rooms.find(item => item.id === id);
                setIsBlocked(r ? r.isBlocked : false);
                setDecision(null);
              }}
            >
              {rooms.map(r => (
                <option key={r.id} value={r.id}>
                  {r.name} {r.isBlocked ? '(Blocked)' : ''}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="current-time">Supplied Current Time</label>
            <input
              id="current-time"
              type="time"
              className="form-control"
              value={currentTime}
              onChange={e => setCurrentTime(e.target.value)}
            />
          </div>
        </div>

        <div className="form-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={isBlocked}
              onChange={e => setIsBlocked(e.target.checked)}
            />
            Mark room as blocked (Maintenance / Reserved)
          </label>
        </div>

        <div className="grid-2">
          <div className="form-group">
            <label htmlFor="start-time">Candidate Start Time</label>
            <input
              id="start-time"
              type="time"
              className="form-control"
              value={startTime}
              onChange={e => setStartTime(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="end-time">Candidate End Time</label>
            <input
              id="end-time"
              type="time"
              className="form-control"
              value={endTime}
              disabled={isEndOfDay}
              onChange={e => setEndTime(e.target.value)}
            />
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={isEndOfDay}
                onChange={e => setIsEndOfDay(e.target.checked)}
              />
              Book until End of Day (24:00)
            </label>
          </div>
        </div>

        <div>
          <button className="btn" onClick={handleCheck}>
            Check Availability
          </button>
        </div>

        {decision && (
          <div className={`result-card ${decision.available ? 'available' : 'unavailable'}`}>
            <div className="result-header">
              <strong>Availability Decision:</strong>
              <span className={`badge ${decision.available ? 'badge-available' : 'badge-unavailable'}`}>
                {decision.available ? 'Available' : 'Unavailable'}
              </span>
            </div>
            <div className="result-reason">{decision.reason}</div>
          </div>
        )}
      </div>

      <div className="card">
        <h3>Existing Bookings for {currentRoom.name}</h3>
        <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '12px' }}>
          Checking availability does not alter or confirm any bookings (AC5).
        </p>
        {currentRoom.bookings.length === 0 ? (
          <div style={{ color: '#64748b', fontSize: '14px' }}>No existing bookings for today.</div>
        ) : (
          currentRoom.bookings.map(b => (
            <div key={b.id} className="booking-item">
              <span>{b.title}</span>
              <strong>{b.timeStr}</strong>
            </div>
          ))
        )}

        <ul className="rules-list">
          <li>• AC1: Candidate interval [start, end) must be strictly after supplied current time.</li>
          <li>• AC2: Maximum booking length is 120 minutes.</li>
          <li>• AC3: Blocked rooms cannot be booked.</li>
          <li>• AC4: Overlaps are rejected; touching endpoints (e.g. 11:00-12:00 after 10:00-11:00) are allowed.</li>
        </ul>
      </div>
    </div>
  );
}
