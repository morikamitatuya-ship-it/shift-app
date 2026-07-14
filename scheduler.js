// ===============================
// GR TRACK MANAGER
// Scheduler Engine
// ===============================

function createSchedule() {

    const whiteboard = document.getElementById("whiteboard");

    const days = ["月", "火", "水", "木", "金"];

    const schedule = {};

    days.forEach(day => {

    const shuffled = [...members].sort(() => Math.random() - 0.5);

    schedule[day] = {

        A: shuffled[0] || "-",
        B: shuffled[1] || "-",
        C: shuffled[2] || "-",
        D: currentShift === 1 ? (shuffled[3] || "-") : "-"

    };

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
