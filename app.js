// Movie List
const movieList = JSON.parse(localStorage.getItem("movies")) || [];

console.log(movieList);

const formWrapper = document.getElementById("form-wrapper");

// GENERATE ID
const generateId = () => {
  return Math.floor(Math.random() * 900000) + 100000;
};

// HIDE ERROR
const hideError = () => {
  const errorWrapper = document.querySelector("#error");
  errorWrapper.style.display = "none";
};

// DISPLAY ERROR
const displayError = (errorMessage) => {
  const errorWrapper = document.querySelector("#error");
  const errorParagraph = document.querySelector("#errorParagraph");
  errorWrapper.style.display = "block";
  errorParagraph.innerHTML = errorMessage;
};

// DISPLAY MOVIES
const displayMovies = (filteredMovies = null) => {
  const moviesWrapper = document.querySelector("#bottom-section-wrapper");

  const nomovie = document.getElementById("nomovie");

  let moviesHTML = "";

  const star = `<img src="images/star.png" width="25px" alt="" />`;

  const moviesToDisplay = filteredMovies ? filteredMovies : movieList;

  moviesToDisplay.forEach((movie) => {
    moviesHTML += `<div class="each-movie-wrapper">
        <div class="each-movie-left">
          <h2>${movie.movieName}</h2>
          <div class="star-rating-wrapper">
            ${star.repeat(movie.rating)}
          </div>
        </div>
        <div class="each-movie-right">
          <div class="each-movie-right-top">
            <div onclick="updateMovie('${movie.id}', '${movie.movieName}', '${
      movie.movieGenre
    }', '${movie.duration}', '${movie.rating}')">
              <img src="images/edit.png" width="20px" alt="" />
            </div>
            <div onclick="handleDeleteMovie('${movie.id}')">
              <img src="images/delete.png" width="13px" alt="" />
            </div>
            <p>${movie.duration}</p>
          </div>
          <div class="each-movie-right-bottom">${movie.movieGenre}</div>
        </div>
      </div>`;
  });

  moviesWrapper.innerHTML = moviesHTML;

  if (moviesToDisplay.length === 0) {
    nomovie.style.display = "block";
  } else {
    nomovie.style.display = "none";
  }
};

displayMovies();

// SEARCH FUNCTION
const searchMovies = (searchQuery) => {
  const filteredMovies = movieList.filter((movie) =>
    movie.movieName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return filteredMovies;
};

const searchInput = document.getElementById("search");
searchInput.addEventListener("input", () => {
  //   searchMovies(searchInput.value.trim());

  displayMovies(searchMovies(searchInput.value.trim()));
});

// FILTER GENRE
const genreSelected = document.querySelector("#select-movie");

let selectedGenre = "";

genreSelected.addEventListener("change", () => {
  selectedGenre = genreSelected.value;

  const filteredMovies = selectedGenre
    ? movieList.filter((movie) => movie.movieGenre === selectedGenre)
    : movieList;

  displayMovies(filteredMovies);
});

// DELETE MOVIE
const handleDeleteMovie = (movieId) => {
  const index = movieList.findIndex((movie) => movie.id == movieId);

  console.log(index);

  if (index === -1) {
    return;
  }

  movieList.splice(index, 1);

  localStorage.setItem("movies", JSON.stringify(movieList));
  displayMovies();
};

// UPDATE/EDIT MOVIE

let editMode = null;
let selectedMovieId = null;

// POPULATE INPUTS WITH MOVIE DETAILS
const populateMovieInputs = (movieName, movieGenre, duration, rating) => {
  document.getElementById("movie_name").value = movieName;
  document.getElementById("movie_genre").value = movieGenre;
  document.getElementById("rating").value = rating;
  document.getElementById("duration").value = duration;
};

// EMPTY INPUTS
const emptyInputs = () => {
  document.getElementById("movie_name").value = "";
  document.getElementById("movie_genre").value = "";
  document.getElementById("rating").value = "";
  document.getElementById("duration").value = "";
};

const updateMovie = (movieId, movieName, movieGenre, duration, rating) => {
  const index = movieList.findIndex((movie) => movie.id == movieId);

  console.log(index);

  editMode = true;
  selectedMovieId = movieId;

  populateMovieInputs(movieName, movieGenre, duration, rating);
};

formWrapper.addEventListener("submit", function (e) {
  e.preventDefault();

  const movieName = document.getElementById("movie_name").value;
  const movieGenre = document.getElementById("movie_genre").value;
  const rating = document.getElementById("rating").value;
  const duration = document.getElementById("duration").value;

  console.log(movieGenre, movieName, duration, rating);

  // VALIDATE FORM

  const validateForm = () => {
    // CHECK IF THERE ARE EMPTY INPUTS
    if (!movieGenre || !movieName || !duration || !rating) {
      displayError("All fields are required!");
      return false;
    }

    if (rating > 5 || rating < 1) {
      displayError("Rating must be between 1 and 5");
      return false;
    }

    const durationRegEx = /^\d+[hm]$/i;

    if (!durationRegEx.test(duration)) {
      displayError("Duration must be of format 2h or 120m!");
      return false;
    }

    hideError();

    return true;
  };

  if (validateForm()) {
    const newMovie = {
      movieName,
      movieGenre,
      duration,
      rating,
      id: generateId(),
    };

    if (editMode) {
      // UPDATE MOVIE
      const index = movieList.findIndex((movie) => movie.id == selectedMovieId);

      movieList[index] = newMovie;
    } else {
      // CREATE NEW MOVIE
      movieList.push(newMovie);
    }

    localStorage.setItem("movies", JSON.stringify(movieList));

    displayMovies();
    
    emptyInputs();

    console.log(movieList);
  }
});
