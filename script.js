//func to get title from input field and take decision based on input
async function getTitle() {
  let title = document.querySelector("#search-input").value;
  if (title == "") {
    disp("Enter title to search!!");
  } else {
    disp(`Top matches for '${title}'<hr>`);
    let fetched_movies = await fetchData(title); //fetching movies from omdb
    searched_Arr = searchArrMaker(fetched_movies);
    cardMaker(searched_Arr, "card-container"); //making cards from searched arr
  }
  document.getElementById("search-input").value = ""; //empty the input box
}

// func to fetch data
async function fetchData(title) {
  const fet = await fetch(url + title);
  const data = await fet.json();
  return data;
}

//func returns array from fetched data
function searchArrMaker(obj) {
  let Array = []; //initializing  array to empty for new search
  if (obj.Response == "True") {
    for (item of obj.Search) {
      //obj.Search is arr of searched movies
      Array.push(item);
    }
    return Array;
  } else {
    disp(obj.Error + "<hr>");
  }
}

// func to create cards from array
function cardMaker(array, cont, message = "") {
  const container = document.getElementById(cont);
  container.innerHTML = `<div id="message2">${message}</div>`;

  for (let movieobj of array) {
    let likebtnclass = "far";
    if (cont == "card-container") {
      for (item of fav_Arr) {
        //if searched item is in fav list changing its like btn status
        if (item.imdbID == movieobj.imdbID) {
          likebtnclass = "fas";
        }
      }
    } else {
      likebtnclass = "fas";
    }

    const div = document.createElement("div"); //creating parent div
    div.setAttribute("class", "card");
    container.appendChild(div);

    div.innerHTML = `<img class = "poster" src="${movieobj.Poster}" alt="movie's poster" onerror="this.src='assets/alt_image.png'"></img> 
    <div class = "title"> Title: ${movieobj.Title}</div>
    <div class = "type">Type: ${movieobj.Type}</div>
    <div class = "year">Year: ${movieobj.Year}</div>
    
    <i class="${likebtnclass} fa-heart" id ="${movieobj.imdbID}" onclick='likeBtnLogic("${movieobj.imdbID}")'></i>`;
  }
}

//likebtn logic--changing class and updating  fav list
function likeBtnLogic(movie_id) {
  let likeBtn = document.getElementById(`${movie_id}`);
  if (likeBtn.classList.contains("far")) {
    likeBtn.classList.remove("far"); //changing button status
    likeBtn.classList.add("fas");

    for (item of searched_Arr) {
      //traversing and then adding movie to fav arr
      if (item.imdbID == movie_id) {
        fav_Arr.push(item);
      }
    }
  } else {
    likeBtn.classList.remove("fas");
    likeBtn.classList.add("far");
    fav_Arr = fav_Arr.filter((item) => item.imdbID !== movie_id); //removing movie from fav arr
  }
  cardMaker(fav_Arr, "fav-container");
  localStorage.setItem("favourite array", JSON.stringify(fav_Arr)); //storing fav arr in local storage
}

function disp(text) {
  document.getElementById("message1").innerHTML = text; //displays search result
}

//----------------------------------------------
const url = "https://www.omdbapi.com/?apikey=9166b911&s=";
let searched_Arr = [];

let fav_Arr = JSON.parse(localStorage.getItem("favourite array")); //getting array from local storage

if (fav_Arr === null || fav_Arr.length === 0) {
  fav_Arr = [];
  cardMaker(fav_Arr, "fav-container", "List is empty");
} else {
  cardMaker(fav_Arr, "fav-container");
}

const searchbtn = document
  .querySelector("#searchbtn")
  .addEventListener("click", getTitle);
