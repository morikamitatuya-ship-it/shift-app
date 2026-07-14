// ===============================
// GR TRACK MANAGER
// Scheduler Engine
// ===============================

function createSchedule() {

    const whiteboard = document.getElementById("whiteboard");

    const days = ["月", "火", "水", "木", "金"];

    const schedule = {};

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

    schedule[day] = {

        A: availableMembers[0] || "-",
B: availableMembers[1] || "-",
C: availableMembers[2] || "-",
D: currentShift === 1 ? (availableMembers[3] || "-") : "-"

    };
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
