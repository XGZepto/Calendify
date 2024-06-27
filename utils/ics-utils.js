export function generateICSFile(eventDetails) {
    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Your Company//Your Product//EN',
      'BEGIN:VEVENT',
      `UID:${new Date().getTime()}@yourdomain.com`,
      `DTSTAMP:${formatDate(new Date())}`,
      `DTSTART:${formatDate(new Date(eventDetails.startDate))}`,
      `DTEND:${formatDate(new Date(eventDetails.endDate))}`,
      `SUMMARY:${eventDetails.title}`,
      `DESCRIPTION:${eventDetails.description}`,
      `LOCATION:${eventDetails.location}`,
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');
  
    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = 'event.ics';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
  
  function formatDate(date) {
    return date.toISOString().replace(/[-:]/g, '').slice(0, -5) + 'Z';
  }