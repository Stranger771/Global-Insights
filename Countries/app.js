//Getting countryCode
let countryCode = location.hash.substring(1);
let title = document.title;
let searchIcon = document.querySelector(".search-icon");
let search = document.querySelector("input");
let clicked = false;
let isInside = false;
let countryArray = [];
let map;
let marker;
let filter = {
  searchText: "",
};
console.log(countryCode);
let getCountry = async (code = "") => {
  let country = await fetch(
    "https://restcountries.com/v3.1/all?fields=name,capital,flags,cca2,region,subregion,languages,currencies,area,timezones"
  );
  try {
    if (country.status === 200) {
      let rawData = await country.json();
      console.log(rawData);
      let index = rawData.findIndex((country) => country.cca2 === code);
      if (code == "") {
        return rawData;
      } else {
        let countryData = index > -1 ? rawData[index] : "Could Not Found";
        document.title = countryData.name.common;
        return countryData;
      }
    } else {
      throw new Error("Unable to Fetch");
    }
  } catch (err) {
    console.log(err);
  }
};
// getCountry(countryCode).then((countryInfo)=>{
//     console.log(countryInfo)
// }).catch((err)=>{
//     console.log(err)
// })
let getUserCountry = async () => {
  let data = await getCountry(countryCode);
  return data;
};
locationRender();
//Render
function render(data, search) {
  let filterArray = data.filter(
    (item) =>
      item.name &&
      item.name.common.toLowerCase().includes(search.searchText.toLowerCase())
  );
  document.querySelector(".newElements").innerHTML = "";
  filterArray.forEach((country) => {
    document.querySelector(".newElements").append(elementGen(country));
  });
}
function elementGen(data) {
  const countryName = document.createElement("a");
  countryName.setAttribute("href", `countries.html#${data.cca2}`);
  countryName.addEventListener("click", () => {
    search.value = "";
    location.assign(`countries.html#${data.cca2}`);
    location.reload();
  });
  countryName.innerText = data.name.common;
  return countryName;
}
searchIcon.addEventListener("click", () => {
  if (!clicked) {
    search.style.width = "130px";
    search.style.opacity = "1";
    clicked = true;
  } else {
    search.style.width = "0";
    search.style.opacity = "0";
    clicked = false;
  }
});
search.addEventListener("input", async (e) => {
  filter.searchText = e.target.value;
  document.querySelector(".newElements").style.padding = "5px";
  try {
    countryArray = await getCountry();
    render(countryArray, filter);
  } catch (err) {
    console.log(err);
  }
});
window.addEventListener("click", () => {
  if (!isInside) {
    document.querySelector(".newElements").innerHTML = "";
    document.querySelector(".newElements").style.padding = "0px";
    isInside = true;
  } else {
    isInside = false;
  }
});
// =======
const sidebar = document.querySelector(".sidebar");
const toggleBtn = document.getElementById("toggleSidebar");

toggleBtn.addEventListener("click", () => {
  sidebar.classList.toggle("active");
});

navigator.geolocation.getCurrentPosition(
  function (position) {
    const { latitude, longitude } = position.coords;
    const coords = [latitude, longitude];

    // Create the map
    map = L.map("map").setView(coords, 13);

    // Add the OpenStreetMap tile layer (your “API”)
    L.tileLayer(
      "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
      {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>',
        subdomains: "abcd",
        maxZoom: 19,
      }
    ).addTo(map);

    // Optional: Add a marker
    L.marker(coords).addTo(map).bindPopup("You are here!").openPopup();
  },
  function () {
    alert("Could not get your position");
  }
);

// =======
//==========

window.addEventListener("load", async () => {
  // Wait for map to initialize
  await new Promise((resolve) => {
    const check = setInterval(() => {
      if (map && typeof map.setView === "function") {
        clearInterval(check);
        resolve();
      }
    }, 200); // checks every 200ms
  });

  const countryData = await getUserCountry();
  if (!countryData || countryData === "Could Not Found") {
    console.log("No valid country data found for code:", countryCode);
    return;
  }

  const countryName = countryData.name.common;

  if (countryData.flags && countryData.flags.png) {
    const flagImg = document.getElementById("country-flag");
    console.log();
    if (flagImg) {
      flagImg.src = countryData.flags.png;
      flagImg.alt = `${countryName} Flag`;
      console.log("working");
    }
  }

  console.log("Showing map for:", countryName);

  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?country=${encodeURIComponent(
        countryName
      )}&format=json&limit=1`
    );
    const geoData = await response.json();

    if (geoData.length > 0) {
      const lat = parseFloat(geoData[0].lat);
      const lon = parseFloat(geoData[0].lon);

      map.setView([lat, lon], 5);

      if (marker) map.removeLayer(marker);
      const flagUrl = countryData.flags.png || countryData.flags.svg;
      const popupContent = `
  <div style="text-align:center; font-family:Arial, sans-serif;">
    <img src="${flagUrl}" alt="${countryName} Flag" width="100" style="border-radius:5px; margin-bottom:5px;">
    <h3 style="margin:0;">${countryName}</h3>
    <p id="country-summary" style="margin-top:8px; font-size:12px; color:#333;"><i>Loading brief history...</i></p>
  </div>
`;

      marker = L.marker([lat, lon])
        .addTo(map)
        .bindPopup(popupContent)
        .openPopup();

      try {
        const wikiResponse = await fetch(
          `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(
            countryName
          )}`
        );
        const wikiData = await wikiResponse.json();

        if (wikiData.extract) {
          const summary =
            wikiData.extract.length > 300
              ? wikiData.extract.substring(0, 300) + "..."
              : wikiData.extract;

          const summaryHTML = `
      <p style="margin-top:8px; font-size:12px; color:#333; text-align:left;">
        📜 <b>Brief History:</b> ${summary}
      </p>
      <a href="${wikiData.content_urls.desktop.page}" target="_blank"
         style="font-size:11px; color:#0066cc; text-decoration:none;">
         Read more on Wikipedia ↗
      </a>
    `;

          const popupNode = marker.getPopup().getElement();
          if (popupNode) {
            const summaryElement = popupNode.querySelector("#country-summary");
            if (summaryElement) summaryElement.outerHTML = summaryHTML;
          }
        }
      } catch (err) {
        console.log("Error fetching Wikipedia summary:", err);
      }
    } else {
      console.warn("No coordinates found for", countryName);
    }
  } catch (err) {
    console.log("Error locating country:", err);
  }
});
