import { loadCSV } from './utils.js';

function renderInteractiveArticleTable() {
  const container = document.getElementById('table-content');

  // Clean up container before rendering
  container.innerHTML = `
    <div style="overflow-x: auto;">
      <table id="articles-table" class="display nowrap" style="width: 100%;"></table>
    </div>
  `;

  // Load CSV and render DataTable
  loadCSV('./assets/articles.csv', (data) => {
    const columns = Object.keys(data[0]).map(key => ({
      title: key.replace(/_/g, ' '),
      data: key
    }));

    $('#articles-table').DataTable({
      data: data,
      columns: columns,
      scrollX: true,
      paging: true,
      responsive: false
    });
  });
}

renderInteractiveArticleTable();
