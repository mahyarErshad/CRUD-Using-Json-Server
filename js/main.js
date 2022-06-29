"use strict";
const addUserBtn = document.getElementById("add-user-btn");
const closeModalBtn = document.getElementById("close-modal-btn");
const emailPattern = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const phonePattern = /^(\+98|0)?9\d{9}$/;
const firstName = document.getElementById("name-input");
const family = document.getElementById("family-input");
const email = document.getElementById("email-input");
const phone = document.getElementById("phone-input");
const edBtn = document.getElementById("edit-btn");
const submitBtn = document.getElementById("submit-btn");
const form = document.getElementById("form");

addUserBtn.addEventListener("click", function () {
  document.querySelector(".modal").style.display = "block";
});
closeModalBtn.addEventListener("click", function () {
  document.querySelector(".modal").style.display = "none";
});

const users = {
  member: [],
  async addUser() {
    const SEND_URL = "http://localhost:3000/data";
    const user = {
      method: "POST",
      body: JSON.stringify({
        userName: firstName.value,
        lastName: family.value,
        email: email.value,
        phone: phone.value,
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    };

    const res = await fetch(SEND_URL, user);
    const data = await res.json();
  },
  async deleteUser(id) {
    let accept = confirm("Do you wan to delete this user?");
    if (accept === true) {
      const DELETE_URL = `http://localhost:3000/data/${id}`;
      const res = await fetch(DELETE_URL, { method: "DELETE" });
      const data = await res.json();
      this.print();
    }
  },
  async editUser(id) {
    document.querySelector(".modal").style.display = "block";
    edBtn.style.display = "block";
    submitBtn.style.display = "none";
    const URL = `http://localhost:3000/data/${id}`;
    const res = await fetch(URL);
    const data = await res.json();
    firstName.value = data.userName;
    family.value = data.lastName;
    email.value = data.email;
    phone.value = data.phone;

    edBtn.onclick = async (e) => {
      e.preventDefault();
      const EDIT_URL = `http://localhost:3000/data/${id}`;
      const user = {
        method: "PUT",
        body: JSON.stringify({
          userName: firstName.value,
          lastName: family.value,
          email: email.value,
          phone: phone.value,
        }),
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      };
      const res = await fetch(EDIT_URL, user);
      const data = await res.json();
      document.querySelector(".modal").style.display = "none";
      edBtn.style.display = "none";
      submitBtn.style.display = "block";
      this.print();
      firstName.value = "";
      family.value = "";
      phone.value = "";
      email.value = "";
    };
  },
  async print() {
    const GET_URL = "http://localhost:3000/data";
    const res = await fetch(GET_URL);
    const data = await res.json();
    const output = document.getElementById("output");
    output.innerHTML = "";
    data.forEach((item) => {
      const table = document.createElement("table");
      table.className = "table";
      const row = table.insertRow();
      const nameCell = row.insertCell();
      const familyCell = row.insertCell();
      const emailCell = row.insertCell();
      const phoneCell = row.insertCell();
      const actionCell = row.insertCell();

      const delBtn = document.createElement("button");
      delBtn.innerHTML = "✕";
      delBtn.classList.add("btn", "btn-danger");
      const editBtn = document.createElement("button");
      editBtn.innerHTML = "✎";
      editBtn.classList.add("btn", "btn-warning");

      actionCell.appendChild(delBtn);
      actionCell.appendChild(editBtn);
      nameCell.innerHTML = item.userName;
      familyCell.innerHTML = item.lastName;
      emailCell.innerHTML = item.email;
      phoneCell.innerHTML = item.phone;
      output.appendChild(table);

      delBtn.onclick = () => {
        users.deleteUser(item.id);
      };
      editBtn.onclick = () => {
        edBtn.style.display = "block";
        submitBtn.style.display = "none";
        users.editUser(item.id);
      };
    });
    firstName.value = "";
    family.value = "";
    phone.value = "";
    email.value = "";
  },
};
// function submit(){
//     if (firstName.value === "" || family.value === "" || phone.value === "" || email.value === ""){
//         const Alert = document.getElementById("empty-fields");
//         Alert.style.display = "block";
//     } else if(!email.value.match(emailPattern) || !phone.value.match(phonePattern)){
//         const Alert = document.getElementById("wrong-format");
//         setInterval(function(){Alert.style.display = "block"}, 2000);
//     } else {
//     const fName = firstName.value;
//     const lName = family.value;
//     const userPhone = phone.value;
//     const userMail = email.value;
//     users.addUser(fName, lName, userPhone, userMail);
//     users.print();}
// }
function submit() {
  const fName = firstName.value;
  const lName = family.value;
  const userPhone = phone.value;
  const userMail = email.value;
  users.addUser(fName, lName, userPhone, userMail);
  users.print();
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  submit();
  document.querySelector(".modal").style.display = "none";
});

document.onload = users.print();
