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
    const sistMorning = data.filter(x => x.ampm === 'am').map((v) => { return { x: new Date(v.date), y: v.sist }});
    const diastMorning = data.filter(x => x.ampm === 'am').map((v) => { return { x: new Date(v.date), y: v.diast }});
    const sistEvening = data.filter(x => x.ampm === 'pm').map((v) => { return { x: new Date(v.date), y: v.sist }});
    const diastEvening = data.filter(x => x.ampm === 'pm').map((v) => { return { x: new Date(v.date), y: v.diast }});

    const chart = new Chartist.Line('.ct-chart', {
      series: [
        {
          name: 'morning - sist',
          data: sistMorning
        },
        {
          name: 'morning - diast',
          data: diastMorning
        },
        {
          name: 'evening - sist',
          data: sistEvening
        },
        {
          name: 'evening - diast',
          data: diastEvening
        }
      ]
    }, {
      axisX: {
        type: Chartist.FixedScaleAxis,
        divisor: 7,
        labelInterpolationFnc: function(value) {
          return moment(value).format('MMM D');
        }
      },
      plugins: [
        Chartist.plugins.tooltip({
          transformTooltipTextFnc: function(tooltip) {
            const parts = tooltip.split(',');
            return `${parts[1]}<br>${moment.unix(parts[0]/1000).format('llll')}`;
          }
        }),
        Chartist.plugins.legend()
      ]
    });
  }
}