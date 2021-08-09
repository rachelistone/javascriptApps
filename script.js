'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Rachel Stone',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  pin: 1111,
};

const account2 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  pin: 2222,
};

const account3 = {
  owner: 'Lul Mainy',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  pin: 4444,
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
let currentAccount;


const displayMovements = function (movements, sort = false) {
  containerMovements.innerHTML = '';
  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;
  movs.forEach(function (value, i) {
    const type = value > 0 ? 'deposit' : 'withdrawal';
    const html = ` 
    <div class="movements__row">
      <div class="movements__type movements__type--${type}"> ${type}</div>
      <div class="movements__value">${value}$</div>
    </div>`;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const calcDisplayBalance = function (movements) {
  const balance = movements.reduce(((acc, mov) => acc + mov), 0);
  currentAccount.balance = balance;
  labelBalance.textContent = `${balance} $`;
}

const calcDisplaySummery = function (movements) {
  labelSumIn.textContent = `${movements.filter(mov => mov > 0).reduce(((acc, mov) => acc + mov), 0)}$`;
  labelSumOut.textContent = `${Math.abs(movements.filter(mov => mov <= 0).reduce(((acc, mov) => acc + mov), 0))}$`;
  labelSumTotalMove.textContent = `${movements.reduce(((acc, mov) => acc + mov), 0)}$`;
  // const maxValue = movements.reduce(((acc, mov) => acc = mov > acc ? mov : acc), 0);
}

const displayAccount = function () {
  displayMovements(currentAccount.movements);
  calcDisplayBalance(currentAccount.movements);
  calcDisplaySummery(currentAccount.movements);
}


const shekelScale = 3.226;
const shekelsValues = movements.map(mov => shekelScale * mov);
console.log(shekelsValues);


const setAllUserNames = function (accounts) {
  accounts.forEach(acc => {
    acc.username = acc.owner.toLowerCase().split(' ').map(word => word[0]).join('');
  });
}
setAllUserNames(accounts);
console.log(accounts.map(acc => acc.username));

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
  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
})
