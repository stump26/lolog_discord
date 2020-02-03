import chamnames from './krChampion.json';
console.log('TCL: chamnames', chamnames, chamnames.length);

const val = chamnames.find(cham => {
  return cham.KR.includes('아트');
});
console.log('TCL: val', val?.EN);
