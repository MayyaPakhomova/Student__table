function firstLetter(str) {
  if (str == "") return str;
  let strOne = str.toLowerCase().trim();
  let strTwo = strOne[0].toUpperCase() + strOne.slice(1);
  return strTwo;
}

function textYear(yearsOld) {
  let txt;
  count = yearsOld % 100;
  if (count >= 5 && count <= 20) {
    txt = "лет";
  } else {
    count = count % 10;
    if (count == 1) {
      txt = "год";
    } else if (count >= 2 && count <= 4) {
      txt = "года";
    } else {
      txt = "лет";
    }
  }
  return txt;
}
const buttonSearchStudents = document.querySelector(".search-students");
const buttonAddStudents = document.querySelector(".add-students");
const studentsList = document.querySelector(".students-list");
const searchField = document.querySelector(".search");
const buttonAdd = document.querySelector(".button-add");

buttonAdd.addEventListener("click", function (e) {
  e.preventDefault();
  fillForms();
  createListStudents();
  validate();
  buttonAdd.disabled = true;
});

function checkYearAdmission() {
  const alertYear = document.querySelector(".alert-year");
  const alertYear2000 = document.querySelector(".alert-year2000");
  const yearAdmission = document.getElementById("year-of-admission");
  yearAdmission.addEventListener("input", function () {
    if (this.value != this.value.replace(/[^\+\d]/g, "")) {
      // (event.keyCode < 48 || event.keyCode > 57)
      yearAdmission.disabled = true;
      alertYear.style.display = "block";
      yearAdmission.value = "";
      alertYear.addEventListener("click", function () {
        alertYear.style.display = "none";
        yearAdmission.disabled = false;
      });
    }
    for (let i = 0; i < yearAdmission.value.length; i++) {
      if (yearAdmission.value[0] < 2 || yearAdmission.value[1] > 0) {
        yearAdmission.disabled = true;
        alertYear2000.style.display = "block";
        alertYear2000.addEventListener("click", function () {
          alertYear2000.style.display = "none";
          yearAdmission.value = "";
          yearAdmission.disabled = false;
        });
      }
    }
  });
  return yearAdmission;
}
checkYearAdmission();
buttonSearchStudents.addEventListener("click", function () {
  searchField.style.display = "flex";
  buttonSearchStudents.style.display = "none";
});
buttonAddStudents.addEventListener("click", function () {
  studentsList.style.display = "flex";
  buttonAddStudents.style.display = "none";
});

function fillForms() {
  const fieldName = document.querySelectorAll(".students-item");
  const yearAdmissionStudent = checkYearAdmission();
  const surnameStudent = document.getElementById("surname");
  const firstnameStudent = document.getElementById("name");
  const secondnameStudent = document.getElementById("middlename");
  const yearBirthStudent = document.getElementById("year-of-birth");
  const facultyStudent = document.getElementById("faculty");
  const dataСhecking = document.querySelector(".data-checking");
  const studentData = document.querySelector(".wrapper");
  const buttonYes = document.querySelector(".consent-button");

  let surname = firstLetter(surnameStudent.value);
  let firstname = firstLetter(firstnameStudent.value);
  let secondname = firstLetter(secondnameStudent.value);

  let yearBirth = new Date(yearBirthStudent.value);
  let dateBirth = yearBirth.getTime();

  let options = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };

  let dateStr = yearBirth.toLocaleDateString("ru-RU", options);
  let today = new Date();
  let age = today.getFullYear() - yearBirth.getFullYear();
  if (
    today.getMonth() < yearBirth.getMonth() ||
    (today.getMonth() == yearBirth.getMonth() &&
      today.getDate() < yearBirth.getDate())
  ) {
    age--;
  }

  let yearAdmission = new Date(yearAdmissionStudent.value);
  let option = {
    year: "numeric",
  };
  let dateAdmission = yearAdmission
    .toLocaleString("ru", option)
    .replace(" г.", "");
  let graduation = yearAdmission.getFullYear() + 4;
  let course = today.getFullYear() - yearAdmission.getFullYear();
  if (
    today.getMonth() < 8 &&
    today.getFullYear() - yearAdmission.getFullYear() <= 4
  ) {
    course =
      dateAdmission +
      " " +
      "-" +
      " " +
      graduation +
      " " +
      course +
      " " +
      "курс";
  } else {
    course =
      dateAdmission + " " + "-" + " " + graduation + " " + "Обучение закончено";
  }
  let faculty = facultyStudent.options[facultyStudent.selectedIndex].text;
  dataСhecking.innerHTML =
    surname +
    "<br>" +
    firstname +
    "<br>" +
    secondname +
    "<br>" +
    "Дата рождения" +
    " " +
    (dateStr + "<br>" + age + " " + textYear(age)) +
    "<br>" +
    "Годы обучения" +
    " " +
    course +
    "<br>" +
    faculty;
  studentData.style.display = "flex";
  buttonYes.style.display = "block";

  return {
    surnameStudent,
    firstnameStudent,
    secondnameStudent,
    yearBirthStudent,
    surname,
    firstname,
    secondname,
    age,
    dateAdmission,
    course,
    faculty,
    yearAdmissionStudent,
    studentData,
    dataСhecking,
    fieldName,
    buttonYes,
    graduation,
    dateBirth,
  };
}
function getItemsData() {
  let students = JSON.parse(localStorage.getItem("Студенты"));
  if (students == undefined) {
    students = [];
  }

  return students;
}
function createListStudents() {
  let fillForm = fillForms();
  let students = getItemsData();
  const consentButton = document.querySelector(".consent-button");
  const returnButton = document.querySelector(".return-button");

  consentButton.addEventListener("click", function () {
    let oneStudent = {};
    oneStudent["student"] =
      fillForm.surname + " " + fillForm.firstname + " " + fillForm.secondname;
    oneStudent["dateBirth"] = fillForm.dateBirth;
    oneStudent["age"] = fillForm.age + " " + textYear(fillForm.age);
    oneStudent["yearFinish"] = fillForm.graduation;
    oneStudent["yearStart"] = fillForm.dateAdmission;
    oneStudent["course"] = fillForm.course;
    oneStudent["faculty"] = fillForm.faculty;

    students.push(oneStudent);

    localStorage.setItem("Студенты", JSON.stringify(students));

    fillForm.studentData.style.display = "none";
    studentsList.style.display = "none";
    buttonAddStudents.style.display = "inline-block";
    buttonAdd.disabled = false;
    fillForm.fieldName.forEach((elem) => {
      elem.value = "";
    });
    createTable();
  });

  returnButton.addEventListener("click", function () {
    for (let i = document.images.length; i--; i > 0)
      document.images[i].parentNode.removeChild(document.images[i]);
    fillForm.studentData.style.display = "none";
    fillForm.fieldName.forEach((elem) => {
      elem.style.border = "1px solid #ced4da";
    });
    fillForm.studentData.style.backgroundColor = "#efefef";
    buttonAdd.disabled = false;
  });
}

function letterValidate() {
  let fillForm = fillForms();
  fillForm.buttonYes.style.display = "none";
  fillForm.studentData.style.backgroundColor = "transparent";
  fillForm.dataСhecking.innerHTML = "";
  buttonAdd.disabled = true;
  let img = document.createElement("img");
  img.classList = "picture";
  img.style.display = "block";
  img.setAttribute("src", "img/01.png");
  fillForm.studentData.append(img);
}
function validate() {
  let fillForm = fillForms();
  fillForm.fieldName.forEach((elem) => {
    if (elem.value == "") {
      elem.style.border = "1px solid #dc3545";
      letterValidate();
    }
  });
  return true;
}

function createTable() {
  let students = getItemsData();
  const table = document.getElementById("table-body");
  table.innerText = "";

  let options = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };

  for (const key of students) {
    let dateBirth = new Date(key.dateBirth).toLocaleString("ru-RU", options);

    const td1 = document.createElement("td");
    const td2 = document.createElement("td");
    const td3 = document.createElement("td");
    const td4 = document.createElement("td");

    const text1 = document.createTextNode(key.student);
    const text2 = document.createTextNode(key.faculty);
    const text3 = document.createTextNode(dateBirth + " " + key.age);
    const text4 = document.createTextNode(key.course);

    td3.setAttribute("data-birth", key.dateBirth);
    td4.setAttribute("data-admission", key.yearStart);
    td4.setAttribute("data-graduation", key.yearFinish);

    const tr = document.createElement("tr");

    td1.append(text1);
    td2.append(text2);
    td3.append(text3);
    td4.append(text4);
    tr.append(td1, td2, td3, td4);

    table.append(tr);
  }
}

createTable();

const table = document.getElementById("sortable");
const headers = table.querySelectorAll("th");

const directions = Array.from(headers).map((header) => {
  return "";
});

function transform(index, cell) {
  const type = headers[index].getAttribute("data-name");
  if (type === "age") {
    return cell.getAttribute("data-birth") / 10000;
  }
  if (type === "year of study") {
    return parseFloat(cell.innerHTML);
  } else {
    return cell.innerHTML;
  }
}

function sortColumn(index) {
  const tableBody = table.querySelector("tbody");
  const rows = tableBody.querySelectorAll("tr");
  const direction = directions[index] || "asc";
  const multiplier = direction === "asc" ? 1 : -1;
  const newRows = Array.from(rows);
  newRows.sort((rowA, rowB) => {
    const cellA = rowA.querySelectorAll("td")[index];
    const cellB = rowB.querySelectorAll("td")[index];
    const a = transform(index, cellA);
    const b = transform(index, cellB);
    if (a > b) {
      return 1 * multiplier;
    }
    if (a < b) {
      return -1 * multiplier;
    }
    if (a === b) {
      return 0;
    }
  });
  directions[index] = direction === "asc" ? "desc" : "asc";

  rows.forEach((row) => {
    tableBody.removeChild(row);
  });

  newRows.forEach((newRow) => {
    tableBody.appendChild(newRow);
  });
}

headers.forEach((header, index) => {
  header.addEventListener("click", function () {
    sortColumn(index);
  });
});

const buttonSearch = document.querySelector(".button-searh");
buttonSearch.addEventListener("click", (e) => {
  e.preventDefault();
  tableSearch();
});

function tableSearch() {
  let students = getItemsData();
  const table = document.getElementById("sortable");
  const searchFio = document.getElementById("search-fio");
  const searchFaculty = document.getElementById("search-faculty");
  const searchYearOfAdmission = document.getElementById(
    "search-year-of-admission"
  );
  const searchYearOfGraduation = document.getElementById(
    "search-year-of-graduation"
  );

  const alertSearch = document.querySelector(".alert-search");
  let searchFioPhrase = new RegExp(searchFio.value, "i");
  let searchFacultyPhrase = new RegExp(searchFaculty.value, "i");
  let searchYearOfAdmissionPhrase = searchYearOfAdmission.value;
  let searchYearOfGraduationPhrase = searchYearOfGraduation.value;
  let hiddeRows = 0;
  for (let i = 1; i < table.rows.length; i++) {
    let isFound = false;

    const regFioText = table.rows[i].cells[0].innerHTML;
    const regFacultyText = table.rows[i].cells[1].innerHTML;
    const regYearOfAdmissionText = table.rows[i].cells[3].getAttribute(
      "data-admission"
    );
    const regYearOfGraduationText = table.rows[i].cells[3].getAttribute(
      "data-graduation"
    );
    isFound =
      (searchFio.value == "" || searchFioPhrase.test(regFioText)) &&
      (searchFaculty.value == "" || searchFacultyPhrase.test(regFacultyText)) &&
      (searchYearOfAdmission.value == "" ||
        searchYearOfAdmissionPhrase === regYearOfAdmissionText) &&
      (searchYearOfGraduation.value == "" ||
        searchYearOfGraduationPhrase === regYearOfGraduationText);

    if (isFound) {
      table.rows[i].style.display = "";
      // table.rows[i].classList.add("table-success")
    } else {
      table.rows[i].style.display = "none";
      if (table.rows[i].style.display == "none") hiddeRows++;
      if (table.rows.length - 1 == hiddeRows) {
        alertSearch.style.display = "block";
        alertSearch.addEventListener("click", function () {
          alertSearch.style.display = "none";
          searchFio.value = "";
          searchFaculty.value = "";
          searchYearOfAdmission.value = "";
          searchYearOfGraduation.value = "";
          searchField.style.display = "none";
          buttonSearchStudents.style.display = "inline-block";
          createTable();
        });
      }
    }
  }
}
