const apiURL = "https://mindicador.cl/api/";
const resultado = document.querySelector(".resultado");
const selectElement = document.getElementById("moneda");
const buttonBuscar = document.getElementById("buttonBuscar");
const pesos = document.getElementById("inputClp");

buttonBuscar.addEventListener("click", function () {
  resultado.innerHTML =
    "<p>Esto puede demorar unos segundos, por favor espere</p>";
  renderResultado(selectElement.value);
  renderGrafica();
});

async function getIndicadores() {
  try {
    const res = await fetch(apiURL);
    if (!res.ok) throw new Error("Network fail");
    const indicadores = await res.json();
    return indicadores;
  } catch (error) {
    resultado.textContent =
      "No es posible acceder en este momento, intenten mas tarde.";
    console.error("Error: ", error);
  }
}

async function getAndCreateDataToChart(nombreIndicador) {
  const url = apiURL + nombreIndicador;
  const res = await fetch(url);
  const precios = await res.json();

  const label = precios["serie"].slice(0, 10).map(function (precio) {
    return new Date(precio.fecha).toLocaleDateString();
  });

  const data = precios["serie"].slice(0, 10).map(function (precio) {
    return Number(precio.valor);
  });

  const datasets = [
    {
      label: "Precio",
      borderColor: "#0288d1",
      backgroundColor: "rgba(2, 436, 409, 0.1)",
      data,
      fill: true,
    },
  ];

  return { labels: label, datasets };
}

let myChartInstance = null;

async function renderGrafica() {
  const data = await getAndCreateDataToChart(selectElement.value);
  const config = {
    type: "line",
    data,
    options: {
      scales: {
        x: {
          grid: {
            display: true,
            color: "#e0e0e0",
          },
        },
        y: {
          grid: {
            display: true,
            color: "#e0e0e0",
          },
        },
      },
    },
  };

  const myChart = document.getElementById("myChart");
  if (myChartInstance) {
    myChartInstance.destroy();
  }
  myChartInstance = new Chart(myChart, config);
}
async function renderResultado(nombreIndicador) {
  const indicadores = await getIndicadores();
  if (indicadores[nombreIndicador]) {
    let total =
      Number(pesos.value) / Number(indicadores[nombreIndicador].valor);
    let html = `
              <p>Resultado: $${total}</p>
          `;
    resultado.innerHTML = html;
  } else {
    resultado.textContent = "Primero seleccione una moneda.";
  }
}
