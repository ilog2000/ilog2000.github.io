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
        });
      }
    })
  }
  return results;
}

// `window.onload` respects `async` calls
window.onload = async () => {
  const csv = await getData('Blood pressure.csv');
  if (csv) {
    const data = csv2json(csv);
    const dates = data.filter(x => x.ampm === 'am').map(v => v.date.toISOString().split('T')[0]);
    const sistMorning = data.filter(x => x.ampm === 'am').map((v) => { return { x: v.date, y: v.sist }});
    const diastMorning = data.filter(x => x.ampm === 'am').map((v) => { return { x: v.date, y: v.diast }});
    const sistEvening = data.filter(x => x.ampm === 'pm').map((v) => { return { x: v.date, y: v.sist }});
    const diastEvening = data.filter(x => x.ampm === 'pm').map((v) => { return { x: v.date, y: v.diast }});

    const ctx = document.getElementById('chart').getContext('2d');
    const chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: dates,
        datasets: [
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
        ]
      }
    });
  }
}