function isIsogram(str) {
  const arr = str.split('');
  const uniqName = arr.filter(
    (letter, index, array) => array.indexOf(letter) === index
  );
  if (arr.length === uniqName.length) {
    return true;
  } else {
    return false;
  }
  //...
}
console.log(isIsogram('Dermatoglyphics'));
console.log(isIsogram('aba'));
