"use strict";

window.addEventListener("DOMContentLoaded", start);

let allStudents = [];
let currentStudents = [];

const Student = {
  fullName: "",
  firstName: "",
  lastName: "",
  middleName: "",
  nickName: "",
  imageName: "",
  house: "",
  gender: "",
};

const gryffindorBtn = document.querySelector(".Gryffindor");
const slytherinBtn = document.querySelector(".Slytherin");
const hufflepuffBtn = document.querySelector(".Hufflepuff");
const ravenclawBtn = document.querySelector(".Ravenclaw");
const allBtn = document.querySelector(".All");

const myHeading = document.querySelectorAll("#sorting > th");

function start() {
  gryffindorBtn.addEventListener("click", filterGryffindor);
  slytherinBtn.addEventListener("click", filterSlytherin);
  hufflepuffBtn.addEventListener("click", filterHufflepuff);
  ravenclawBtn.addEventListener("click", filterRavenclaw);
  allBtn.addEventListener("click", loadJSON);
  loadJSON();

  myHeading.forEach((button) => {
    button.addEventListener("click", sortButtonClick);
  });
}

async function loadJSON() {
  const response = await fetch("students.json");
  const jsonData = await response.json();

  prepareObjects(jsonData);
  //console.log(jsonData);
}

function prepareObjects(jsonData) {
  allStudents = jsonData.map(prepareObject);
  currentStudents = allStudents.filter((allStudents) => true);
  displayList(allStudents);
}

function prepareObject(jsonObject) {
  const student = Object.create(Student);
  const fullName = jsonObject.fullname;
  student.fullName = fullName;
  const trimmedName = fullName.trim();
  //get first name
  const names = trimmedName.split(" ");
  student.firstName = names[0];
  const firstName = student.firstName.charAt(0).toUpperCase() + student.firstName.slice(1).toLowerCase();
  student.firstName = firstName;
  //get middle name
  if (names.length === 3) {
    student.middleName = names[1];
    const middleName = student.middleName.charAt(0).toUpperCase() + student.middleName.slice(1).toLowerCase();
    student.middleName = middleName;
  } else if (names.length === 2) {
    delete student.middleName;
  }
  //set last name
  if (names.length === 3) {
    student.lastName = names[2];
  } else if (names.length === 2) {
    student.lastName = names[1];
  }
  const lastName = student.lastName.charAt(0).toUpperCase() + student.lastName.slice(1).toLowerCase();
  student.lastName = lastName;
  //find nickname
  if (student.middleName.startsWith(`"`)) {
    student.nickName = names[1];
    const newNick = student.nickName.substring(1, student.nickName.length - 1);
    const upperNick = newNick.charAt(0).toUpperCase() + newNick.slice(1).toLowerCase();
    student.nickName = upperNick;
    delete student.middleName;
  } else {
    delete student.nickName;
  }
  //set house and capitalize
  const studentHouse = jsonObject.house;
  const trimmedHouse = studentHouse.trim();
  const upperHouse = trimmedHouse.charAt(0).toUpperCase() + trimmedHouse.slice(1).toLowerCase();
  student.house = upperHouse;

  //find gender

  const studentGender = jsonObject.gender;
  student.gender = studentGender;

  //set image for students
  student.imageName = lastName.toLowerCase() + "_" + firstName[0].toLowerCase() + ".png";
  const image = student.imageName;
  //console.log(image);

  return student;
}

function displayList(students) {
  document.querySelector("TBOdy").innerHTML = "";
  students.forEach(displayStudent);
}

function displayStudent(student) {
  console.log(student);
  const clone = document.querySelector("table TBOdy template.student").content.cloneNode(true);

  clone.querySelector(".first-name").textContent = student.firstName;
  clone.querySelector(".middle-name").textContent = student.middleName;
  clone.querySelector(".last-name").textContent = student.lastName;
  clone.querySelector(".house").textContent = student.house;

  const modal = document.querySelector(".modal-bg");

  const modalButton = clone.querySelector(".first-name");

  modalButton.addEventListener("click", showModal);
  function showModal() {
    modal.style.display = "block";
    modal.dataset.theme = student.house;
    modal.querySelector(".crest").src = `${student.house}.png`;
    modal.querySelector(".first-name ").textContent = `Name: ${student.firstName}`;
    modal.querySelector(".nick-name ").textContent = `Nickname: ${student.nickName}`;
    modal.querySelector(".middle-name ").textContent = `Middle Name: ${student.middleName}`;
    modal.querySelector(".last-name ").textContent = `Last Name: ${student.lastName}`;
    modal.querySelector(".house").textContent = student.house;
    modal.querySelector(".modal-img").src = `images//${student.imageName}`;
  }
  //console.log(student);
  const closeModal = document.querySelector(".close");
  closeModal.addEventListener("click", hideModal);
  function hideModal() {
    modal.style.display = "none";
  }
  window.onclick = function (event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  };

  document.querySelector("TBOdy").appendChild(clone);
}

// FILRER FUNCTIONS
function filterGryffindor() {
  document.querySelector("TBOdy").innerHTML = "";
  const onlyGryffindor = allStudents.filter(isGryffindor);
  displayList(onlyGryffindor);
  function isGryffindor(student) {
    if (student.house === "Gryffindor") {
      return true;
    } else {
      return false;
    }
  }
}
function filterSlytherin() {
  document.querySelector("TBOdy").innerHTML = "";
  const onlySlytherin = allStudents.filter(isSlytherin);
  displayList(onlySlytherin);
  function isSlytherin(student) {
    if (student.house === "Slytherin") {
      return true;
    } else {
      return false;
    }
  }
}
function filterHufflepuff() {
  document.querySelector("TBOdy").innerHTML = "";
  const onlyHufflepuff = allStudents.filter(isHufflepuff);
  displayList(onlyHufflepuff);
  function isHufflepuff(student) {
    if (student.house === "Hufflepuff") {
      return true;
    } else {
      return false;
    }
  }
}
function filterRavenclaw() {
  document.querySelector("TBOdy").innerHTML = "";
  const onlyRavenclaw = allStudents.filter(isRavenclaw);
  displayList(onlyRavenclaw);
  function isRavenclaw(student) {
    if (student.house === "Ravenclaw") {
      return true;
    } else {
      return false;
    }
  }
}

//--------------------------------------SORT

function sortButtonClick() {
  console.log("sortButton");

  //const sort = this.dataset.sort;
  if (this.dataset.action === "sort") {
    clearAllSort();
    console.log(this.dataset.action);
    this.dataset.action = "sorted";
  } else {
    if (this.dataset.sortDirection === "asc") {
      this.dataset.sortDirection = "desc";
      console.log("sortdir desc", this.dataset.sortDirection);
    } else {
      this.dataset.sortDirection = "asc";
      console.log("sortdir asc", this.dataset.sortDirection);
    }
  }
  mySort(this.dataset.sort, this.dataset.sortDirection);
}

function clearAllSort() {
  console.log("clearAllSort");
  myHeading.forEach((botton) => {
    botton.dataset.action = "sort";
  });
}

function mySort(sortBy, sortDirection) {
  console.log(`mySort-, ${sortBy} sortDirection-  ${sortDirection}  `);
  let desc = 1;

  if (sortDirection === "desc") {
    desc = -1;
  }

  currentStudents.sort(function (a, b) {
    var x = a[sortBy];
    var y = b[sortBy];
    if (x < y) {
      return -1 * desc;
    }
    if (x > y) {
      return 1 * desc;
    }
    return 0;
  });

  displayList(currentStudents);
}
