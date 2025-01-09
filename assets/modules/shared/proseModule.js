import { loadCSV } from './utils.js';

function renderCleanedCorpus() {
  const container = document.getElementById('cleaned-corpus');
  container.innerHTML = ""; // Clean up container before rendering

  loadCSV('./assets/cleaned_corpus.csv', (data) => {
    const rowsPerPage = 5;
    let currentPage = 1;

    function renderPage(page) {
      container.innerHTML = "";
      const start = (page - 1) * rowsPerPage;
      const end = start + rowsPerPage;
      const currentData = data.slice(start, end);

      currentData.forEach(row => {
        const card = document.createElement('div');
        card.className = "data-card";
        card.innerHTML = `
          <h4>ID: ${row.id} - ${row.title}</h4>
          <p><strong>Prose:</strong> ${row.prose}</p>
        `;
        container.appendChild(card);
      });

      renderPagination();
    }

    function renderPagination() {
      const pagination = document.createElement('div');
      pagination.className = 'pagination';
      const totalPages = Math.ceil(data.length / rowsPerPage);

      for (let i = 1; i <= totalPages; i++) {
        const button = document.createElement('button');
        button.textContent = i;
        button.className = i === currentPage ? 'active' : '';
        button.onclick = () => {
          currentPage = i;
          renderPage(currentPage);
        };
        pagination.appendChild(button);
      }
      container.appendChild(pagination);
    }

    renderPage(currentPage);
  });
}

renderCleanedCorpus();
