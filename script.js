const inputSlider = document.querySelector("[data-lengthSlider]");
const lengthDisplay = document.querySelector("[data-lengthNumber]");
const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMSg]");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numberCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbols");
const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generateButton");
const allCheckBox = document.querySelectorAll("input[type='checkbox']");

let password = "";
let passwordLength = 10;
let checkCount = 0;
setIndicator("#b7b7c6");

const symbols = '~`!@$%^&*-_=+{|)(<>:"";/';

handleSlider();

function handleSlider() {
  inputSlider.value = passwordLength;
  lengthDisplay.innerText = passwordLength;
  const min = inputSlider.min;
  const max = inputSlider.max;
  inputSlider.style.backgroundSize = ((passwordLength-min)*100/(max-min)) + "% 100%"
}

function setIndicator(color) {
  indicator.style.backgroundColor = color;
  indicator.style.boxShadow = `0px 0px 12px 1px ${color}`; 
}

function getRndInteger(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

function generateRandomNumber() {
  return getRndInteger(0, 9);
}

function generateLowercase() {
  return String.fromCharCode(getRndInteger(97, 123));
}

function generateUppercase() {
  return String.fromCharCode(getRndInteger(65, 91));
}

function generateSymbol() {
  const randNum = getRndInteger(0, symbols.length);
  return symbols.charAt(randNum);
}

function calculateStrength() {
  let hasUpper = false;
  let hasLower = false;
  let hasSym = false;
  let hasNum = false;
  if (uppercaseCheck.checked) hasUpper = true;
  if (lowercaseCheck.checked) hasLower = true;
  if (symbolsCheck.checked) hasSym = true;
  if (numberCheck.checked) hasNum = true;

  if (hasUpper && hasLower && (hasNum || hasSym) && passwordLength >= 8) {
    setIndicator("#0f0");
  } else if (
    (hasLower || hasUpper) &&
    (hasNum || hasSym) &&
    passwordLength >= 6
  ) {
    setIndicator("#ff0");
  } else {
    setIndicator("#f00");
  }
}

async function copyContent() {
  try {
    await navigator.clipboard.writeText(passwordDisplay.value);
    copyMsg.innerText = "Copied";
  } catch (e) {
    copyMsg.innerText = "Failed";
  }
  copyMsg.classList.add("active");
  setTimeout(() => {
    copyMsg.classList.remove("active");
  }, 2000);
}


inputSlider.addEventListener("input", (e) => {
  passwordLength = e.target.value;
  handleSlider();
});

copyBtn.addEventListener("click", () => {
  if (passwordDisplay.value > 0) copyContent();
});

function handleCheckBoxChange() {
  checkCount = 0;
  allCheckBox.forEach((checkbox) => {
    if (checkbox.checked) checkCount++;
  });

  if (passwordLength < checkCount) {
    passwordLength = checkCount;
    handleSlider();
  }
}

allCheckBox.forEach((checkbox) => {
  checkbox.addEventListener("change", handleCheckBoxChange);
});

function shufflePassword(array) {
  // Fisher-Yates Shuffle Algorithm
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }

  let str = "";
  array.forEach((el) => (str += el)); // Corrected `+=` for string concatenation
  return str;
}

generateBtn.addEventListener("click", () => {
  //none of checkbox ticked
  if (checkCount <= 0) return;

  if (passwordLength < checkCount) {
    passwordLength = checkCount;
    handleSlider();
  }

  //password creation

  //remove old password
  password = "";

  let funcArr = [];

  if (uppercaseCheck.checked) {
    funcArr.push(generateUppercase);
  }

  if (lowercaseCheck.checked) {
    funcArr.push(generateLowercase);
  }

  if (symbolsCheck.checked) {
    funcArr.push(generateSymbol);
  }

  if (numberCheck.checked) {
    funcArr.push(generateRandomNumber);
  }

  //compulsary addition that is checked
  for (let i = 0; i < funcArr.length; i++) {
    password += funcArr[i]();
  }

  //remaining additon randomly
  for (let i = 0; i < passwordLength - funcArr.length; i++) {
    let randIndex = getRndInteger(0, funcArr.length);
    password += funcArr[randIndex]();
  }

  //shuffle the password
  password = shufflePassword(Array.from(password));

  //show in input box
  passwordDisplay.value = password;

  //sttrength
  calculateStrength();
});
