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
        if(data.meals.length != 1)
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
        // alert('Failed to fetch recipe. Please try again later.');
        recipeContainer.innerHTML = 'We do not have this recipe yet 😐'
        fetch('https://www.themealdb.com/api/json/v1/1/random.php')
        .then(response => response.json())
        .then(data => {
          recipeButtons.innerHTML='<h5 id="error_text">Wanna try this: </h5>'
          displayRecipeButton(data.meals[0]);
        })
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
    recipeContainer.innerHTML='';

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
    var txt = "<h3>Instructions: </h3>";
    var link = `<p><a href=${recipe.strYoutube}><button id='inst'>Click here for video tutorial</button></a></p>`
    recipeInstructions.innerHTML = txt + recipe.strInstructions + link;
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
      document.getElementById('error_text').remove();
    });
    recipeButtons.appendChild(recipeButton);
  }
