export const generatePassword = () => {
  let result = '';

  const symbol = ['!', '@', '#', '$']
  let random = Math.floor(Math.random()
    * (3 - 0 + 1)+0);
  result = symbol[random]

  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  const charactersLength = characters.length;
  let charCounter = 0
  while (charCounter < 6) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    charCounter += 1;
  }

  const numbers = '0123456789'
  const numberLength = numbers.length
  let numCounter = 0
  while (numCounter < 3) {
    result += numbers.charAt(Math.floor(Math.random() * numberLength));
    numCounter += 1;
  }

  return result;
}

export const generateKey = () => {
  let result = '';

  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz123456789';
  const charactersLength = characters.length;
  let charCounter = 0
  while (charCounter < 25) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    charCounter += 1;
  }

  return result;
}