;(async () => {
  const output = document.querySelector('#output');
  try {
    const response = await fetch('test.csv');
    const content = await response.text();
    output.innerText = content;
  } catch (err) {
    console.error(err);
  }
})()
