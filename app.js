const currencyOne = document.querySelector('[data-js="currency-one"]')
const currencyTwo = document.querySelector('[data-js="currency-two"]')
const inputCurrency = document.querySelector('[data-js="currency-one-times"]')
const convertedValue = document.querySelector('[data-js="converted-value"]')
const presionValue = document.querySelector('[data-js="conversion-precision"]')

const APIKey = `77eba15c76a727df52ae4b91`
let currency = `USD`
let url = `https://v6.exchangerate-api.com/v6/${APIKey}/latest/${currency}`

const fetchApi = async url => {
  try{
    const response = await fetch(url)

    if (!response.ok) {
      throw new Error('Não foi possível carregar os dados das moedas!')
    }
  
    return response.json()
  }catch({name, message}) {
    alert(`${name}: ${message}`)
  }
}

let getCurrencyOne, getCurrencyTwo, selectedCurrencyOne, selectedCurrencyTwo

const generateCurrancyOptions = (arrOfCurrencys, pattern1 = 'USD', patter2 = 'BRL') => 
  arrOfCurrencys.map((currency) => {   
    if (currency.includes(pattern1)) {
      selectedCurrencyOne = `<option selected value="${currency}">${currency[0]}</option>`
    } else if (currency.includes(patter2)) {
      selectedCurrencyTwo = `<option selected value="${currency}">${currency[0]}</option>`
    } 
    return `<option value="${currency}">${currency[0]}</option>`
  })

const populateSelect = (arrOfCurrencyOptions, pattern1, pattern2) => 
  arrOfCurrencyOptions.forEach((optCurrency) => {
    currencyOne.innerHTML += optCurrency.includes(pattern1) ? selectedCurrencyOne : optCurrency
    currencyTwo.innerHTML += optCurrency.includes(pattern2) ? selectedCurrencyTwo : optCurrency
  })

const showPrecisionValue = () => 
  presionValue.textContent = `Valor Unitário: ${getCurrencyOne[1]} ${getCurrencyOne[0]} = ${getCurrencyTwo[1]} ${getCurrencyTwo[0]}`

const getSelectedCurrencys = (arrOfCurrencys, pattern1, pattern2) => {
  getCurrencyOne = arrOfCurrencys.find(element => element.includes(pattern1))
  getCurrencyTwo = arrOfCurrencys.find(element => element.includes(pattern2))
}

const getAllCurrencys = async (pattern1 = 'USD', pattern2 = 'BRL') => {
  const {conversion_rates} = await fetchApi(url)
  const allCurrencys = Object.entries(conversion_rates)

  getSelectedCurrencys(allCurrencys, pattern1, pattern2)
  const currencys = generateCurrancyOptions(allCurrencys, pattern1, pattern2)
  populateSelect(currencys, pattern1, pattern2)
  showPrecisionValue()  
}

const changeSelectValueOne =  async event => {
  const selectCurrencyOneValue = event.target.value.split(',')[0]
  url = `https://v6.exchangerate-api.com/v6/${APIKey}/latest/${selectCurrencyOneValue}`
  await getAllCurrencys(selectCurrencyOneValue, currencyTwo.value.split(',')[0])
}

const changeSelectValueTwo = async event => {
  const selectCurrencyTwoValue = event.target.value.split(',')[0]
  await getAllCurrencys(currencyOne.value.split(',')[0], selectCurrencyTwoValue)
}

const calculateCurrecy =  event => {
  const inputValue = event.target.valueAsNumber
  const calculate = inputValue * getCurrencyTwo[1]
  if (!isNaN(calculate)) {
    convertedValue.textContent = calculate.toFixed(2)
  }  
}

currencyOne.addEventListener('input',changeSelectValueOne)
currencyTwo.addEventListener('input', changeSelectValueTwo)
inputCurrency.addEventListener('input',calculateCurrecy)

getAllCurrencys() 

