import React from 'react';

function DoctorContent() {
  const styles = {
    container: {
      padding: '2em 0px 2em 15em', // Added bottom padding
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh', // Ensure it covers full viewport height
      backgroundColor: '#f5f7fa',
      fontFamily: 'Poppins, sans-serif',
      top: '19rem'
    },
    headers: {
      marginBottom: '1.5rem',
      color: '#2c3e50',
      fontWeight: '600',
      textAlign: 'left',
      fontSize: '1.8rem',
    },
    reminderLayouts: {
      display: 'flex',
      gap: '2rem',
      marginBottom: '2rem',
      flexWrap: 'wrap', // Allow wrapping on smaller screens
    },
    reminders: {
      padding: '1.5rem',
      border: '1px solid #d1d5db',
      borderRadius: '8px',
      backgroundColor: '#fff',
      flex: '1',
      minWidth: '300px', // Minimum width before wrapping
      maxWidth: '400px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
    },
    reminderHeader: {
      fontSize: '1.2rem',
      fontWeight: '600',
      color: '#1e40af',
      marginBottom: '1rem',
      paddingBottom: '0.5rem',
      borderBottom: '1px solid #e5e7eb',
    },
    reminderItem: {
      padding: '0.75rem 0',
      borderBottom: '1px solid #f3f4f6',
      '&:last-child': {
        borderBottom: 'none',
      },
    },
    reminderText: {
      margin: '0.25rem 0',
      lineHeight: '1.5',
    },
    urgent: {
      color: '#dc2626',
      fontWeight: '600',
    },
    notificationTime: {
      color: '#6b7280',
      fontSize: '0.9rem',
      marginTop: '0.25rem',
    },
  };

  // Hardcoded fake appointments data
  const appointments = [
    {
      id: 1,
      patient: 'Jane Doe',
      time: 'Today, 10:30 AM',
      reason: 'Annual checkup',
      urgent: false
    },
    {
      id: 2,
      patient: 'Michael Smith',
      time: 'Tomorrow, 2:00 PM',
      reason: 'Follow-up visit',
      urgent: true
    }
  ];

  // Hardcoded fake notifications data
  const notifications = [
    {
      id: 1,
      message: 'New lab results for Sarah Johnson',
      time: '2 hours ago'
    },
    {
      id: 2,
      message: 'Prescription refill request from David Wilson',
      time: 'Yesterday'
    }
  ];

  return (
    <div style={styles.container}>
      <div style={styles.headers}>
        <h1>Welcome Dr. Maragh</h1>
      </div>

      <div style={styles.reminderLayouts}>
        {/* Appointments Section */}
        <div style={styles.reminders}>
          <h4 style={styles.reminderHeader}>Upcoming Appointments</h4>
          {appointments.map(appt => (
            <div key={appt.id} style={styles.reminderItem}>
              <p style={styles.reminderText}>
                <strong>{appt.patient}</strong>
                {appt.urgent && <span style={styles.urgent}> (Urgent)</span>}
              </p>
              <p style={styles.reminderText}>{appt.time}</p>
              <p style={styles.reminderText}>{appt.reason}</p>
            </div>
          ))}
        </div>

        {/* Notifications Section */}
        <div style={styles.reminders}>
          <h4 style={styles.reminderHeader}>Notifications</h4>
          {notifications.map(notif => (
            <div key={notif.id} style={styles.reminderItem}>
              <p style={styles.reminderText}>{notif.message}</p>
              <p style={styles.notificationTime}>{notif.time}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default DoctorContent;