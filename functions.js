let locationRender = async ()=>{
    document.querySelector('.location-container').innerHTML = ''
    try{
        let data = await getUserCountry()
        console.log(data.name.common)
        let container = document.querySelector('.location-container')
        // const border = document.createElement('div')
        const countryName = document.createElement('p')
        const countryCode = document.createElement('p')
        const region = document.createElement('p')
        const currency = document.createElement('p')
        const timeZone = document.createElement('p')
        const capital = document.createElement('p')
        const langContainer = document.createElement('ul')
        countryName.innerHTML = `<span>Country Name:</span> ${data.name.common}`
        
        // border.classList.add('border')

        // container.append(border)

        countryCode.innerHTML = `<span>Country Code:</span> ${data.cca2}`
   
        region.innerHTML = `<span>Region:</span> ${data.region}`
        
        langContainer.innerHTML = '<span>Language: </span>'
        langContainer.style.width = '100px'
        langContainer.style.padding = '40px'
        const languageObject = data.languages;

        Object.keys(languageObject).forEach((key) => {
            const value = languageObject[key];
            console.log(`${key}: ${value}`);
            const language = document.createElement('li')
            language.innerText = value
            language.style.listStyle = 'disc'
            langContainer.append(language)
        });
        

        let currencies = data.currencies
        currency.innerHTML = `<span>Curreny: </span>${Object.values(currencies)[0].name.toUpperCase()}, <span>Symbol:</span> ${Object.values(currencies)[0].symbol}`
       

        timeZone.innerHTML = `<span>Time Zone: </span>${data.timezones[0]}`
        
        capital.innerHTML = `<span>Capital:</span> ${data.capital[0]}`
        
            setTimeout(()=>{
                container.append(countryName)
            }, 300)
            setTimeout(()=>{
                container.append(countryCode)
            }, 500)
            setTimeout(()=>{
                container.append(capital)
            }, 700)
            setTimeout(()=>{
                container.append(langContainer)
            }, 900)
            setTimeout(()=>{
                container.append(currency)
            }, 1100)
            setTimeout(()=>{
                container.append(timeZone)
            }, 1300)
            setTimeout(()=>{
                container.append(region)
            }, 1500)


    }catch(err){
        console.log(err)
    }
}
