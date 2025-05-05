let stats = JSON.parse(localStorage.getItem("stats") || "[]");

const myData = [];
const myDates = [];

stats.forEach(element => {
  myData.push(Number(element.score))

  const formattedDate = new Date(element.date).toLocaleDateString();
  myDates.push(formattedDate);

});

console.log(myData);
console.log(myDates);

const options = {
    series: [{
    name: 'Stats',
    data: myData
  }],
    chart: {
    type: 'bar',
    height: 350
  },
  plotOptions: {
    bar: {
      horizontal: false,
      columnWidth: '55%',
      borderRadius: 5,
      borderRadiusApplication: 'end'
    },
  },
  dataLabels: {
    enabled: false
  },
  stroke: {
    show: true,
    width: 2,
    colors: ['transparent']
  },
  xaxis: {
    categories: myDates
  },
  yaxis: {
    title: {
      text: 'Correct answers'
    },
    min:0,
    max:10
  },
  fill: {
    opacity: 1
  },
  tooltip: {
    y: {
      formatter: function (val) {
        return val + " correct answers";
      }
    }
  }
  };

const chart = new ApexCharts(document.querySelector("#chart"), options);
chart.render();