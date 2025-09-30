const gid = (a) => document.getElementById(a)
const set = (elem, num) => elem.setAttribute('data-number', String(num))

const getFormattedTime = (now) => {
  const hours = now.getHours().toString().padStart(2, '0');
  const minutes = now.getMinutes().toString().padStart(2, '0');
  const seconds = now.getSeconds().toString().padStart(2, '0');

  return `${hours}${minutes}${seconds}`;
}

const blocks = [
  ['H1', 'H2'],
  ['M1', 'M2'],
  ['S1', 'S2'],
];

const numberHeight = 6, numberWidth = 4;

const symbols = {
  ' ': [ 225, 45 ],
  '│': [ 0, 0 ],
  '─': [ 90, 90 ],
  '┌': [ 90, 0 ],
  '┐': [ 270, 0 ],
  '└': [ 0, 270 ],
  '┘': [ 0, 90 ],
};

const clockwiseRotation = (from, to) => from%360 == to ? from : from > to ? 360*Math.ceil(from / 360) + to : to


/* -------------------------- Create HTML Elements -------------------------- */

const container = gid('container');
const t_display = gid('t_display');

const elements = [];

for (let block of blocks) {
  const bdiv = document.createElement('div');
  bdiv.classList = 'block';

  for (let display of block) {
    const ddiv = t_display.cloneNode(true);
    ddiv.setAttribute('id', display);

    elements.push(ddiv);

    bdiv.appendChild(ddiv);
  }

  container.appendChild(bdiv);
}



/* --------------------------- Symbols & Rotation --------------------------- */


async function main() {
  const data = (await ( await fetch('./data.txt') ).text()).split('\n')

  const setRotations = (block, number) => {
    for (let row = 0; row < numberHeight; row++) {
      for (let column = 0; column < numberWidth; column++) {
        const element = data[number*numberHeight + row][column] || ' ';
        
        console.log(number*numberHeight + row, data[number*row], element, `seg${row}x${column}`)
        const symbol = block.getElementsByClassName(`seg${row}x${column}`)[0];

        const rot = [+(symbol.getAttribute('rot1') || 0), +(symbol.getAttribute('rot2') || 0)];
        const reqRot = symbols[element];

        const clockwise = [
          clockwiseRotation(rot[0], reqRot[0]),
          clockwiseRotation(rot[1], reqRot[1])
        ]

        symbol.setAttribute('rot1', clockwise[0]);
        symbol.setAttribute('rot2', clockwise[1]);

        symbol.style.setProperty('--1rot', clockwise[0]+"deg");
        symbol.style.setProperty('--2rot', clockwise[1]+"deg");
      }
    }
  }


  /* ------------------------------- Update Time ------------------------------ */

  let lastTime = '';
  const update = () => {
    const date = getFormattedTime(new Date());

    for (let i in date) {
      if (lastTime[i] === date[i]) continue;

      setRotations(elements[i], +date[i]);
    }

    lastTime = date;
  }

  update();
  setInterval(update, 1000);
}


main()