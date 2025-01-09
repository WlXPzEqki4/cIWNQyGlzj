import { loadCSV } from './utils.js';

function renderFixedVisualTimeline() {
  const container = document.getElementById('fixed-visual-timeline');
  container.innerHTML = ""; // Clear the container

  loadCSV('./assets/articles.csv', (data) => {
    // Sort articles chronologically
    const sortedData = data.sort((a, b) => new Date(a['Publication Date']) - new Date(b['Publication Date']));

    // Pick key data to display
    const displayData = sortedData.slice(0, 6); // First 6 events as examples

    displayData.forEach((item) => {
      const event = document.createElement('div');
      event.className = 'fixed-visual-event';
      event.innerHTML = `
        <div class="fixed-event-content">
          <div class="event-year">${new Date(item['Publication Date']).getFullYear()}</div>
          <h4>${item.Title}</h4>
          <p><strong>Source:</strong> ${item['Source Name']}</p>
          <p><strong>Date:</strong> ${item['Publication Date']}</p>
        </div>
      `;
      container.appendChild(event);
    });
  });
}

renderFixedVisualTimeline();
