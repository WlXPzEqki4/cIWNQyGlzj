export function loadCSV(filePath, callback) {
  Papa.parse(filePath, {
    download: true,
    header: true,
    skipEmptyLines: true,
    complete: function(results) {
      callback(results.data);
    }
  });
}

  
  export function renderPagination(data, containerId, paginationId, renderRow) {
    const container = document.getElementById(containerId);
    const pagination = document.getElementById(paginationId);
    let currentPage = 1;
    const rowsPerPage = 5;
  
    function displayPage(page) {
      container.innerHTML = "";
      const start = (page - 1) * rowsPerPage;
      const end = start + rowsPerPage;
      const currentData = data.slice(start, end);
  
      currentData.forEach(row => {
        const div = document.createElement('div');
        div.innerHTML = renderRow(row);
        container.appendChild(div);
      });
  
      pagination.innerHTML = "";
      const totalPages = Math.ceil(data.length / rowsPerPage);
      for (let i = 1; i <= totalPages; i++) {
        const button = document.createElement('button');
        button.textContent = i;
        button.onclick = () => {
          currentPage = i;
          displayPage(currentPage);
        };
        pagination.appendChild(button);
      }
    }
  
    displayPage(currentPage);
  }
  