// script.js
document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('search-input');
    const searchButton = document.getElementById('search-button');
    const randomButton = document.getElementById('random-button');
    const recipeContainer = document.getElementById('recipe-container');
    const errorMessage = document.getElementById('error-message');
    const favoritesButton = document.getElementById('favorites-button');
    const favoritesContainer = document.getElementById('favorites-container');
    const favoritesList = document.getElementById('favorites-list');

    searchButton.addEventListener('click', () => searchMeal(searchInput.value));
    randomButton.addEventListener('click', getRandomMeal);
    favoritesButton.addEventListener('click', displayFavorites);

    function searchMeal(mealName) {
        fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${mealName}`)
            .then(response => response.json())
            .then(data => displayMeals(data.meals))
            .catch(error => {
                console.error('Error fetching data:', error);
                errorMessage.textContent = 'An error occurred while fetching data.';
                recipeContainer.innerHTML = '';
            });
    }

    function getRandomMeal() {
        fetch(`https://www.themealdb.com/api/json/v1/1/random.php`)
            .then(response => response.json())
            .then(data => displayMeals(data.meals))
            .catch(error => {
                console.error('Error fetching random data:', error);
                errorMessage.textContent = 'An error occurred while fetching random meal.';
                recipeContainer.innerHTML = '';
            });
    }

    function displayMeals(meals, container = recipeContainer) {
        if (container === recipeContainer) {
            recipeContainer.innerHTML = '';
        }
        meals.forEach(meal => {
            const recipeCard = document.createElement('div');
            recipeCard.classList.add('recipe-card');

            const recipeImage = document.createElement('img');
            recipeImage.src = meal.strMealThumb;
            recipeImage.alt = meal.strMeal;
            recipeImage.classList.add('recipe-image');

            const recipeDetails = document.createElement('div');
            recipeDetails.classList.add('recipe-details');

            const recipeTitle = document.createElement('h2');
            recipeTitle.classList.add('recipe-title');
            recipeTitle.textContent = meal.strMeal;

            const recipeCategory = document.createElement('p');
            recipeCategory.classList.add('recipe-category');
            recipeCategory.textContent = `Category: ${meal.strCategory}`;

            const recipeCountry = document.createElement('p');
            recipeCountry.classList.add('recipe-country');
            recipeCountry.textContent = `Country: ${meal.strArea}`;

            const recipeIngredients = document.createElement('ul');
            recipeIngredients.classList.add('recipe-ingredients');
            for (let i = 1; i <= 20; i++) {
                const ingredient = meal[`strIngredient${i}`];
                const measure = meal[`strMeasure${i}`];
                if (ingredient && ingredient.trim() !== '') {
                    const listItem = document.createElement('li');
                    listItem.textContent = `${measure ? measure + ' ' : ''}${ingredient}`;
                    recipeIngredients.appendChild(listItem);
                }
            }

            const recipeInstructions = document.createElement('p');
            recipeInstructions.classList.add('recipe-instructions');
            recipeInstructions.textContent = meal.strInstructions;

            const favoriteButton = document.createElement('button');
            favoriteButton.classList.add('favorite-button');
            favoriteButton.textContent = 'Add to Favorites';
            favoriteButton.addEventListener('click', () => addToFavorites(meal.idMeal));

            recipeDetails.appendChild(recipeTitle);
            recipeDetails.appendChild(recipeCategory);
            recipeDetails.appendChild(recipeCountry);
            recipeDetails.appendChild(recipeIngredients);
            recipeDetails.appendChild(recipeInstructions);
            recipeDetails.appendChild(favoriteButton);

            if (container === favoritesList) {
                const removeButton = document.createElement('button');
                removeButton.classList.add('remove-favorite-button');
                removeButton.textContent = 'Remove';
                removeButton.addEventListener('click', () => removeFavorite(meal.idMeal));
                recipeDetails.appendChild(removeButton);
            }

            recipeCard.appendChild(recipeImage);
            recipeCard.appendChild(recipeDetails);

            container.appendChild(recipeCard);
        });
    }

    function removeFavorite(mealId) {
        let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
        favorites = favorites.filter(id => id !== mealId);
        localStorage.setItem('favorites', JSON.stringify(favorites));
        displayFavorites();
    }

    function addToFavorites(mealId) {
        let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
        if (favorites.includes(mealId)) {
            favorites = favorites.filter(id => id !== mealId);
            localStorage.setItem('favorites', JSON.stringify(favorites));
            alert('Removed from favorites!');
        } else {
            favorites.push(mealId);
            localStorage.setItem('favorites', JSON.stringify(favorites));
            alert('Added to favorites!');
        }
    }

    function displayFavorites() {
        favoritesContainer.style.display = 'block';
        recipeContainer.style.display = 'none';
        let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
        favoritesList.innerHTML = '';

        if (favorites.length === 0) {
            favoritesList.innerHTML = '<p>No favorite recipes saved.</p>';
            return;
        }

        favorites.forEach(mealId => {
            fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`)
                .then(response => response.json())
                .then(data => {
                    if (data.meals) {
                        displayMeals(data.meals, favoritesList);
                    }
                })
                .catch(error => console.error('Error fetching favorite meal:', error));
        });
    }
});