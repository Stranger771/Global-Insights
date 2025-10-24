let search = document.querySelector(".search");
let countryArray = [];
let reveal = document.querySelector("#location button");
let combineContainer = document.querySelectorAll(
  ".otherInfo, .location-container"
);
let wrapper = [];
let nextBtn = document.querySelector(".sliderBtnNext");
let backBtn = document.querySelector(".sliderBtnBack");
let width = window.screen.width;
let filter = {
  searchText: "",
};
let clock = document.querySelector(".digital-clock");
let clicked = false;
let nav = document.querySelector("#nav-bar");
//Api geolocation
let getLocation = async () => {
  let data = await fetch("https://ipinfo.io/json?token=c08de13c590287");
  if (data.status === 200) {
    let location = await data.json();
    return location;
  } else {
    throw new Error("Unable to fetch");
  }
};
getLocation()
  .then((location) => {
    console.log(location);
  })
  .catch((err) => {
    console.log(err);
  });

//Api restcountries
let getCountries = async () => {
  let data = await fetch(
    "https://restcountries.com/v3.1/all?fields=name,capital,flags,cca2,region,subregion,languages,currencies,area,timezones"
  );
  if (data.status === 200) {
    let response = await data.json();
    return response;
  } else {
    throw new Error("Unable to Fetch");
  }
};

//Getting User Country
let getUserCountry = async () => {
  let location = await getLocation();
  let country = await getCountries();
  let index = country.findIndex((country) => country.cca2 === location.country);
  console.log(country, location);
  return index > -1 ? country[index] : "Not Found";
};
getUserCountry()
  .then((location) => {
    console.log(location);
  })
  .catch((err) => {
    console.log(err);
  });
//Rendering Search

function renderSearch(country, search) {
  let filterArray = country.filter((item) => {
    return (
      item.name &&
      item.name.common.toLowerCase().includes(search.searchText.toLowerCase())
    );
  });
  console.log(filterArray);
  document.querySelector(".newElements").innerHTML = "";
  filterArray.forEach((country) => {
    document.querySelector(".newElements").append(elementGen(country));
  });
}

search.addEventListener("input", async (e) => {
  search.searchText = e.target.value;
  document.querySelector(".newElements").style.padding = "5px";
  try {
    countryArray = await getCountries();
    renderSearch(countryArray, search);
  } catch (err) {
    console.log(err);
  }
});
window.addEventListener("click", () => {
  document.querySelector(".newElements").innerHTML = "";
  document.querySelector(".newElements").style.padding = "0px";
});
document.querySelector(".search-img").addEventListener("click", () => {
  if (!clicked) {
    search.style.width = "130px";
    search.style.opacity = "1";
    clicked = true;
  } else {
    search.style.width = "0";
    search.style.opacity = "0";

    // document.querySelector('#nav-bar').style.padding = '10px 20px';
    clicked = false;
  }
  if (width <= 900 && clicked) {
    document.querySelector("#nav-bar").style.width = "200px";
  } else if (!clicked && width <= 900) {
    document.querySelector("#nav-bar").style.width = "150px";
  }
});
// getCountries()
//     .then((data) => {
//         countryArray = data;
//         console.log(countryArray)
//         renderSearch(countryArray, filter);
//     })
//     .catch((error) => {
//         console.log(error);
//  });

//Element Generation
function elementGen(data) {
  const countryName = document.createElement("a");
  countryName.setAttribute("href", `Countries/countries.html#${data.cca2}`);
  countryName.addEventListener("click", () => {
    search.value = "";
  });
  countryName.innerText = data.name.common;
  return countryName;
}

async function otherInfo() {
  document.querySelector(".otherInfo").innerHTML = "";
  let data = await getLocation();
  const city = document.createElement("p");
  const postalCode = document.createElement("p");
  const province = document.createElement("p");
  const location = document.createElement("p");
  const ip = document.createElement("p");
  city.innerHTML = `<span>City:</span> ${data.city}`;
  postalCode.innerHTML = `<span>Postal Code: </span>${data.postal}`;
  province.innerHTML = `<span>Province:</span> ${data.region}`;
  location.innerHTML = `<span>Location Co-ordinates: </span>${data.loc}`;
  ip.innerHTML = `<span>Ip address:</span> ${data.ip}`;
  let container = document.querySelector(".otherInfo");
  setTimeout(() => {
    container.append(city);
  }, 900);
  setTimeout(() => {
    container.append(postalCode);
  }, 1200);
  setTimeout(() => {
    container.append(province);
  }, 1500);
  setTimeout(() => {
    container.append(location);
  }, 1800);
  setTimeout(() => {
    container.append(ip);
  }, 2100);
}
//styling span

let introElements = document.querySelectorAll(".intro-description h1 span");
let colors = ["FF004D", "FAEF5D", "A94438"];
function repeat() {
  for (let i = 0; i < introElements.length; i++) {
    (function (index) {
      introElements[index].style.color = `#${colors[index]}`;
      setTimeout(() => {
        introElements[index].style.color = "black";
      }, 500 + index * 500);
    })(i);
  }
}

let introElements2 = document.querySelectorAll(
  ".intro-description .style-second-heading span"
);
function repeat2() {
  for (let i = 0; i < introElements2.length; i++) {
    (function (index) {
      introElements2[index].style.color = `#${colors[index]}`;
      setTimeout(() => {
        introElements2[index].style.color = "black";
      }, 500 + index * 500);
    })(i);
  }
}
setInterval(repeat, introElements.length * 500);
setInterval(repeat2, introElements2.length * 500);
//revealing information on click
reveal.addEventListener("click", (e) => {
  locationRender();
  otherInfo();
  if (width > 900) {
    combineContainer.forEach((item) => {
      item.style.opacity = "1";
      item.style.width = "350px";
      item.style.height = "500px";
    });
  } else {
    combineContainer.forEach((item) => {
      item.style.opacity = "1";
      item.style.width = "fit-content";
      item.style.height = "50vh";
    });
  }
});
//clock
function getTime() {
  let time = new Date();
  let amPm = "AM";
  let timeInfo = {
    h: time.getHours(),
    m: time.getMinutes(),
    s: time.getSeconds(),
  };
  if (timeInfo.h > 12) {
    timeInfo.h = timeInfo.h - 12;
    amPm = "PM";
  }
  clock.innerText = `${timeInfo.h}:${timeInfo.m}:${timeInfo.s} ${amPm}`;
}
setInterval(getTime, 1000);

//Image Slider For feedBack
class userFeedBack {
  constructor(name, feedBack, image) {
    this.name = name;
    this.feedBack = feedBack;
    this.image = image;
    this.container = document.querySelector(".slider");
  }
  elements() {
    const userName = document.createElement("h2");
    const userFeedBack = document.createElement("p");
    const img = document.createElement("img");
    const box = document.createElement("div");
    const descriptionContainer = document.createElement("div");
    userName.innerText = this.name;
    userFeedBack.innerText = this.feedBack;
    img.setAttribute("src", `${this.image}`);

    box.append(img);
    this.fontSize(userName);
    descriptionContainer.append(userName);
    descriptionContainer.append(userFeedBack);
    box.append(descriptionContainer);
    return box;
  }
  fontSize(element) {
    if (this.name.length > 10) {
      element.style.fontSize = "0.9rem";
    }
  }
}
let person = new userFeedBack(
  "EchoEnigma",
  "Great experience with Global Insights!",
  "Images/download3.jpg"
);
let person2 = new userFeedBack(
  "QuantumPioneer",
  "I love the informative content.",
  "Images/The hard life.jpg"
);
let person3 = new userFeedBack(
  "NovaNinja",
  "Highly recommended for travelers.",
  "Images/download (1).jpg"
);
wrapper.push(person.elements(), person2.elements(), person3.elements());
document.querySelector(".slider").append(wrapper[0]);
let index = 0;
function changeIndex() {
  if (index >= 0 && index < wrapper.length - 1) {
    index++;
  } else {
    index = 0;
  }
  document.querySelector(".slider").innerHTML = "";
  document.querySelector(".slider").append(wrapper[index]);
}
nextBtn.addEventListener("click", () => {
  changeIndex();
});
backBtn.addEventListener("click", () => {
  changeIndex();
});
//navBar
let isClicked = false;
document.querySelector(".toggleButton").addEventListener("click", (e) => {
  if (!isClicked) {
    document.querySelector(".toggleButton").style.transform = "rotateY(180deg)";
    document.querySelector("#nav-bar").style.width = "150px";
    document.querySelector("#nav-bar").style.padding = "10px 20px";
    isClicked = true;
  } else {
    document.querySelector("#nav-bar").style.width = "0px";
    document.querySelector("#nav-bar").style.padding = "0px 0px";
    document.querySelector(".toggleButton").style.transform = "rotateY(0)";
    search.style.width = "0";
    search.style.opacity = "0";
    clicked = false;
    isClicked = false;
  }
});
//notification
document.querySelector("#notification button").addEventListener("click", () => {
  document.querySelector("#notification").remove();
});

//animation
window.addEventListener("scroll", (e) => {
  if (scrollY > 250) {
    document.querySelector("#cipher").classList.add("onScroll");
  }
  if (scrollY > 700) {
    document.querySelector("#location").classList.add("onScroll");
  }
});

let links = document.querySelectorAll(".bar-container ul li a");

links.forEach((link) => {
  let targetId = link.getAttribute("href").substring(1);
  const targertEle = document.getElementById(targetId);
  console.log(targertEle);
  link.addEventListener("click", (e) => {
    e.preventDefault();
    if (targertEle) {
      targertEle.scrollIntoView({ behavior: "smooth" });
    }
  });
});

//Sticky nav
const header = document.querySelector("#intro");
const headerCallback = function (entries) {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) {
      nav.classList.add("sticky");
    } else {
      nav.classList.remove("sticky");
    }
  });
};

const headerObserver = new IntersectionObserver(headerCallback, {
  root: null,
  threshold: 0,
  rootMargin: "-90px",
});
headerObserver.observe(header);

//REVEALING
const allSections = document.querySelectorAll(".section");
const revealSection = function (entries, observer) {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.remove("section--hidden");
      observer.unobserve(entry.target);
    }
  });
};
const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
});
allSections.forEach((section) => {
  section.classList.add("section--hidden");
  sectionObserver.observe(section);
});
