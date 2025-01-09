// import { loadCSV } from './utils.js';

// function renderVisualTimeline() {
//   const container = document.getElementById('timeline');
//   container.innerHTML = ""; // Clean container

//   loadCSV('./assets/articles.csv', (data) => {
//     // Sort events chronologically based on Publication Date
//     const sortedData = data.sort((a, b) => {
//       const dateA = new Date(a['Publication Date']);
//       const dateB = new Date(b['Publication Date']);
//       return dateA - dateB;
//     });

//     // Dynamically generate vertical timeline events
//     sortedData.forEach((item) => {
//       const event = document.createElement('div');
//       event.className = 'timeline-event-vertical';
//       event.innerHTML = `
//         <div class="timeline-marker-vertical"></div>
//         <div class="event-line-vertical"></div>
//         <div class="event-content-vertical">
//           <h4>${item.Title}</h4>
//           <p><strong>Source:</strong> ${item['Source Name']}</p>
//           <p><strong>Date:</strong> ${item['Publication Date']}</p>
//           <a href="${item.URL}" target="_blank">Read More</a>
//         </div>
//       `;
//       container.appendChild(event);
//     });
//   });
// }

// renderVisualTimeline();



import { loadCSV } from './utils.js';

function renderVisualTimeline() {
  const container = document.getElementById('timeline');
  container.innerHTML = ""; // Clean container

  loadCSV('./assets/articles.csv', (data) => {
    console.log("Raw CSV Data:", data); // Log all rows

    // Filter out empty rows (if necessary)
    const filteredData = data.filter(item => item.Title && item.URL);

    console.log("Filtered Data Length:", filteredData.length); // Verify total rows

    filteredData.forEach((item) => {
      const event = document.createElement('div');
      event.className = 'timeline-event-vertical';
      event.innerHTML = `
        <div class="timeline-marker-vertical"></div>
        <div class="event-content-vertical">
          <h4>${item.Title}</h4>
          <p><strong>Source:</strong> ${item['Source Name']}</p>
          <p><strong>Date:</strong> ${item['Publication Date']}</p>
          <a href="${item.URL}" target="_blank">Read More</a>
        </div>
      `;
      container.appendChild(event);
    });
  });
}

renderVisualTimeline();
