const currencyOneEl = document.querySelector('[data-js="currency-one"]')
const currencyTwoEl = document.querySelector('[data-js="currency-two"]')
const inputCurrency = document.querySelector('[data-js="currency-one-times"]')
const convertedValue = document.querySelector('[data-js="converted-value"]')
const presionValue = document.querySelector('[data-js="conversion-precision"]')

const APIKey = `01ec3b20673ff8304a2bdbed`

let getUrl = currency => `https://v6.exchangerate-api.com/v6/${APIKey}/latest/${currency}`

const fetchApi = async currency => {
  try {
    const response = await fetch(getUrl(currency))

    if (!response.ok) {
      throw new Error('Não foi possível carregar os dados das moedas!')
    }

    return response.json()
  } catch ({ name, message }) {
    alert(`${name}: ${message}`)
  }
}

const getPrecisionValues = (currencyOneText, currencyTwoText, currencyTwoValue) => {
  presionValue.textContent = `Valor Unitário: 1 ${currencyOneText} = ${currencyTwoValue} ${currencyTwoText}`
}

const getAllCurrencys = async (currency = 'USD') => {
  const { conversion_rates } = await fetchApi(currency)
  return conversion_rates
}

const generateCurrancyOptions = async (allCurrencies, currency1 = 'USD', currency2 = 'BRL') => {
  const currencyValue = { ...await allCurrencies }
  const currencies = Object.keys(currencyValue)
  getPrecisionValues(currency1, currency2, currencyValue[currency2])

  const optionsCurrenies = currencies.map((currency) => {
    if (currency === currency1 || currency === currency2) {
      return `<option data-currency="${currency}" selected value="${currencyValue[currency]}">${currency}</option>`
    }
    return `<option data-currency="${currency}" value="${currencyValue[currency]}">${currency}</option>`
  })

  return optionsCurrenies
}

const populateSelect = async (arrOfCurrencyOptions, currency1 = 'USD', currency2 = 'BRL') => {
  const arrayCurrentOpt = await arrOfCurrencyOptions
  
  arrayCurrentOpt.forEach((optCurrency) => {
    if (optCurrency.includes(currency1)) {
      currencyOneEl.innerHTML += optCurrency
      return
    }

    if (optCurrency.includes(currency2)) {
      currencyTwoEl.innerHTML += optCurrency
      return
    }

    currencyOneEl.innerHTML += optCurrency
    currencyTwoEl.innerHTML += optCurrency
  })
}

const calculateChangedInput = currency =>
  convertedValue.textContent = (inputCurrency.value * currency).toFixed(2)

const changeSelectValueOne = async event => {
  const currencyOneText = event.target.options[event.target.selectedIndex].textContent
  const currencyOneValue = event.target.options[event.target.selectedIndex].value
  const currencyTwoText = currencyTwoEl.options[currencyTwoEl.selectedIndex].textContent
  const currencyTwoValue = currencyTwoEl.options[currencyTwoEl.selectedIndex].value
  
  calculateChangedInput(currencyOneValue)
  getAllCurrencys(currencyOneText)
  getPrecisionValues(currencyOneText, currencyTwoText, currencyTwoValue)
}

const changeSelectValueTwo = async event => {
  const currencyTwoValue = event.target.options[event.target.selectedIndex].value
  const currencyTwoText = event.target.options[event.target.selectedIndex].textContent
  const currencyOneElText = currencyOneEl.options[currencyOneEl.selectedIndex].textContent
  
  calculateChangedInput(currencyTwoValue)
  getPrecisionValues(currencyOneElText, currencyTwoText, currencyTwoValue)
}

const calculateCurrecy = event => {
  const inputValue = event.target.valueAsNumber
  const currencyTwoElValue = currencyTwoEl.options[currencyTwoEl.selectedIndex].value
  const calculate = inputValue * currencyTwoElValue
  
  if (!isNaN(calculate)) {
    convertedValue.textContent = calculate.toFixed(2)
  }
}

currencyOneEl.addEventListener('input', changeSelectValueOne)
currencyTwoEl.addEventListener('input', changeSelectValueTwo)
inputCurrency.addEventListener('input', calculateCurrecy)

const optionsCurrenies = generateCurrancyOptions(getAllCurrencys())
populateSelect(optionsCurrenies)