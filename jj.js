document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("searchInput").addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      searchRecipe();
    }
  });
});

function searchRecipe() {
  const searchQuery = document.getElementById("searchInput").value.trim();
  const recipeContainer = document.getElementById("recipeContainer");
  const recipeButtons = document.getElementById("recipeButtons");

  if (searchQuery === "") {
    alert("Please enter a recipe name");
    return;
  }

  recipeContainer.innerHTML = "";
  recipeButtons.innerHTML = "";
  recipeContainer.style.display = "none";

  fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${searchQuery}`)
    .then((response) => response.json())
    .then((data) => {
      if (!data.meals) {
        recipeContainer.innerHTML = '<p id="erm">We do not have this recipe yet 😐</p>';
        recipeContainer.style.display = "block";

        fetch("https://www.themealdb.com/api/json/v1/1/random.php")
          .then((res) => res.json())
          .then((randomData) => {
            recipeButtons.innerHTML = '<h5 id="error_text">Wanna try this: </h5>';
            displayRecipeButton(randomData.meals[0]);
          });
        return;
      }

      if (data.meals.length !== 1) {
        data.meals.forEach((meal) => displayRecipeButton(meal));
      } else {
        displayRecipe(data.meals[0]);
      }
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
      alert("Something went wrong. Try again later.");
    });
}

function getRandomRecipe() {
  const recipeContainer = document.getElementById("recipeContainer");
  const recipeButtons = document.getElementById("recipeButtons");

  recipeContainer.innerHTML = "";
  recipeButtons.innerHTML = "";
  recipeContainer.style.display = "none";

  fetch("https://www.themealdb.com/api/json/v1/1/random.php")
    .then((response) => response.json())
    .then((data) => {
      displayRecipe(data.meals[0]);
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
      alert("Failed to fetch random recipe. Please try again later.");
    });
}

function displayRecipe(recipe) {
  const recipeContainer = document.getElementById("recipeContainer");
  recipeContainer.style.display = "block";
  recipeContainer.innerHTML = "";

  if (!recipe) {
    recipeContainer.innerHTML = "<p>No recipe found.</p>";
    return;
  }

  const recipeTitle = document.createElement("h2");
  recipeTitle.textContent = recipe.strMeal;

  const recipeImage = document.createElement("img");
  recipeImage.src = `${recipe.strMealThumb}/preview`;
  recipeImage.alt = recipe.strMeal;

  const ingredientsList = document.createElement("ul");
  for (let i = 1; i <= 20; i++) {
    const ingredient = recipe[`strIngredient${i}`];
    const measure = recipe[`strMeasure${i}`];
    if (ingredient && ingredient.trim() !== "") {
      const listItem = document.createElement("li");
      listItem.textContent = `${ingredient} - ${measure}`;
      ingredientsList.appendChild(listItem);
    }
  }

  const recipeInstructions = document.createElement("p");
  recipeInstructions.innerHTML = `<h3>Instructions:</h3>${recipe.strInstructions}<br><br>
    <a href="${recipe.strYoutube}" target="_blank"><button id="inst">Click here for video tutorial</button></a>`;

  recipeContainer.appendChild(recipeTitle);
  recipeContainer.appendChild(recipeImage);
  recipeContainer.appendChild(ingredientsList);
  recipeContainer.appendChild(recipeInstructions);
}

function displayRecipeButton(recipe) {
  const recipeButtons = document.getElementById("recipeButtons");
  const recipeButton = document.createElement("button");
  recipeButton.textContent = recipe.strMeal;
  recipeButton.addEventListener("click", function () {
    displayRecipe(recipe);
    recipeButton.remove();
    const errText = document.getElementById("error_text");
    if (errText) errText.remove();
  });
  recipeButtons.appendChild(recipeButton);
}
