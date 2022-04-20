async function getData(url) {
  try {
    const response = await fetch(url);
    return await response.text();
  } catch (err) {
    console.error(err);
    return null;
  }
}

function csv2json(csv) {
  const results = [];
  if (csv) {
    const lines = csv.split(/\r?\n/gm);
    lines.map(line => {
      if (line) {
        const p = line.split(',');
        results.push({
          date: new Date(p[0]),
          ampm: p[1],
          dow: p[2],
          sist: parseInt(p[3]),
          diast: parseInt(p[4]),
          pulse: parseInt(p[5]),
        });
      }
    })
  }
  return results;
}

function generateTableHead(table, data) {
  let thead = table.createTHead();
  let row = thead.insertRow();
  for (let key of data) {
    let th = document.createElement("th");
    let text = document.createTextNode(key);
    th.appendChild(text);
    row.appendChild(th);
  }
}

function generateTable(table, data) {
  for (let element of data) {
    let row = table.insertRow();
    for (key in element) {
      let cell = row.insertCell();
      let val = element[key] instanceof Date ? element[key].toISOString().split('T')[0] : element[key];
      let text = document.createTextNode(val);
      cell.appendChild(text);
    }
  }
}

// `window.onload` respects `async` calls
window.onload = async () => {
  const csv = await getData('Blood pressure.csv');
  if (csv) {
    const data = csv2json(csv);

    const table = document.querySelector('table')
    const headers = ['Date', 'AM/PM', 'Day of Week', 'Syst', 'Diast', 'Pulse']
    generateTableHead(table, headers);
    generateTable(table, data);

    const labels = data.filter(x => x.ampm === 'am').map(v => v.date.toISOString().split('T')[0]);
    const sistMorning = data.filter(x => x.ampm === 'am').map((v) => { return { x: v.date, y: v.sist }});
    const diastMorning = data.filter(x => x.ampm === 'am').map((v) => { return { x: v.date, y: v.diast }});
    const sistEvening = data.filter(x => x.ampm === 'pm').map((v) => { return { x: v.date, y: v.sist }});
    const diastEvening = data.filter(x => x.ampm === 'pm').map((v) => { return { x: v.date, y: v.diast }});

    const datasets = [
      {
        label: 'sist morning',
        borderColor: 'rgba(0, 128, 0, 0.5)',
        pointBackgroundColor: 'rgba(0, 128, 0, 0.5)',
        data: sistMorning
      },
      {
        label: 'diast morning',
        borderColor: 'rgba(0, 0, 255, 0.5)',
        pointBackgroundColor: 'rgba(0, 0, 255, 0.5)',
        data: diastMorning
      },
      {
        label: 'sist evening',
        borderColor: 'rgba(255, 165, 0, 0.5)',
        pointBackgroundColor: 'rgba(255, 165, 0, 0.5)',
        data: sistEvening
      },
      {
        label: 'diast evening',
        borderColor: 'rgba(255, 0, 255, 0.5)',
        pointBackgroundColor: 'rgba(255, 0, 255, 0.5)',
        data: diastEvening
      }
    ];

    const ctx = document.getElementById('chart').getContext('2d');
    const chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels,
        datasets,
      },
    });
  }
}