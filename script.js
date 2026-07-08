// ===============================
// GR TRACK MANAGER
// script.js
// ===============================

let currentShift = 1;

// ----------------------
// ボタン取得
// ----------------------

const shift1Button = document.getElementById("shift1");
const shift2Button = document.getElementById("shift2");

const memberButton = document.getElementById("memberButton");
const memberArea = document.getElementById("memberArea");

const addMemberButton = document.getElementById("addMember");
const memberName = document.getElementById("memberName");
const memberList = document.getElementById("memberList");

// ----------------------
// 保存データ読込
// ----------------------

let members = JSON.parse(localStorage.getItem("members"));

if (!members) {
    members = [];
}
let skills = JSON.parse(localStorage.getItem("skills"));

if (!skills) {
    skills = {};
}
// ----------------------
// 勤務切替
// ----------------------

shift1Button.addEventListener("click", () => {

    currentShift = 1;

    shift1Button.classList.add("active");
    shift2Button.classList.remove("active");

});

shift2Button.addEventListener("click", () => {

    currentShift = 2;

    shift2Button.classList.add("active");
    shift1Button.classList.remove("active");

});

// ----------------------
// メンバー管理開閉
// ----------------------

memberButton.addEventListener("click", () => {

    if (memberArea.style.display === "none") {

        memberArea.style.display = "block";

    } else {

        memberArea.style.display = "none";

    }

});

// ----------------------
// メンバー追加
// ----------------------

addMemberButton.addEventListener("click", () => {

    const name = memberName.value.trim();

    if (name === "") {

        alert("名前を入力してください");
        return;

    }

    members.push(name);

    localStorage.setItem(
        "members",
        JSON.stringify(members)
    );

    memberName.value = "";

    drawMemberList();

});

// ----------------------
// 一覧表示
// ----------------------

function drawMemberList() {

    memberList.innerHTML = "";

    members.forEach((name, index) => {

        const row = document.createElement("div");
        row.className = "member-row";

        const span = document.createElement("span");
        span.textContent = name;

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "🗑️";

        deleteButton.addEventListener("click", () => {

            members.splice(index, 1);

            localStorage.setItem(
                "members",
                JSON.stringify(members)
            );

            drawMemberList();

        });

        row.appendChild(span);
        row.appendChild(deleteButton);

        memberList.appendChild(row);

    });

}
// ----------------------
// スキル管理
// ----------------------



const skillButton = document.getElementById("skillButton");
const skillArea = document.getElementById("skillArea");
const skillList = document.getElementById("skillList");

skillButton.addEventListener("click", () => {

    if (skillArea.style.display === "none") {

        skillArea.style.display = "block";

    } else {

        skillArea.style.display = "none";

    }

    drawSkillList();

});

// ----------------------
// 早出表
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

// ----------------------
// 起動時
// ----------------------

drawMemberList();
function drawSkillList() {
    skillList.innerHTML = "";

    members.forEach((name) => {

        const card = document.createElement("div");

        card.className = "member-row";

        let html = `<strong>${name}</strong>`;

html += `<div class="skill-checks">`;

        html += `
<label><input type="checkbox"><span>A</span></label>
<label><input type="checkbox"><span>B</span></label>
<label><input type="checkbox"><span>C</span></label>
`;

        if(currentShift === 1){

            html += `
<label><input type="checkbox"><span>D</span></label>
`;

        }
html += `</div>`;
        card.innerHTML = html;

        skillList.appendChild(card);

    });

}
