import React, { useState, useEffect } from 'react';
import { ROOMS } from './rooms';
import { filterRooms } from './filter';
import { checkRoom } from './booking';
import { toMinutes, formatMinutes } from './availability';

const AVAILABLE_EQUIPMENT = [
  'projector',
  'whiteboard',
  'display',
  'computers',
  'microphones',
  'video-conference'
];

export default function App() {
  const query = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
  const initialAttendees = query?.get('attendees') !== null ? Number(query.get('attendees')) : 1;
  const initialEquipment = query?.get('equipment') ? query.get('equipment').split(',').filter(Boolean) : [];
  const initialRoomId = query?.get('room') || ROOMS[0].id;
  const initialCurrentTime = query?.get('now') || '09:00';
  const initialStartTime = query?.get('start') || '11:00';
  const initialEndTime = query?.get('end') || '12:00';
  const autoCheck = query?.get('check') === 'true' || query?.get('check') === '1';

  const [attendees, setAttendees] = useState(initialAttendees);
  const [selectedEquipment, setSelectedEquipment] = useState(initialEquipment);
  const [selectedRoomId, setSelectedRoomId] = useState(initialRoomId);
  const [currentTime, setCurrentTime] = useState(initialCurrentTime);
  const [startTime, setStartTime] = useState(initialStartTime);
  const [endTime, setEndTime] = useState(initialEndTime);
  const [isEndOfDay, setIsEndOfDay] = useState(false);
  const [decision, setDecision] = useState(null);
  const [hasChecked, setHasChecked] = useState(autoCheck);

  const filteredRooms = filterRooms(ROOMS, {
    attendees: Number(attendees) || 0,
    equipment: selectedEquipment
  });

  const effectiveSelectedId = filteredRooms.some(r => r.id === selectedRoomId)
    ? selectedRoomId
    : (filteredRooms[0]?.id || '');

  const currentRoom = ROOMS.find(r => r.id === effectiveSelectedId) || null;

  const toggleEquipment = (item) => {
    setSelectedEquipment(prev =>
      prev.includes(item) ? prev.filter(e => e !== item) : [...prev, item]
    );
  };

  const evaluateAvailability = (roomId) => {
    if (!roomId) return null;
    const startMinutes = toMinutes(startTime);
    const endMinutes = isEndOfDay ? 1440 : toMinutes(endTime);
    const currentMinutes = toMinutes(currentTime);

    const available = checkRoom(ROOMS, roomId, {
      start: startMinutes,
      end: endMinutes,
      now: currentMinutes
    });

    return {
      available,
      start: startTime,
      end: isEndOfDay ? '24:00' : endTime
    };
  };

  useEffect(() => {
    if (autoCheck && effectiveSelectedId) {
      setDecision(evaluateAvailability(effectiveSelectedId));
    }
  }, []);

  const handleCheck = () => {
    if (!effectiveSelectedId) return;
    const result = evaluateAvailability(effectiveSelectedId);
    setDecision(result);
    setHasChecked(true);
  };

  const handleRoomChange = (newId) => {
    setSelectedRoomId(newId);
    if (hasChecked) {
      const result = evaluateAvailability(newId);
      setDecision(result);
    }
  };

  return (
    <div className="container">
      <div className="card">
        <div className="header">
          <h1>Smart Campus Room Availability Checker</h1>
          <p>Catalog search, requirement filtering, and automated availability verification.</p>
        </div>

        <div className="filter-section card" style={{ background: '#f8fafc', marginBottom: '20px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '12px' }}>Catalog Filters (F1, F2)</h2>
          <div className="grid-2">
            <div className="form-group">
              <label htmlFor="attendees-filter">Required Attendees (Capacity ≥)</label>
              <input
                id="attendees-filter"
                type="number"
                min="1"
                className="form-control"
                value={attendees}
                onChange={e => setAttendees(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Required Equipment (Must contain ALL)</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '6px' }}>
                {AVAILABLE_EQUIPMENT.map(item => (
                  <label key={item} className="checkbox-label" style={{ fontSize: '12px' }}>
                    <input
                      type="checkbox"
                      checked={selectedEquipment.includes(item)}
                      onChange={() => toggleEquipment(item)}
                    />
                    {item}
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="grid-2">
          <div className="form-group">
            <label htmlFor="room-select">Matching Rooms ({filteredRooms.length})</label>
            {filteredRooms.length === 0 ? (
              <div className="empty-state" style={{ padding: '10px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '6px', color: '#991b1b', fontSize: '13px' }}>
                No rooms match the selected filter criteria (F4). Try lowering attendees or removing equipment.
              </div>
            ) : (
              <select
                id="room-select"
                className="form-control"
                value={effectiveSelectedId}
                onChange={e => handleRoomChange(e.target.value)}
              >
                {filteredRooms.map(r => (
                  <option key={r.id} value={r.id}>
                    {r.name} (Cap: {r.capacity}){r.blocked ? ' [BLOCKED]' : ''}
                  </option>
                ))}
              </select>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="current-time">Supplied Current Time</label>
            <input
              id="current-time"
              type="time"
              className="form-control"
              value={currentTime}
              onChange={e => {
                setCurrentTime(e.target.value);
                setDecision(null);
                setHasChecked(false);
              }}
            />
          </div>
        </div>

        <div className="grid-2">
          <div className="form-group">
            <label htmlFor="start-time">Candidate Start Time</label>
            <input
              id="start-time"
              type="time"
              className="form-control"
              value={startTime}
              onChange={e => {
                setStartTime(e.target.value);
                setDecision(null);
                setHasChecked(false);
              }}
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
              onChange={e => {
                setEndTime(e.target.value);
                setDecision(null);
                setHasChecked(false);
              }}
            />
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={isEndOfDay}
                onChange={e => {
                  setIsEndOfDay(e.target.checked);
                  setDecision(null);
                  setHasChecked(false);
                }}
              />
              Book until End of Day (24:00)
            </label>
          </div>
        </div>

        <div>
          <button
            className="btn"
            disabled={!effectiveSelectedId}
            onClick={handleCheck}
          >
            Check Room Availability
          </button>
        </div>

        {decision && (
          <div className={`result-card ${decision.available ? 'available' : 'unavailable'}`}>
            <div className="result-header">
              <strong>Availability Result for {currentRoom?.name}:</strong>
              <span className={`badge ${decision.available ? 'badge-available' : 'badge-unavailable'}`}>
                {decision.available ? 'Available' : 'Unavailable'}
              </span>
            </div>
            <div className="result-reason">
              Requested interval: {decision.start} – {decision.end}.
              {decision.available
                ? ' Slot meets all criteria (AC1–AC5) and does not conflict with existing bookings.'
                : ' Slot cannot be booked (past time, exceeds 120m, room blocked, or overlaps booking).'}
            </div>
          </div>
        )}
      </div>

      {currentRoom && (
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <h3 style={{ fontSize: '16px' }}>{currentRoom.name}</h3>
            {currentRoom.blocked && (
              <span className="badge badge-unavailable" style={{ fontSize: '11px', padding: '3px 8px' }}>
                Blocked (F3)
              </span>
            )}
          </div>
          <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '10px' }}>
            Capacity: <strong>{currentRoom.capacity}</strong> attendees | Equipment: {currentRoom.equipment.join(', ')}
          </p>

          <h4 style={{ fontSize: '14px', margin: '12px 0 8px 0', color: '#334155' }}>Existing Bookings Today:</h4>
          {currentRoom.bookings.length === 0 ? (
            <div style={{ color: '#64748b', fontSize: '13px' }}>No existing bookings for this room.</div>
          ) : (
            currentRoom.bookings.map((b, idx) => (
              <div key={idx} className="booking-item">
                <span>Reserved Slot #{idx + 1}</span>
                <strong>{formatMinutes(b.start)} – {formatMinutes(b.end)}</strong>
              </div>
            ))
          )}

          <ul className="rules-list">
            <li>• AC1: Candidate interval [start, end) must be strictly after current time.</li>
            <li>• AC2: Maximum booking length is 120 minutes.</li>
            <li>• AC3: Blocked rooms cannot be booked.</li>
            <li>• AC4: Overlaps are rejected; touching endpoints are allowed.</li>
            <li>• AC5: Availability evaluation leaves catalog and bookings unmutated.</li>
            <li>• AC6: Responsive mobile and desktop layout.</li>
          </ul>
        </div>
      )}
    </div>
  );
}
