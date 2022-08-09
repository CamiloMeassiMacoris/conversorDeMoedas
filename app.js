const currencyOneEL = document.querySelector('[data-js="currency-one"]')
const currencyTwoEL = document.querySelector('[data-js="currency-two"]')
const currenciesEL = document.querySelector('[data-js="currency-container"]')
const convertedValueEl = document.querySelector('[data-js="converted-value"]')
const valuePrecisionEl =
  document.querySelector('[data-js="conversion-precision"]')
const timesCurrencyOneEl =
  document.querySelector('[data-js="currency-one-times"]')

const showAlert = err => {
  const divAlert = document.createElement('div')
    divAlert.textContent = err.message
    divAlert.classList.add('alert', 'alert-warning', 'alert-dismissible', 'fade', 'show')
    divAlert.setAttribute('role', 'alert')

    const button = document.createElement('button')
    button.classList.add('btn-close')
    button.setAttribute('type', 'button')
    button.setAttribute('aria-label', 'Close')
    
    const removeAlert = () => divAlert.remove() 
    button.addEventListener('click', removeAlert)
    
    divAlert.append(button)
    currenciesEL.insertAdjacentElement('afterend', divAlert)    
}

const state = (()=> {
  let exchangerate = {}
  return {
    getExchangeRate : () => exchangerate,
    setExchangeRate : newExchangerate => {
      if (!newExchangerate.conversion_rates) {
        showAlert({ 
          message:'o objeto precisa ter uma propriedade conversion_rates' 
        })
        return
      }

      exchangerate = newExchangerate
      return exchangerate
    }
  }
})()

const APIKey = `01ec3b20673ff8304a2bdbed`
let getUrl = currency => 
  `https://v6.exchangerate-api.com/v6/${APIKey}/latest/${currency}`

const getErrorMessage = errorType => ({
  'unsupported-code': 'se não for compatível com o código de moeda fornecido (consulte as moedas suportadas...)',
  'malformed-request': 'quando alguma parte da sua solicitação não segue a estrutura mostrada acima',
  'chave inválida': 'quando sua chave de API não é válida',
  'conta inativa': 'se seu endereço de e-mail não foi confirmado',
  'cota atingida': 'quando sua conta atingiu o número de solicitações permitidas pelo seu plano'
})[errorType] || 'Não foi possível obter as informações.'

const fetchExchandeRate = async url => {
  try{
    const response = await fetch(url)

    if (!response.ok) {
      throw new Error('Sua conexão falhou. Não foi possível obeter as informações.')
    }

    const exchangeRateDate = await response.json()

    if (exchangeRateDate.result === 'error') {
      const errorMessage = getErrorMessage(exchangeRateDate['error-type'])
      throw new Error(errorMessage)
    }

    return state.setExchangeRate(exchangeRateDate)
  }catch(err){
    showAlert(err)
  }
}

const getMultpliedExchangeRate = conversion_rates => {
  return (timesCurrencyOneEl.value * conversion_rates[currencyTwoEL.value]).toFixed(2)
}

const getNotRoundedExchangeRate = conversion_rates => {
  const currencyTwo = conversion_rates[currencyTwoEL.value]
  return  `1 ${currencyOneEL.value} = ${1 * currencyTwo} ${currencyTwoEL.value}`
}

const showUpdatedRates = ({ conversion_rates }) => {
  convertedValueEl.textContent = getMultpliedExchangeRate(conversion_rates)
  valuePrecisionEl.textContent = getNotRoundedExchangeRate(conversion_rates)
}

const getOptions = (selectedCurrency, conversion_rates) => {
  const setSelectedAttribute = currency =>
    currency === selectedCurrency ? 'selected' : ' '
  const getOptionsAsArray = currency => 
    `<option ${setSelectedAttribute(currency)}>${currency}</option>`

  return Object.keys(conversion_rates)
  .map(getOptionsAsArray)
  .join(' ')
}

const showInitialInfo = ({ conversion_rates }) => {
  currencyOneEL.innerHTML = getOptions('USD', conversion_rates)
  currencyTwoEL.innerHTML = getOptions('BRL', conversion_rates)

  showUpdatedRates({ conversion_rates })
}

const init = async () => {
  const url = getUrl('USD')
  const exchangeRate = await fetchExchandeRate(url)

  if (exchangeRate && exchangeRate.conversion_rates) {
    showInitialInfo(exchangeRate)
  }
}

const handleTimesCurrencyOneElInput = e => {
  const { conversion_rates } = state.getExchangeRate()
  convertedValueEl.textContent =  getMultpliedExchangeRate(conversion_rates)
}

const handleCurrencyTwoElInput = () => {
  const exchangeRate = state.getExchangeRate()
  showUpdatedRates(exchangeRate)
}

const handleCurrencyOneElInput =  async e => {
  const url = getUrl(e.target.value)
  const exchangeRate = await fetchExchandeRate(url)

  showUpdatedRates(exchangeRate)
}

timesCurrencyOneEl.addEventListener('input', handleTimesCurrencyOneElInput)
currencyOneEL.addEventListener('input', handleCurrencyOneElInput)
currencyTwoEL.addEventListener('input', handleCurrencyTwoElInput)

init()
