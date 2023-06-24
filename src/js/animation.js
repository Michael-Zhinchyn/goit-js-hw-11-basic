function randomValue(max) {
  return Math.floor(Math.random() * max) + 'px';
}

function generateBoxShadow(n) {
  let boxShadow = `${randomValue(2000)} ${randomValue(2000)} #FFF`;
  for (let i = 1; i < n; i++) {
    boxShadow += `, ${randomValue(2000)} ${randomValue(2000)} #FFF`;
  }
  return boxShadow;
}

const stars1 = document.querySelector('#stars');
const stars2 = document.querySelector('#stars2');
const stars3 = document.querySelector('#stars3');

stars1.style.boxShadow = generateBoxShadow(700);
stars2.style.boxShadow = generateBoxShadow(200);
stars3.style.boxShadow = generateBoxShadow(100);

stars1.style.animation = 'animStar 50s linear infinite';
stars2.style.animation = 'animStar 100s linear infinite';
stars3.style.animation = 'animStar 150s linear infinite';

stars1.style.width = '1px';
stars2.style.width = '2px';
stars3.style.width = '3px';

stars1.style.height = '1px';
stars2.style.height = '2px';
stars3.style.height = '3px';
