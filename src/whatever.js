const validMessage = message => {
  // XML "special characters" - https://docs.oracle.com/cd/A97335_02/apps.102/bc4j/developing_bc_projects/obcCustomXml.htm
  const specialCharacters = RegExp(/<|>|&|"|'/);
  if (specialCharacters.test(message) === true) {
    return false;
  } else {
    return true;
  }
};

console.log(validMessage("abc")); // true
console.log(validMessage("ab'c")); // false
console.log(validMessage("a<bc")); // false
console.log(validMessage("ab>c")); // false
console.log(validMessage("&abc")); // false