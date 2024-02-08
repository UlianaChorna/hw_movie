document.addEventListener("DOMContentLoaded", () => {
  const rootElement = document.getElementById("root");

  let movies = JSON.parse(localStorage.getItem("movies")) || [...initialFilms];
  const initialMovies = [...movies];

  const renderMovie = (movie) => {
    const movieElement = document.createElement("ul");
    movieElement.className = "list-group";
    movieElement.innerHTML = `
            <li class="list-group-item d-flex justify-content-between align-items-center">
            <p class="movie-title" data-id="${movie.id}">${movie.title}</p>
            <button class="edit-btn badge bg-secondary badge bg-primary rounded-pill" data-id="${movie.id}">Edit</button>
            </li>
        `;
    return movieElement;
  };

  const renderMovieList = () => {
    const movieListElement = document.createElement("div");
    initialMovies.forEach((movie) => {
      const movieElement = renderMovie(movie);
      movieElement
        .querySelector(".movie-title")
        .addEventListener("click", () => {
          renderMovieList();
          renderMovieDetails(movie.id);
          window.history.pushState(null, "", `?id=${movie.id}#preview`);
        });
      movieListElement.appendChild(movieElement);
    });

    const addMovieButton = document.createElement("button");
    addMovieButton.innerText = "add movie";
    addMovieButton.style = "margin-top:40px";
    addMovieButton.className =
      "badge bg-secondary badge bg-primary rounded-pill";
    addMovieButton.addEventListener("click", () => {
      window.history.pushState(null, "", window.location.pathname + "#add");
      renderMovieList();
      addMovieForm();
    });

    movieListElement.appendChild(addMovieButton);
    rootElement.innerHTML = "";

    rootElement.appendChild(movieListElement);
  };

  renderMovieList(movies);

  document.addEventListener("click", (event) => {
    const target = event.target;
    if (target.classList.contains("edit-btn")) {
      renderMovieList();
      const movieId = target.dataset.id;
      const targetMovie = movies.find((m) => m.id == movieId);
      renderEditMovieForm(targetMovie);
      window.history.pushState(null, "", `?id=${movieId}#edit`);
    }
  });

  const renderMovieDetails = (movieId) => {
    const movie = movies.find((m) => m.id === movieId);
    if (movie) {
      renderMoviePreview(movie);
    } else {
      rootElement.innerHTML = "<p>Film with this ID does not exist.</p>";
    }
  };

  const renderEditMovieForm = (movie) => {
    const formElement = document.createElement("form");
    formElement.innerHTML = `
      <div class="input-group input-group-sm mb-3" style="margin-top:60px">
        <span class="input-group-text" id="inputGroup-sizing-sm">Title </span>
        <input type="text" id="title" class="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-sm" value="${movie.title}">
      </div>
      <div class="input-group input-group-sm mb-3">
        <span class="input-group-text" id="inputGroup-sizing-sm">Category </span>
        <input type="text" id="category" class="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-sm" value="${movie.category}">
      </div>
      <div class="input-group input-group-sm mb-3">
        <span class="input-group-text" id="inputGroup-sizing-sm">Image</span>
        <input type="text" id="image" class="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-sm" value="${movie.imageUrl}">
      </div>
      <div class="input-group input-group-sm mb-3">
        <span class="input-group-text" id="inputGroup-sizing-sm">Description</span>
        <input type="text" id="description" class="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-sm" value="${movie.description}">
      </div>
      <button class="badge bg-secondary badge bg-primary rounded-pill" id="btn-save">Save</button>
      <button class="badge bg-secondary badge bg-primary rounded-pill" id="btn-cancel">Cancel</button>
    `;

    formElement.addEventListener("click", (event) => {
      const target = event.target;
      if (target.id === "btn-save") {
        const updatedMovie = {
          id: movie.id,
          title: formElement.querySelector("#title").value,
          category: formElement.querySelector("#category").value,
          imageUrl: formElement.querySelector("#image").value,
          description: formElement.querySelector("#description").value,
        };
        window.history.pushState(null, "", `?id=${updatedMovie.id}#preview`);

        const index = movies.findIndex((m) => m.id === movie.id);
        movies[index] = updatedMovie;
        renderMoviePreview(updatedMovie);
        handleNavigation();
      } else if (target.id === "btn-cancel") {
        window.history.back();
        handleNavigation();
        formElement.remove();
      }
    });

    rootElement.appendChild(formElement);
  };

  const addMovieForm = () => {
    // window.history.pushState(null, "", window.location.pathname + '#add');
    const formElement = document.createElement("form");
    formElement.innerHTML = `
        <div class="input-group input-group-sm mb-3" style="margin-top:60px">
            <span class="input-group-text" id="inputGroup-sizing-sm">Title </span>
            <input type="text" id="title" class="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-sm">
        </div>
        <div class="input-group input-group-sm mb-3">
            <span class="input-group-text" id="inputGroup-sizing-sm">Category </span>
            <input type="text" id="category" class="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-sm">
        </div>
        <div class="input-group input-group-sm mb-3">
            <span class="input-group-text" id="inputGroup-sizing-sm">Image</span>
            <input type="text" id="image" class="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-sm" >
        </div>
        <div class="input-group input-group-sm mb-3">
            <span class="input-group-text" id="inputGroup-sizing-sm">Description</span>
            <input type="text" id="description" class="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-sm">
        </div>
        <button class="badge bg-secondary badge bg-primary rounded-pill" id="btn-save">Save</button>
        <button class="badge bg-secondary badge bg-primary rounded-pill" id="btn-cancel">Cancel</button>
        `;

    formElement.addEventListener("click", (event) => {
      const target = event.target;

      if (target.id === "btn-save") {
        const newMovie = {
          id: Date.now().toString(),
          title: formElement.querySelector("#title").value,
          category: formElement.querySelector("#category").value,
          imageUrl: formElement.querySelector("#image").value,
          description: formElement.querySelector("#description").value,
        };

        window.history.pushState(null, "", `?id=${newMovie.id}#preview`);
        movies.push(newMovie);
        clearInput();
        renderMovieList(movies);
        localStorage.setItem("movies", JSON.stringify(movies));
        renderMoviePreview(newMovie);
      } else if (target.id === "btn-cancel") {
        window.location.hash = "";
        formElement.innerHTML = "";
        renderMovieList();
      }
    });

    const clearInput = () => {
      formElement.querySelector("#title").value = " ";
      formElement.querySelector("#category").value = "";
      formElement.querySelector("#image").value = "";
      formElement.querySelector("#description").value = "";
    };

    rootElement.appendChild(formElement);
  };

  const renderMoviePreview = (movie) => {
    const previewElement = document.createElement("div");
    previewElement.innerHTML = `
        <h2>Title:${movie.title}</h2>
        <p>Category: ${movie.category}</p>
        <img src="${movie.imageUrl}" alt="${movie.title}" style="width:200px; height:300px">
        <p>Description:${movie.description}</p>
    `;

    rootElement.appendChild(previewElement);
  };

  const handleNavigation = () => {

    const params = new URLSearchParams(window.location.search);
    const movieId = params.get("id");
    const hash = window.location.hash;

    if (movieId) {
      renderMovieList();
      renderMovieDetails(movieId);
    } else if (hash === "#add") {
      console.log("Add movie page");
      renderMovieList();
      addMovieForm();
    } else if (hash === "#edit") {
      console.log("Edit movie page");
      const movieId = params.get("id");
      if (movieId) {
        renderMovieList();
        const targetMovie = movies.find((m) => m.id == movieId);
        if (targetMovie) {
          renderEditMovieForm(targetMovie);
        } else {
          console.log("Movie not found");
        }
      } else {
        console.log("Movie ID not provided");
      }
    } else {
      console.log("Default page");
      renderMovieList();
    }
  };

  window.addEventListener("popstate", handleNavigation);
  window.addEventListener("hashchange", handleNavigation);

  window.addEventListener("popstate", () => renderMovieList(movies));
  window.addEventListener("beforeunload", () => {
    localStorage.setItem("movies", JSON.stringify(movies));
  });

  handleNavigation();
});
