// ===============================
// GR TRACK MANAGER
// Scheduler Engine
// ===============================
function canDo(member, position) {

    if (!skills[member]) return false;

    if (!skills[member][currentShift]) return false;

    return skills[member][currentShift][position] === true;

}

function getCandidates(memberList, position, usedMembers) {

    return memberList.filter(member => {

        if (usedMembers.includes(member)) return false;

        return canDo(member, position);

    });

}

function pickMember(candidates, dayCounts, usedMembers) {

    if (candidates.length === 0) {

        return "-";

    }

    candidates.sort((a, b) => {

        if (dayCounts[a] !== dayCounts[b]) {

            return dayCounts[a] - dayCounts[b];

        }

        return Math.random() - 0.5;

    });

    const member = candidates[0];

    usedMembers.push(member);

    dayCounts[member]++;

    return member;

}
function createSchedule() {

    const whiteboard = document.getElementById("whiteboard");

    const days = ["月", "火", "水", "木", "金"];

const schedule = {};
const dayCounts = {};

    days.forEach(day => {

    let availableMembers = members.filter(name => {

    if (!holidays[name]) return true;

    return !holidays[name][day];

});

availableMembers.forEach(name => {

    if (dayCounts[name] === undefined) {

        dayCounts[name] = 0;

    }

});

availableMembers.sort((a, b) => {

    if (dayCounts[a] !== dayCounts[b]) {

        return dayCounts[a] - dayCounts[b];

    }

    return Math.random() - 0.5;

});

const usedMembers = [];

const positions =
    currentShift === 1
        ? ["A","B","C","D"]
        : ["A","B","C"];

// できる人が少ない工程から並べる
positions.sort((a, b) => {

    const countA = getCandidates(availableMembers, a, []).length;
    const countB = getCandidates(availableMembers, b, []).length;

    return countA - countB;

});

schedule[day] = {};

positions.forEach(position => {

    const candidates =
        getCandidates(
            availableMembers,
            position,
            usedMembers
        );

    schedule[day][position] =
        pickMember(
            candidates,
            dayCounts,
            usedMembers
        );

});

if (currentShift === 2) {

    schedule[day].D = "-";

}

const needCount = currentShift === 1 ? 4 : 3;

for (let i = 0; i < needCount; i++) {

    if (availableMembers[i]) {

        dayCounts[availableMembers[i]]++;

    }

}
});

    let html = `
        <h2>早出表</h2>
        <p>${currentShift}直</p>
    `;

    days.forEach(day => {

        html += `
            <h3>${day}</h3>

            <p>
                A　${schedule[day].A}　　　B　${schedule[day].B}
            </p>

            <p>
                C　${schedule[day].C}
                ${currentShift === 1 ? `　　　D　${schedule[day].D}` : ""}
            </p>

            <hr>
        `;

    });

    whiteboard.innerHTML = html;

}
