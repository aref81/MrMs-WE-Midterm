/**
 * Validates the provided name (if it contains only letters and spaces)
 * updates the error message and display it if necessary
 * @param {*} name
 * @returns wether the name is valid or not
 */
const validateName = (name) => {
  if (!name) {
    error_container.style.display = "flex";
    error.innerText = "Please provide a name!";
    return false;
  }

  if (!/^[A-Za-z\s]*$/.test(name)) {
    error_container.style.display = "flex";
    error.innerText = "Name should only contain letters and spaces!";
    return false;
  }

  if (name.length >= 255) {
    error_container.style.display = "flex";
    error.innerText = "Name should be less than 255 characters!";
    return false;
  }

  return true;
};


/**
 * Displays the prediction result to the user and sets the radio button
 * to the predicted one
 * @param {*} param0 predicted gender and the prediction probability
 * @param {*} name the provided name
 */
const displayPrediction = ({ gender, probability }, name) => {
  if (!gender) {
    error_container.style.display = "flex";
    error.innerText = "No prediction available for this name";
  }

  if (gender === null){
    predictionText.innerText = "No prediction available for this name";
    return
  }

  if (gender === "male") {
    isMale.checked = true
  } else if (gender === "female") {
    isFemale.checked = true
  }
  predictionText.innerText = `the name ${name} belongs to a ${gender} with probability of ${(probability * 100).toFixed(1)}%`;
};

/**
 * Fetches gender prediction from an external API 
 * and displays the result or errors if necessary
 * @param {*} name the provided name
 */

const getPrediction = async (name) => {
  const url = new URL("https://api.genderize.io/");
  const params = { name: name };
  url.search = new URLSearchParams(params).toString();

  const response = await fetch(url, { method: "GET" });
  if (response.ok) {
    const body = await response.json();
    displayPrediction(body, name);
  } else {
    error_container.style.display = "flex";
    error.innerText = "Error fetching prediction";
  }
};


/**
 * Updates the saved name and gender for a specific name
 * It will update the global variable "currentSavedValue" too
 * @param {*} name retreived name
 * @param {*} gender retreived gender
 */
const updateSavedValue = (name, gender) => {
  savedAnswerText.innerText = `name ${name} belongs to a ${gender}`;
  currentSavedValue.name = name;
  currentSavedValue.gender = gender;
};

/**
 * retreives the saved gender for the given name from localStorage
 * If no saved value is found, the text indicates an unknowon state
 * @param {*} name provided name
 */
const getSavedValue = (name) => {
  const gender = localStorage.getItem(name);
  if (gender) {
    updateSavedValue(name, gender);
  } else {
    savedAnswerText.innerText = `No saved gender for ${name}`;
  }
};


/**
 * Handles form submission, validates the name, retrieves 
 * saved values, and fetches prediction for name's
 * gender from an external API
 * @param {*} event
 */
const handleFormSubmit = (event) => {
  event.preventDefault();
  const { value: name } = nameInput;
  if (validateName(name)) {
    error_container.style.display = "none";
    error.innerText = "";
    getSavedValue(name);
    getPrediction(name);
  }
};


/**
 * Saves the name and gender to localStorage,
 * if name is valid , It will also display the saved values to the user
 */
const handleSave = () => {
  const { value: name } = nameInput;
  if (validateName(name)) {
    error_container.style.display = "none";
    error.innerText = "";

    const isMaleChecked = isMale.checked;
    const gender = isMaleChecked ? "male" : "female";

    localStorage.setItem(name, gender);
    updateSavedValue(name, gender);
  }
};

/**
 * it clears the current gender for this name from localStorage.
 */
const handleClear = () => {
  localStorage.removeItem(currentSavedValue.name);
  savedAnswerText.innerText = `No saved gender`;
};

// Element references
const nameInput = document.getElementById("name");
const error = document.getElementById("error");
const form = document.getElementById("form");
const isMale = document.getElementById("male");
const isFemale = document.getElementById("female");
const predictionText = document.getElementById("prediction");
const savedAnswerText = document.getElementById("saved-answer");

// Object to store the current saved values shown to the user
const currentSavedValue = {
  name: "",
  gender: "",
};

// Event listener for form submission
form.onsubmit = handleFormSubmit;
