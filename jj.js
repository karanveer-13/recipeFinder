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

  // Clear old buttons but keep shown recipes
  recipeButtons.innerHTML = "";
  document.getElementById("erm")?.remove();

  fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${searchQuery}`)
    .then((response) => response.json())
    .then((data) => {
      if (!data.meals) {
        const errMsg = document.createElement("p");
        errMsg.id = "erm";
        errMsg.textContent = "We do not have this recipe yet 😐";
        recipeContainer.appendChild(errMsg);

        fetch("https://www.themealdb.com/api/json/v1/1/random.php")
          .then((res) => res.json())
          .then((randomData) => {
            const errLabel = document.createElement("h5");
            errLabel.id = "error_text";
            errLabel.textContent = "Wanna try this:";
            recipeButtons.appendChild(errLabel);
            displayRecipeButton(randomData.meals[0]);
          });

        return;
      }

      if (data.meals.length !== 1) {
        const suggestionLabel = document.createElement("h5");
        suggestionLabel.textContent = "Choose a recipe:";
        recipeButtons.appendChild(suggestionLabel);

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

  const recipeCard = document.createElement("div");
  recipeCard.className = "recipeCard";

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

  recipeCard.appendChild(recipeTitle);
  recipeCard.appendChild(recipeImage);
  recipeCard.appendChild(ingredientsList);
  recipeCard.appendChild(recipeInstructions);

  recipeContainer.appendChild(recipeCard);
}

function displayRecipeButton(recipe) {
  const recipeButtons = document.getElementById("recipeButtons");
  const recipeButton = document.createElement("button");
  recipeButton.textContent = recipe.strMeal;
  recipeButton.addEventListener("click", function () {
    displayRecipe(recipe);
  });
  recipeButtons.appendChild(recipeButton);
}
