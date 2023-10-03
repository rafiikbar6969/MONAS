function searchData() {
  const searchTerm = document.getElementById("searchInput").value;

  const apiUrl = `http://localhost:3001/data-2022/search?term=${searchTerm}`;

  fetch(apiUrl)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      displayData(data);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

function displayData(data) {
  const displayArea = document.getElementById("displayArea");

  displayArea.innerHTML = "";

  if (!data || data.length === 0) {
    displayArea.innerHTML = "Tidak ada data yang ditemukan.";
    return;
  }

  const container = document.createElement("div");
  container.classList.add("data-container");

  data.forEach((rowData, index) => {
    const dataItem = document.createElement("div");
    dataItem.classList.add("data-item");

    for (const key in rowData) {
      const label = document.createElement("div");
      label.classList.add("label");
      label.textContent = `${key}`;
      dataItem.appendChild(label);

      const value = document.createElement("div");
      value.classList.add("value");
      value.textContent = rowData[key];
      dataItem.appendChild(value);
    }

    if (index > 0) {
      const separator = document.createElement("hr");
      container.appendChild(separator);
    }

    container.appendChild(dataItem);
  });

  displayArea.appendChild(container);
}

function downloadData() {
  getDataForDownload()
    .then((dataForDownload) => {
      const blob = new Blob([dataForDownload], { type: "text/csv" });
      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = "data.csv";
      a.click();

      URL.revokeObjectURL(url);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

function getDataForDownload() {
  const searchTerm = document.getElementById("searchInput").value;

  const apiUrl = `http://localhost:3001/data-2022/search?term=${searchTerm}`;

  return fetch(apiUrl)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      return convertToCSV(data);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

function convertToCSV(data) {
  const keys = Object.keys(data[0]);
  const csvData = [];
  csvData.push(keys.join(","));

  for (let i = 0; i < data.length; i++) {
    const values = keys.map((key) => data[i][key]);
    csvData.push(values.join(","));
  }

  return csvData.join("\n");
}