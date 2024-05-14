function searchRecipe() {
    const searchQuery = document.getElementById('searchInput').value.trim();
    if (searchQuery === '') {
      alert('Please enter a recipe name');
      return;
    }

    fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${searchQuery}`)
      .then(response => response.json())
      .then(data => {
        console.log(data.meals.length);
        recipeContainer.innerHTML = '';
        recipeButtons.innerHTML = '';
        if(data.meals.length > 1)
        {
          for(var i = 0;i<data.meals.length; i++)
          {
            displayRecipeButton(data.meals[i]);
          }
        }
        else{
          displayRecipe(data.meals[0]);
        }
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        alert('Failed to fetch recipe. Please try again later.');
      });
  }

  function getRandomRecipe() {
    recipeContainer.innerHTML = '';
    recipeButtons.innerHTML = '';
    fetch('https://www.themealdb.com/api/json/v1/1/random.php')
      .then(response => response.json())
      .then(data => {
        displayRecipe(data.meals[0]);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        alert('Failed to fetch random recipe. Please try again later.');
      });
  }

  function displayRecipe(recipe) {
    const recipeContainer = document.getElementById('recipeContainer');

    if (!recipe) {
      recipeContainer.innerHTML = '<p>No recipe found.</p>';
      return;
    }

    const recipeTitle = document.createElement('h2');
    recipeTitle.textContent = recipe.strMeal;
    recipeContainer.appendChild(recipeTitle);

    const recipeImage = document.createElement('img');
    recipeImage.src = `${recipe.strMealThumb}/preview`;
    recipeImage.alt = recipe.strMeal;
    recipeContainer.appendChild(recipeImage);

    const ingredientsList = document.createElement('ul');
    for (let i = 1; i <= 20; i++) {
      const ingredient = recipe[`strIngredient${i}`];
      const measure = recipe[`strMeasure${i}`];
      if (ingredient) {
        const listItem = document.createElement('li');
        listItem.textContent = `${ingredient} - ${measure}`;
        ingredientsList.appendChild(listItem);
      }
    }
    const recipeInstructions = document.createElement('p');
    recipeInstructions.innerHTML = recipe.strInstructions;

    recipeContainer.appendChild(ingredientsList);
    recipeContainer.appendChild(recipeInstructions);
  }
  function displayRecipeButton(recipe){
    const recipeButtons = document.getElementById("recipeButtons");
    const recipeButton = document.createElement('button');
    recipeButton.textContent = recipe.strMeal;
    recipeButton.addEventListener('click',function(){
      displayRecipe(recipe);
      recipeButton.remove();
    });
    recipeButtons.appendChild(recipeButton);
  }
