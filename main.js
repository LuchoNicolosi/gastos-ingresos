//Selectores
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const form = document.querySelector("form");
const descripcion = form.elements.descripcion;
const monto = form.elements.monto;
const tipo = form.elements.tipo;
const fecha = form.elements.fecha;
const tabla = document.querySelector("#tabla");
const deleteAll = document.getElementById("delete");
console.log(deleteAll);
console.log(tabla);

//localStorage
const saveInLocalStorage = (state) => {
  localStorage.setItem("movimientos", JSON.stringify(state));
};

//state
let state = JSON.parse(localStorage.getItem("movimientos")) || [];

const month = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
];

//renders
const renderTable = (state) => {
  const tableHTML = `
        <table class="table">
            <thead>
                <tr>
                    <th scope="col">#</th>
                    <th scope="col">Fecha</th>
                    <th scope="col">Tipo</th>
                    <th scope="col">Descripcion</th>
                    <th scope="col">Monto</th>
                </tr>
            </thead>

            <tbody>
            ${state
              .map((data, index) => {
                return `
                <tr data-id=${index}>
               
                    <td scope="row" >${index + 1}</th>
                    <td scope="row" >${data.fecha}</th>
                    <td scope="row" >${
                      data.tipo == 1 ? "Ingreso" : "Gasto"
                    }</th>
                    <td scope="row" >${data.descripcion}</th>
                    <td scope="row" class="${
                      data.tipo == 1 ? "text-success" : "text-danger"
                    } ">$ ${data.monto}</th>
                </tr>
                `;
              })
              .join("")}
            </tbody>
        </table>
    `;
  tabla.innerHTML = tableHTML;
};

const renderChart = (state) => {
  const numeroMes = [...new Set(state.map((data) => data.fecha.split("-")[1]))];
  //   let uniSet = new Set(numMes);
  //   let uniSetToArray = [...uniSet];
  const ingresos = state
    .filter((data) => data.tipo == 1)
    .reduce((acum, currentValue) => {
      let mes = currentValue.fecha.split("-")[1];
      return {
        ...acum,
        [mes]: acum[mes]
          ? parseFloat(acum[mes]) + parseFloat(currentValue.monto)
          : parseFloat(currentValue.monto),
      };
    }, {});

  const gastos = state
    .filter((data) => data.tipo == 2)
    .reduce((acum, currentValue) => {
      let mes = currentValue.fecha.split("-")[1];
      return {
        ...acum,
        [mes]: acum[mes]
          ? parseFloat(acum[mes]) + parseFloat(currentValue.monto)
          : parseFloat(currentValue.monto),
      };
    }, {});

  //completa con 0 los undefined
  numeroMes.forEach((num) => {
    num in gastos ? null : (gastos[num] = 0);
    num in ingresos ? null : (ingresos[num] = 0);
  });

  const valorPorMesIngreso = Object.keys(ingresos)
    .sort()
    .map((key) => ingresos[key]);

  const valorPorMesGasto = Object.keys(ingresos)
    .sort()
    .map((key) => gastos[key]);

  const meses = numeroMes.sort().map((numMes) => month[numMes - 1]);

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const myChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: [...meses],
      datasets: [
        {
          label: "Ingresos",
          fill: false,
          data: [...valorPorMesIngreso],
          color: "#1d2d50",
          borderColor: "#4CAF50",
          backgroundColor: "4CAF50",
        },
        {
          label: "Gastos",
          fill: false,
          data: [...valorPorMesGasto],
          color: "#1d2d50",
          borderColor: "#ff414d",
          backgroundColor: "ff414d",
        },
      ],
    },
  });
};

//handlers

const handlerSubmit = (e) => {
  e.preventDefault();
  console.log(e.target.name);
  if (
    descripcion.value !== "" &&
    monto.value !== "" &&
    tipo.value !== "" &&
    fecha.value !== ""
  ) {
    state = [
      ...state,
      {
        descripcion: descripcion.value,
        monto: monto.value,
        tipo: tipo.value,
        fecha: fecha.value,
      },
    ];

    form.reset();
    saveInLocalStorage(state);
    renderTable(state);
    renderChart(state);
  }
};

const handlerDelete = ({ target }) => {
  if (target.nodeName !== "BUTTON") {
    return;
  }

  state.splice(0);
  saveInLocalStorage(state);
  renderTable(state);
  renderChart(state);
};

//init
function init() {
  renderTable(state);
  renderChart(state);
  form.addEventListener("submit", handlerSubmit);
  deleteAll.addEventListener("click", handlerDelete);
}
init();
