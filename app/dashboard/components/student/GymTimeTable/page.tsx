import React from 'react';
import { Calendar, Dumbbell, User, User2, Lock } from 'lucide-react';
import './GymSchedule.css';

interface ScheduleItem {
  day: string;
  male: string;
  female: string;
}

const GymSchedule: React.FC = () => {
  const schedule: ScheduleItem[] = [
    { day: 'Monday', male: '6:00 AM - 8:00 AM', female: '5:00 PM - 7:00 PM' },
    { day: 'Tuesday', male: '7:00 AM - 9:00 AM', female: '6:00 PM - 8:00 PM' },
    { day: 'Wednesday', male: '6:00 AM - 8:00 AM', female: '5:00 PM - 7:00 PM' },
    { day: 'Thursday', male: '7:00 AM - 9:00 AM', female: '6:00 PM - 8:00 PM' },
    { day: 'Friday', male: '6:00 AM - 8:00 AM', female: '5:00 PM - 7:00 PM' },
    { day: 'Saturday', male: '8:00 AM - 10:00 AM', female: '4:00 PM - 6:00 PM' },
    { day: 'Sunday', male: 'Closed', female: 'Closed' },
  ];

  return (
    <div className="gym-schedule">
      <h1 className="header">
        <Dumbbell size={32} className="icon" /> Gym Schedule
      </h1>
      <table className="schedule-table">
        <thead>
          <tr>
            <th>
              <span className="icon-text">
                <Calendar size={20} className="icon-inline" /> Day
              </span>
            </th>
            <th>
              <span className="icon-text">
                <User size={20} className="icon-inline" /> Male Timings
              </span>
            </th>
            <th>
              <span className="icon-text">
                <User2 size={20} className="icon-inline" /> Female Timings
              </span>
            </th>
          </tr>
        </thead>
        <tbody>
          {schedule.map((item, index) => (
            <tr key={index}>
              <td>
                <span className="icon-text">
                   {item.day}
                </span>
              </td>
              <td className={item.male === 'Closed' ? 'closed' : ''}>
                {item.male === 'Closed' ? (
                  <span className="icon-text">
                    <Lock size={18} className="icon-inline" /> {item.male}
                  </span>
                ) : (
                  item.male
                )}
              </td>
              <td className={item.female === 'Closed' ? 'closed' : ''}>
                {item.female === 'Closed' ? (
                  <span className="icon-text">
                    <Lock size={18} className="icon-inline" /> {item.female}
                  </span>
                ) : (
                  item.female
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="note">
        <strong>Note:</strong> Times not listed in the schedule are open for mixed training, and everyone is welcome to train during those hours.
      </p>
    </div>
  );
};

export default GymSchedule;
