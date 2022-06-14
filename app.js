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

let getCurrencyOne, 
 getCurrencyTwo, 
 selectedCurrencyOne,
 selectedCurrencyTwo

const getAllCurrencys = async (pattern1 = 'USD', patter2 = 'BRL') => {
  const {conversion_rates} = await fetchApi(url)
  const allCurrencys = Object.entries(conversion_rates)
  getCurrencyOne = allCurrencys.find(element => element.includes(pattern1))
  getCurrencyTwo = allCurrencys.find(element => element.includes(patter2))
  const currencys = allCurrencys.map((currency) => {   
    if (currency.includes(pattern1)) {
      selectedCurrencyOne = `<option selected value="${currency}">${currency[0]}</option>`
    } else if (currency.includes(patter2)) {
      selectedCurrencyTwo = `<option selected value="${currency}">${currency[0]}</option>`
    } 
    return `<option value="${currency}">${currency[0]}</option>`
  })
  const populateSelect = currencys.forEach((optCurrency) => {
      currencyOne.innerHTML += optCurrency.includes(pattern1) ? selectedCurrencyOne : optCurrency
      currencyTwo.innerHTML += optCurrency.includes(patter2) ? selectedCurrencyTwo : optCurrency
  })
  presionValue.textContent = `${getCurrencyOne[1]} ${getCurrencyOne[0]} = ${getCurrencyTwo[1]} ${getCurrencyTwo[0]}`
}

currencyOne.addEventListener('input', async event => {
  const selectCurrencyOneValue = event.target.value.split(',')[0]
  url = `https://v6.exchangerate-api.com/v6/${APIKey}/latest/${selectCurrencyOneValue}`
  await getAllCurrencys(selectCurrencyOneValue)
  })

currencyTwo.addEventListener('input', async event => {
  const selectCurrencyTwoValue = event.target.value.split(',')[0]
  await getAllCurrencys(currencyOne.value.split(',')[0], selectCurrencyTwoValue)
})

inputCurrency.addEventListener('input', event => {
  const inputValue = event.target.valueAsNumber
  const calculate = inputValue * getCurrencyTwo[1]
  if (!isNaN(calculate)) {
    convertedValue.textContent = calculate.toFixed(2)
  }  
})

getAllCurrencys() 
