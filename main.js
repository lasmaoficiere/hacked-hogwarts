"use strict";

window.addEventListener("DOMContentLoaded", start);

let allStudents = [];

const Student = {
  fullName: "",
  firstName: "",
  lastName: "",
  middleName: "",
  nickName: "",
  imageName: "",
  house: "",
  star: "☆",
  gender: "",
};

let gryffindorAbout = 0;
let hufflepuffAbout = 0;
let ravenclawAbout = 0;
let slytherinAbout = 0;

//GENERAL VARIABLES
const gryffindorBtn = document.querySelector(".Gryffindor");
const slytherinBtn = document.querySelector(".Slytherin");
const hufflepuffBtn = document.querySelector(".Hufflepuff");
const ravenclawBtn = document.querySelector(".Ravenclaw");
const allBtn = document.querySelector(".All");

const sortNameBtn = document.querySelector(".down");
const sortNameBtnBack = document.querySelector(".up");
const sortLastNameBtn = document.querySelector(".down-last");
const sortLastNameBtnBack = document.querySelector(".up-last");
const sortHouseBtn = document.querySelector(".down-house");
const sortHouseBack = document.querySelector(".up-house");

const searchInput = document.querySelector("#searchText");

function start() {
  //filter
  gryffindorBtn.addEventListener("click", filterGryffindor);
  slytherinBtn.addEventListener("click", filterSlytherin);
  hufflepuffBtn.addEventListener("click", filterHufflepuff);
  ravenclawBtn.addEventListener("click", filterRavenclaw);
  allBtn.addEventListener("click", loadJSON);

  sortNameBtn.addEventListener("click", sortByName);
  sortNameBtnBack.addEventListener("click", sortByNameBack);

  sortLastNameBtn.addEventListener("click", sortByLastName);
  sortLastNameBtnBack.addEventListener("click", sortByLastNameBack);

  sortHouseBtn.addEventListener("click", sortByHouse);
  sortHouseBack.addEventListener("click", sortByHouseBack);

  searchInput.addEventListener("keyup", searchStudents);
  loadJSON();
}

async function loadJSON() {
  const response = await fetch("students.json");
  const jsonData = await response.json();

  prepareObjects(jsonData);
  //console.log(jsonData);
}

function prepareObjects(jsonData) {
  allStudents = jsonData.map(prepareObject);
  displayList(allStudents);
  houseCount();
  displayAboutNumbers();
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
  displayAboutNumbers();
}

function displayStudent(student) {
  //console.log(student);
  const clone = document.querySelector("table TBOdy template.student").content.cloneNode(true);

  clone.querySelector("[data-field=first-name]").textContent = student.firstName;
  clone.querySelector("[data-field=middle-name]").textContent = student.middleName;
  clone.querySelector("[data-field=last-name]").textContent = student.lastName;
  clone.querySelector("[data-field=star]").textContent = student.star;
  clone.querySelector(".house").textContent = student.house;

  clone.querySelector("[data-field=star]").addEventListener("click", function () {
    toggleStar(student);
  });

  const modal = document.querySelector(".modal-bg");

  const modalButton = clone.querySelector("[data-field=first-name]");

  modalButton.addEventListener("click", showModal);
  function showModal() {
    modal.style.display = "block";
    modal.dataset.theme = student.house;
    modal.querySelector(".crest").src = `${student.house}.png`;
    modal.querySelector("[data-field=first-name]").textContent = `Name: ${student.firstName}`;
    modal.querySelector("[data-field=nick-name]").textContent = `Nickname: ${student.nickName}`;
    modal.querySelector("[data-field=middle-name]").textContent = `Middle Name: ${student.middleName}`;
    modal.querySelector("[data-field=last-name]").textContent = `Last Name: ${student.lastName}`;
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

function toggleStar(thisStar) {
  thisStar.star = thisStar.star === "☆" ? "⭐" : "☆";
  displayList(allStudents);
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

// SORT FUNCTIONS

function sortByName() {
  const sortName = allStudents.sort(compareName);
  displayList(allStudents);
}
function sortByNameBack() {
  const sortNameBack = allStudents.sort(compareNameBack);
  displayList(allStudents);
}
function sortByLastName() {
  const sortLastName = allStudents.sort(compareLastName);
  displayList(allStudents);
}
function sortByLastNameBack() {
  const sortLastNameBack = allStudents.sort(compareLastNameBack);
  displayList(allStudents);
}
function sortByHouse() {
  const sortHouse = allStudents.sort(compareHouse);
  displayList(allStudents);
}
function sortByHouseBack() {
  const sortHouseBack = allStudents.sort(compareHouseBack);
  displayList(allStudents);
}
function compareName(a, b) {
  if (a.firstName > b.firstName) {
    return -1;
  } else if (a.firstName < b.firstName) {
    return 1;
  } else {
    return 0;
  }
}
function compareNameBack(a, b) {
  if (a.firstName < b.firstName) {
    return -1;
  } else if (a.firstName > b.firstName) {
    return 1;
  } else {
    return 0;
  }
}
function compareLastName(a, b) {
  if (a.lastName < b.lastName) {
    return 1;
  } else if (a.lastName > b.lastName) {
    return -1;
  } else {
    return 0;
  }
}
function compareLastNameBack(a, b) {
  if (a.lastName > b.lastName) {
    return 1;
  } else if (a.lastName < b.lastName) {
    return -1;
  } else {
    return 0;
  }
}
function compareHouse(a, b) {
  if (a.house < b.house) {
    return 1;
  } else if (a.house > b.house) {
    return -1;
  } else {
    return 0;
  }
}
function compareHouseBack(a, b) {
  if (a.house > b.house) {
    return 1;
  } else if (a.house < b.house) {
    return -1;
  } else {
    return 0;
  }
}

//SEARCH
function searchStudents() {
  let text = document.getElementById("searchText");
  const searchStudents = allStudents.filter((s) => s.fullName.toLowerCase().includes(text.value));
  displayList(searchStudents);
}

function houseCount() {
  allStudents.forEach((student) => {
    student.house === "Gryffindor" ? gryffindorAbout++ : student.house === "Hufflepuff" ? hufflepuffAbout++ : student.house === "Ravenclaw" ? ravenclawAbout++ : slytherinAbout++;
  });
}

function displayAboutNumbers() {
  const gryAbout = document.querySelector("#gryfnumber");
  const huffleAbout = document.querySelector("#hufflenumber");
  const ravenAbout = document.querySelector("#ravennumber");
  const slythAbout = document.querySelector("#slythnumber");
  const allStudentsAbout = document.querySelector("#enrollednumber");

  gryAbout.textContent = gryffindorAbout;
  huffleAbout.textContent = hufflepuffAbout;
  ravenAbout.textContent = ravenclawAbout;
  slythAbout.textContent = slytherinAbout;
  allStudentsAbout.textContent = gryffindorAbout + hufflepuffAbout + ravenclawAbout + slytherinAbout;
}
