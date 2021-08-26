'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Rachel Stone',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  pin: 1111,
  movementsDates: [
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-05-27T17:01:17.194Z',
    '2020-07-11T23:36:17.929Z',
    '2020-07-12T10:51:36.790Z',
    '2021-08-22T07:42:02.383Z',
    '2021-08-25T21:31:17.178Z',
  ],
  locale: 'he-IL',
  currency: 'ILS',
};

const account2 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  pin: 2222,
  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  locale: 'en-GB',
  currency: 'EUR',
};

const account3 = {
  owner: 'Lul Mainy',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  pin: 3333,
  movementsDates: [
    '2021-01-28T09:15:04.904Z',
    '2021-04-01T10:17:24.185Z',
    '2021-05-08T14:11:59.604Z',
    '2021-05-27T17:01:17.194Z',
    '2021-07-11T23:36:17.929Z',
    '2021-08-12T10:51:36.790Z',
    '2021-08-22T07:42:02.383Z',
    '2021-08-25T21:31:17.178Z',
  ],
  locale: 'en-US',
  currency: 'USD',
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  pin: 4444,
  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  locale: 'en-US',
  currency: 'USD',
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumTotalMove = document.querySelector('.summary__value--totalmove');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');
const movementDateLabel = document.querySelector('.movements__date');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////
let currentAccount, timer;

const FormatedMovDate = function(movDate, loc) {
  const now = new Date();
  const moveDate = new Date(movDate);
  const numDays = Math.round((now - moveDate)/(1000*60*60*24));
  if (numDays > 10){
    // const day = `${moveDate.getDate()}`.padStart(2,0);
    // const month = `${(moveDate.getMonth()+1)}`.padStart(2,0);
    // return `${day}/${month}/${moveDate.getFullYear()}`;
    return new Intl.DateTimeFormat(loc).format(moveDate);
  } else if (numDays >= 3) return `${numDays} days ago`;
    else if (numDays === 2) return "YESTERDAY";
    else return "TODAY";
}

const formattedMovVal = function(value, account){
  return new Intl.NumberFormat(account.loc, {style:'currency', currency: account.currency}).format(value);
}
// const shekelScale = 3.226;
// const shekelsValues = movements.map(mov => shekelScale * mov);
// console.log(shekelsValues);

const displayMovements = function (account, sort = false) {
  containerMovements.innerHTML = '';
  const movs = sort ? account.movements.slice().sort((a, b) => a - b) : account.movements;
  movs.forEach(function (value, i) {
    const type = value > 0 ? 'deposit' : 'withdrawal';
    const html = ` 
    <div class="movements__row">
      <div class="movements__type movements__type--${type}"> ${type}</div>
      <div class="movements__date">${FormatedMovDate(account.movementsDates[i], currentAccount.locale)}</div>
      <div class="movements__value">${formattedMovVal(value, account)}</div>
    </div>`;//value.toFixed(2)
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const calcDisplayBalance = function (account) {
  const balance = account.movements.reduce(((acc, mov) => acc + mov), 0);
  account.balance = balance;
  labelBalance.textContent = `${formattedMovVal(balance, account)}`;
}

const calcDisplaySummery = function (account) {
  labelSumIn.textContent = `${formattedMovVal((account.movements.filter(mov => mov > 0).reduce(((acc, mov) => acc + mov), 0)), account)}`;//.toFixed(2)
  labelSumOut.textContent = `${formattedMovVal((Math.abs(account.movements.filter(mov => mov <= 0).reduce(((acc, mov) => acc + mov), 0))), account)}`; //.toFixed(2)
  labelSumTotalMove.textContent = `${formattedMovVal((account.movements.reduce(((acc, mov) => acc + mov), 0)), account)}`;//.toFixed(2)
  // const maxValue = movements.reduce(((acc, mov) => acc = mov > acc ? mov : acc), 0);
}

const displayDate = function(label) {
  const now = new Date();
  // const day = `${now.getDate()}`.padStart(2,0);
  // const month = `${(now.getMonth()+1)}`.padStart(2,0);
  // const hour = `${now.getHours()}`.padStart(2,0);
  // const minutes = `${now.getMinutes()}`.padStart(2,0);
  // label.textContent = `${day}/${month}/${now.getFullYear()}, ${hour}:${minutes}`;
  const options = {
    hour: 'numeric',
    minute:'numeric',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    weekday: 'long',
  }
  // const locale = navigator.language;
  labelDate.textContent = new Intl.DateTimeFormat(currentAccount.locale, options).format(now);
}

const displayAccount = function () {
  displayMovements(currentAccount);
  calcDisplayBalance(currentAccount);
  calcDisplaySummery(currentAccount);
  displayDate(labelDate);

  if (timer) {
    clearInterval(timer);
  }
  timer = startLogOutTimer();
}

// fake login 
// currentAccount = account1;
// displayAccount();
// containerApp.style.opacity = 1;

const setAllUserNames = function (accounts) {
  accounts.forEach(acc => {
    acc.username = acc.owner.toLowerCase().split(' ').map(word => word[0]).join('');
  });
}
setAllUserNames(accounts);
console.log(accounts.map(acc => acc.username));

const startLogOutTimer = function(){
  let time = 5*60;
  const tick = function(){
    const min = String(Math.floor(time/60)).padStart(2,0);
    const sec = String(time%60).padStart(2,0);
    labelTimer.textContent = `${min}:${sec}`;
    if(time === 0){
      clearInterval(timer);
      containerApp.style.opacity = 0;
      labelWelcome.textContent = 'Log in to get started'
    }
    time--;
  }
  tick();
  timer = setInterval(tick, 1000)
}

// login user
btnLogin.addEventListener('click', function (e) {
  e.preventDefault(); // prevent form from submitting and dont load new page still
  currentAccount = accounts.find(acc => acc.username === inputLoginUsername.value);
  console.log(currentAccount);
  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    containerApp.style.opacity = 1;
    console.log('LOGIN to', currentAccount);
    displayAccount();
    labelWelcome.textContent = `Wellcome, ${currentAccount.owner}`
    inputLoginUsername.value = inputLoginPin.value = '';
  }
});


// transfer money
btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const toAcc = accounts.find(acc => acc.username === inputTransferTo.value);
  if (amount > 0 && toAcc && currentAccount.balance >= amount && toAcc.username !== currentAccount.username) {
    console.log('transfering');
    currentAccount.movements.push(-amount);
    toAcc.movements.push(amount);
    currentAccount.movementsDates.push((new Date()).toISOString());
    toAcc.movementsDates.push((new Date()).toISOString());
    displayAccount(currentAccount);
  } else {
    console.log('error!');
  }
  inputTransferAmount.value = inputTransferTo.value = '';
});


// request a loan
btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputLoanAmount.value);
  if (currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    currentAccount.movements.push(amount);
    currentAccount.movementsDates.push((new Date()).toISOString());
    displayAccount(currentAccount);
  }
  inputLoanAmount.value = '';
})


// close account
btnClose.addEventListener('click', function (e) {
  e.preventDefault();
  if (inputCloseUsername.value === currentAccount.username && Number(inputClosePin.value) === currentAccount.pin) {
    const index = accounts.findIndex(acc => acc.username === currentAccount.username);
    accounts.splice(index, 1);//delete account
    containerApp.style.opacity = 0;
    labelWelcome.textContent = 'Log in to get started'
  }
  inputCloseUsername.value = inputClosePin.value = '';
});


// sort movements
let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount, !sorted);
  sorted = !sorted;
})

