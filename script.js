
// ===============================
// GR TRACK MANAGER
// script.js
// ===============================

let currentShift = 1;

// ボタン取得
const shift1Button = document.getElementById("shift1");
const shift2Button = document.getElementById("shift2");

// ----------------------
// 勤務切替
// ----------------------

shift1Button.addEventListener("click", () => {

    currentShift = 1;

    shift1Button.classList.add("active");
    shift2Button.classList.remove("active");

    console.log("1直");

});

shift2Button.addEventListener("click", () => {

    currentShift = 2;

    shift2Button.classList.add("active");
    shift1Button.classList.remove("active");

    console.log("2直");

});

// ----------------------
// メンバー管理
// ----------------------
const memberButton = document.getElementById("memberButton");
const memberArea = document.getElementById("memberArea");

memberButton.addEventListener("click", () => {

    if (memberArea.style.display === "none") {
        memberArea.style.display = "block";
    } else {
        memberArea.style.display = "none";
    }

});


// ----------------------
// スキル管理
// ----------------------

document
.getElementById("skillButton")
.addEventListener("click",()=>{

    alert("スキル管理画面（これから作ります😊）");

});

// ----------------------
// 早出表作成
// ----------------------

document
.getElementById("createButton")
.addEventListener("click",()=>{

    alert("早出表を作成します");

});

// ----------------------
// 再抽選
// ----------------------

document
.getElementById("rerollButton")
.addEventListener("click",()=>{

    alert("再抽選します");

});
