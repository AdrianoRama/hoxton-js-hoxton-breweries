const breweriesUrl = `https://api.openbrewerydb.org/breweries`

const selectStateForm = document.querySelector(`#select-state-form`)

const filterSectionEl = document.querySelector(`.filters-section`)

const filterByCityForm = document.querySelector(`#filter-by-city-form`)

const filterByType = document.querySelector(`#filter-by-type`)

const breweriesList = document.querySelector(`.breweries-list`)


const titleEl = document.querySelector(`.title`)
const searchBarEl = document.querySelector(`.search-bar`)
const breweryListWrapper = document.querySelector(`.brewery-list-wrapper`)


const state = {
  breweries: [],
  selectedState: null,
  breweryTypes: [`micro`, `regional`, `brewpub`],
  selectedBreweryType: ``,
  selectedCities: []
}

function getBreweriesToDisplay() {
    let breweriesToDisplay = state.breweries

    breweriesToDisplay= breweriesToDisplay.filter(brewery => 
        state.breweryTypes.includes(brewery.brewery_type))

        breweriesToDisplay = breweriesToDisplay.slice(0, 10)

        if(state.selectedBreweryType !== ``) {
            breweriesToDisplay = breweriesToDisplay.filter(brewery =>
                brewery.brewery_type === state.selectedBreweryType)
        }

        if(state.selectedCities.length = 0){
            breweriesToDisplay = breweriesToDisplay.filter(brewery =>
                state.selectedCities.includes(brewery.city))
        }

        breweriesToDisplay = breweriesToDisplay.slice(0, 10)

        return breweriesToDisplay
}

function fetchData() {
    return fetch(breweriesUrl).then(resp => resp.json())
}

function fetchBreweriesByState(state) {
    return fetch(`${breweriesUrl}?by_state=${state}&per_page=50`).then(resp => resp.json())
}

function listenToSelectStateForm() {
    selectStateForm.addEventListener(`submit`, function(event) {
        event.preventDefault()
        state.selectedState = selectStateForm[`select-state`].value

        fetchBreweriesByState(state.selectedState).then(function(breweries) {
            state.breweries = breweries
            render()
        })
    })
}

function renderFilterSection() {
   if(state.breweries.length !== 0){
       filterSectionEl.style.display = `block`
   }
   else {filterSectionEl.style.display = `none`
   }

   const cities = getCitiesFromBreweries(state.breweries)

   filterByCityForm.innerHTML = ``

   for(const city of cities) {

    const cityCheck = document.createElement(`input`)
    cityCheck.setAttribute(`type`, `checkbox`)
    cityCheck.setAttribute(`class`, `city-check`)
    cityCheck.setAttribute(`name`, city)
    cityCheck.setAttribute(`value`, city)
    cityCheck.setAttribute(`id`, city)

    if(state.selectedCities.includes(city)) cityCheck.checked = true
 
    const labelEl = document.createElement(`label`)
    labelEl.setAttribute(`for`, city)
    labelEl.textContent = city

    cityCheck.addEventListener(`change`, function() {
        const cityCheckboxes = document.querySelectorAll(`.city-check`)

        let selectedCities = []
    
    for (const checkbox of cityCheckboxes) {
        if (checkbox.checked) selectedCities.push(checkbox.value)
    }

    state.selectedCities = selectedCities

    render()

   })

   filterByCityForm.append(cityCheck, labelEl)
   }
}

function getCitiesFromBreweries(breweries) {
 let cities = []

 for(const brewery of breweries) {
     if(!cities.includes(brewery.city)) {
         cities.push(brewery.city)
     }
 }

 cities.sort()

 return cities
}

function getBreweryTypeOnState() {
   filterByType.addEventListener(`change`, function() {
       state.selectedBreweryType = filterByType.value 
   })
}

function renderBreweryItem(brewery) {

const liEl = document.createElement(`li`)

const h2El = document.createElement(`h2`)
h2El.textContent = brewery.name

const typeEl = document.createElement(`div`)
typeEl.setAttribute(`class`, `type`)
typeEl.textContent = brewery.brewery_type

const addressEl = document.createElement(`section`)
addressEl.setAttribute(`class`, `adress`)

const h3El = document.createElement(`h3`)
h3El.textContent = `Address:`
const adressFirstLine = document.createElement(`p`)
adressFirstLine.textContent = brewery.street

const adressSecondLine = document.createElement(`p`)
const adressSecondLineStrong = document.createElement(`strong`)
adressSecondLineStrong.textContent = `${brewery.city}, ${brewery.postal_code}`

const phoneEl = document.createElement(`section`)
phoneEl.setAttribute(`class`, `phone`)
const phoneTitle = document.createElement(`h3`)
phoneTitle.textContent = `Phone:`
const phoneNumber = document.createElement(`p`)
phoneNumber.textContent = brewery.phone

const linkEl = document.createElement(`section`)
linkEl.setAttribute(`class`, `link`)
const aEl = document.createElement(`a`)
aEl.setAttribute(`href`, `null`)
aEl.setAttribute(`target`, brewery.website_url)
aEl.textContent = `Visit Website`

liEl.append(h2El, typeEl, addressEl, phoneEl, linkEl)

addressEl.append(h3El, adressFirstLine, adressSecondLine)
adressSecondLine.append(adressSecondLineStrong)

phoneEl.append(phoneTitle, phoneNumber)

linkEl.append(aEl)

breweriesList.append(liEl)
}

function renderBreweryList() {

    if(state.breweries.length > 0) {
        titleEl.style.display = `block`
        searchBarEl.style.display = `block`
        breweryListWrapper.style.display = `block`
    }
    else {
        titleEl.style.display = `none`
        searchBarEl.style.display = `none`
        breweryListWrapper.style.display = `none`
    }

    breweriesList.innerHTML = ``

    for(const brewery of getBreweriesToDisplay()) {
        renderBreweryItem(brewery)
    }
}

function render() {
    renderFilterSection()
    getBreweryTypeOnState()
    renderBreweryList()
}

function init() {
    render()
listenToSelectStateForm()
}

init()