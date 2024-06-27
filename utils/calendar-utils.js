// Sample event for testing
const sampleEvent = {
    title: "Sample Event",
    startDate: "2024-06-27T13:00:00Z",
    endDate: "2024-06-27T14:00:00Z",
    location: "Hong Kong",
    description: "This is a sample event for testing purposes."
  };
  
  function formatDateForGoogle(dateString) {
    return dateString.replace(/[-:]/g, '').replace('.000', '');
  }
  
  export function generateGoogleCalendarUrl(event = sampleEvent) {
    const startDate = formatDateForGoogle(event.startDate);
    const endDate = formatDateForGoogle(event.endDate);
    
    const url = new URL('https://www.google.com/calendar/render');
    url.searchParams.append('action', 'TEMPLATE');
    url.searchParams.append('text', event.title);
    url.searchParams.append('dates', `${startDate}/${endDate}`);
    url.searchParams.append('details', event.description);
    url.searchParams.append('location', event.location);
  
    return url.toString();
  }
  
  export function openGoogleCalendarEvent(event = sampleEvent) {
    const url = generateGoogleCalendarUrl(event);
    window.open(url, '_blank');
  }