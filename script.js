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

const holidayArea = document.getElementById("holidayArea");
const holidayButton = document.getElementById("holidayButton");
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
// 保存データ読込
// ----------------------

let members = JSON.parse(localStorage.getItem("members")) || [];

let skills = JSON.parse(localStorage.getItem("skills")) || {};
let holidays = JSON.parse(localStorage.getItem("holidays")) || {};

function saveHolidays() {
    localStorage.setItem(
        "holidays",
        JSON.stringify(holidays)
    );
}
function saveMembers() {
    localStorage.setItem(
        "members",
        JSON.stringify(members)
    );
}

function saveSkills() {
    localStorage.setItem(
        "skills",
        JSON.stringify(skills)
    );
}
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

saveMembers();

memberName.value = "";

drawMemberList();
drawSkillList();

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

delete skills[name];

saveMembers();
saveSkills();

drawMemberList();
drawSkillList();    

        });

        row.appendChild(span);
        row.appendChild(deleteButton);

        memberList.appendChild(row);

    });

}
// ----------------------
// 休み入力開閉
// ----------------------

holidayButton.addEventListener("click", () => {

    if (holidayArea.style.display === "none") {

        holidayArea.style.display = "block";

    } else {

        holidayArea.style.display = "none";

    }

    drawHolidayList();

});
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

drawHolidayList();
function drawHolidayList() {

    holidayArea.innerHTML = "";

    const days = ["月", "火", "水", "木", "金"];

    members.forEach((name) => {

        const card = document.createElement("div");
        card.className = "member-row";

        let html = `<strong>${name}</strong>`;
        html += `<div class="skill-checks">`;

        days.forEach((day) => {

            if (!holidays[name]) {
                holidays[name] = {};
            }

            const checked = holidays[name][day]
                ? "checked"
                : "";

            html += `
<label>
<input
type="checkbox"
class="holiday-checkbox"
data-name="${name}"
data-day="${day}"
${checked}>
<span>${day}</span>
</label>
`;

        });

        html += `</div>`;

        card.innerHTML = html;

        holidayArea.appendChild(card);

    });

}
function drawSkillList() {

    skillList.innerHTML = "";

    members.forEach((name) => {

        const card = document.createElement("div");
        card.className = "member-row";

        let html = `<strong>${name}</strong>`;
        html += `<div class="skill-checks">`;

        const skillListForShift =
            currentShift === 1
                ? ["A","B","C","D"]
                : ["A","B","C"];

        skillListForShift.forEach((skill) => {

            if (!skills[name]) skills[name] = {};
            if (!skills[name][currentShift]) skills[name][currentShift] = {};

            const checked =
                skills[name][currentShift][skill]
                    ? "checked"
                    : "";

            html += `
<label>
<input
type="checkbox"
class="skill-checkbox"
data-name="${name}"
data-shift="${currentShift}"
data-skill="${skill}"
${checked}>
<span>${skill}</span>
</label>
`;

        });

        html += `</div>`;

        card.innerHTML = html;
        skillList.appendChild(card);

    });

    document.querySelectorAll(".skill-checkbox").forEach((box) => {

        box.addEventListener("change", () => {

            const name = box.dataset.name;
            const shift = box.dataset.shift;
            const skill = box.dataset.skill;

            if (!skills[name]) skills[name] = {};
            if (!skills[name][shift]) skills[name][shift] = {};

            skills[name][shift][skill] = box.checked;

            saveSkills();

        });

    });

}
