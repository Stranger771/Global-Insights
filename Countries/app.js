//Getting countryCode
let countryCode = location.hash.substring(1)
let title = document.title;
let searchIcon = document.querySelector('.search-icon')
let search = document.querySelector('input')
let clicked = false;
let isInside = false;
let countryArray = []
let filter={
    searchText: ''
}
console.log(countryCode)
let getCountry = async(code='')=>{
    let country = await fetch('https://restcountries.com/v3.1/all')
    try{
        if(country.status===200){
            let rawData = await country.json()
            let index = rawData.findIndex((country)=> country.cca2 === code)
            if(code==''){
                return rawData
            }else{
                let countryData = index > -1 ? rawData[index] : 'Could Not Found'
                document.title = countryData.name.common
                return countryData
            }
            
        }else{
            throw new Error('Unable to Fetch')
        }
    }catch(err){
        console.log(err)
    }
}
// getCountry(countryCode).then((countryInfo)=>{
//     console.log(countryInfo)
// }).catch((err)=>{
//     console.log(err)
// })
let getUserCountry = async()=>{
    let data = await getCountry(countryCode)
    return data
}
locationRender()
//Render
function render(data, search){
    let filterArray = data.filter((item)=> item.name && item.name.common.toLowerCase().includes(search.searchText.toLowerCase()))
    document.querySelector('.newElements').innerHTML = ""
    filterArray.forEach((country)=>{
        document.querySelector('.newElements').append(elementGen(country))
    })
}
function elementGen(data){
    const countryName = document.createElement('a')
    countryName.setAttribute('href',`countries.html#${data.cca2}`)
    countryName.addEventListener('click',()=>{
        search.value = ''
        location.assign(`countries.html#${data.cca2}`)
        location.reload()
    })
    countryName.innerText = data.name.common
    return countryName
}
searchIcon.addEventListener('click',()=>{
    if(!clicked){
        search.style.width = '130px';
        search.style.opacity = '1';
        clicked = true
    }else{
        search.style.width = '0';
        search.style.opacity = '0';
        clicked = false
    }
})
search.addEventListener('input', async (e)=>{
    filter.searchText = e.target.value
    document.querySelector('.newElements').style.padding = '5px';
    try{
        countryArray = await getCountry()
        render(countryArray, filter)
    }catch(err){
        console.log(err)
    }
})
window.addEventListener('click',()=>{
    if(!isInside){
        document.querySelector('.newElements').innerHTML = ""
        document.querySelector('.newElements').style.padding = '0px';
        isInside = true
    }else{
        isInside = false
    }
})