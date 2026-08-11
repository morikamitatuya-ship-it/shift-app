// ===============================
// GR TRACK MANAGER
// Scheduler Engine Version2
// Part1
// ===============================


// -------------------------------
// ポジション取得
// -------------------------------
let currentSchedule = null;
let currentEducation = null;
function getPositions() {

    return currentShift === 1
        ? ["A","B","C","D"]
        : ["A","B","C"];

}


// -------------------------------
// スキル判定
// -------------------------------

function canDo(member, position) {

    if (!skills[member]) {
        return false;
    }


    if (!skills[member][currentShift]) {
        return false;
    }


    return skills[member][currentShift][position] === true;

}


// -------------------------------
// 教育中判定
// -------------------------------

function isTraining(member) {

    if (!skills[member]) {
        return true;
    }


    if (!skills[member][currentShift]) {
        return true;
    }


    const positions =
        getPositions();


    return positions.some(position => {

        return !skills[member][currentShift][position];

    });

}


// -------------------------------
// 休み確認
// -------------------------------

function isHoliday(member, day) {

    if (!holidays[member]) {
        return false;
    }


    return holidays[member][day] === true;

}


// -------------------------------
// 出勤可能メンバー取得
// -------------------------------

function getAvailableMembers(day) {

    return members.filter(member => {

        return !isHoliday(
            member,
            day
        );

    });
    

}
// -------------------------------
// 候補者取得
// -------------------------------

function getCandidates(
    memberList,
    position,
    usedMembers
) {

    return memberList.filter(member => {


        // 同日重複防止
        if (
            usedMembers.includes(member)
        ) {
            return false;
        }


        // スキル確認
        if (
            !canDo(
                member,
                position
            )
        ) {
            return false;
        }


        return true;

    });

}


// -------------------------------
// 担当回数初期化
// -------------------------------

function createCountTable() {

    const counts = {};


    members.forEach(member => {

        counts[member] = 0;

    });


    return counts;

}
// -------------------------------
// 工程別担当回数
// -------------------------------

function createPositionCountTable() {

    const positionCounts = {};

    members.forEach(member => {

        positionCounts[member] = {
            A: 0,
            B: 0,
            C: 0,
            D: 0
        };

    });

    return positionCounts;

}

// -------------------------------
// 候補人数確認
// -------------------------------

function getCandidateCount(
    memberList,
    position
) {

    return memberList.filter(member => {

        return canDo(
            member,
            position
        );

    }).length;

}


// -------------------------------
// 工程順番決定
// 少ない工程を先に処理
// -------------------------------

function sortPositions(
    memberList
) {

    const positions =
        getPositions();


    return positions.sort((a,b)=>{


        const countA =
            getCandidateCount(
                memberList,
                a
            );


        const countB =
            getCandidateCount(
                memberList,
                b
            );
        


        return countA - countB;


    });

}


// -------------------------------
// 前日担当確認
// -------------------------------

function wasYesterdayMember(
    member,
    day,
    schedule
) {

    const days = [
        "月",
        "火",
        "水",
        "木",
        "金"
    ];


    const index =
        days.indexOf(day);


    if (index <= 0) {

        return false;

    }


    const yesterday =
        days[index - 1];


    const positions =
        currentShift === 1
            ? ["A","B","C","D"]
            : ["A","B","C"];


    return positions.some(position => {

        return schedule[yesterday]
            &&
            schedule[yesterday][position]
            === member;

    });

}
// -------------------------------
// スケジュール採点
// -------------------------------

function calculateScore(
    schedule,
    positionCounts
) {

    let score = 0;
members.forEach(member => {

    const counts = positionCounts[member];

    const uniquePositions =
        Object.values(counts)
            .filter(count => count > 0)
            .length;

    score +=
        (4 - uniquePositions) * 10;
Object.values(counts).forEach(count => {

    if (count >= 2) {

        score +=
            (count - 1) * 30;

    }

});
});
    return score;

}
// -------------------------------
// 公平選択 Version2
// -------------------------------

function pickMember(
    candidates,
    counts,
    positionCounts,
    position,
    day,
    schedule,
    usedMembers
) {


    if (
        candidates.length === 0
    ) {

        return "-";

    }


    candidates.sort((a,b)=>{


        // ①担当回数が少ない人優先

        if (
            counts[a] !== counts[b]
        ) {

            return counts[a] - counts[b];

        }
// ①-2 同じ工程の担当回数が少ない人優先

if (
    positionCounts[a][position] !==
    positionCounts[b][position]
) {

    return (
        positionCounts[a][position] -
        positionCounts[b][position]
    );

}


        // ②前日担当を避ける

        const aYesterday =
            wasYesterdayMember(
                a,
                day,
                schedule
            );


        const bYesterday =
            wasYesterdayMember(
                b,
                day,
                schedule
            );



        if (
            aYesterday !== bYesterday
        ) {

            return aYesterday ? 1 : -1;

        }



        // ③同条件ならランダム

        return Math.random() - 0.5;


    });



    const selected =
    candidates[0];

usedMembers.push(
    selected
);

if (selected !== "-") {

    counts[selected]++;

    positionCounts[selected][position]++;

}

return selected;
}


// ===============================
// Scheduler Engine Version2
// Part2
// Schedule Generator
// ===============================


// -------------------------------
// 1日分作成
// -------------------------------

function createDaySchedule(
    day,
    counts,
    positionCounts
) {


    const result = {};

    const usedMembers = [];


    const availableMembers =
        getAvailableMembers(day);
    const educations =
    JSON.parse(
        localStorage.getItem("educations")
    ) || [];
const todayEducations =
    educations.filter(education =>
        education.days.includes(day)
    );
const education =
    todayEducations[0];
    
    const trainee =
    education?.member;

const trainingPosition =
    education?.position;

    const positions =
        sortPositions(
            availableMembers
        );
    



    positions.forEach(position=>{


        const candidates =
            getCandidates(
                availableMembers,
                position,
                usedMembers
            );
        if (
    education &&
    position === trainingPosition &&
    candidates.includes(trainee)
) {
           

    result[position] = trainee;

    usedMembers.push(trainee);

    counts[trainee]++;

    positionCounts[trainee][position]++;

    return;

}
       



result[position] =
    pickMember(
    candidates,
    counts,
    positionCounts,
    position,
    day,
    result,
    usedMembers
);


    });



    // 2直はDなし
    if (
        currentShift === 2
    ) {

        result.D = "-";

    }



    return result;

}



// -------------------------------
// 週スケジュール作成
// -------------------------------

function buildSchedule() {


    const days = [
        "月",
        "火",
        "水",
        "木",
        "金"
    ];


const counts =
        createCountTable();
const positionCounts =
    createPositionCountTable();


const schedule =
        {};



    days.forEach(day=>{


        schedule[day] =
            createDaySchedule(
    day,
    counts,
    positionCounts
);


    });


const score =
    calculateScore(
        schedule,
        positionCounts
    );
    return {
    schedule,
    counts,
    positionCounts,
    score
};


}



// -------------------------------
// 教育担当取得
// -------------------------------

function findTrainer(
    trainee,
    counts,
    used
) {


    const candidates =
        members.filter(member=>{


            if (
                member === trainee
            ) {

                return false;

            }


            if (
                used.includes(member)
            ) {

                return false;

            }


            // 教育できる人
            return !isTraining(
                member
            );


        });



    if (
        candidates.length === 0
    ) {

        return "-";

    }



    candidates.sort((a,b)=>{


        return counts[a] - counts[b];


    });



    return candidates[0];

}
// -------------------------------
// 教育情報作成
// -------------------------------

function createEducationInfo(
    schedule,
    counts
) {


    const education = {};



    Object.keys(schedule)
    .forEach(day=>{


        education[day] = {};



        const usedTrainer = [];



        getPositions()
        .forEach(position=>{


            const member =
                schedule[day][position];



            if (
                member === "-"
            ) {

                return;

            }



            if (
                isTraining(member)
            ) {


                const trainer =
                    findTrainer(
                        member,
                        counts,
                        usedTrainer
                    );



                education[day][position] = {

                    trainee: member,

                    trainer: trainer

                };



                if (
                    trainer !== "-"
                ) {

                    usedTrainer.push(
                        trainer
                    );

                }


            }



        });


    });



    return education;

}


// -------------------------------
// マーク取得
// -------------------------------

function getEducationMark(
    education,
    day,
    position
) {


    if (
        !education[day]
    ) {

        return "";

    }



    if (
        !education[day][position]
    ) {

        return "";

    }



    return "🟠";

}


// -------------------------------
// 作成メイン
// -------------------------------

function createSchedule() {

    const educations =
        JSON.parse(
            localStorage.getItem("educations")
        ) || [];


    let bestData = null;

    let bestScore =
        Infinity;


    for (
        let i = 0;
        i < 50;
        i++
    ) {

        const data =
            buildSchedule();


        if (
            data.score < bestScore
        ) {

            bestScore =
                data.score;

            bestData =
                data;

        }

    }


    const schedule =
        bestData.schedule;

    const counts =
        bestData.counts;

    const positionCounts =
        bestData.positionCounts;

    const score =
        bestData.score;


    console.log(
        "Best Score:",
        bestScore
    );

    console.log(
        "Selected Score:",
        score
    );


    const education =
        createEducationInfo(
            schedule,
            counts
        );


    currentSchedule =
        schedule;

    currentEducation =
        education;


    renderSchedule(
        schedule,
        education
    );


    // -------------------------------
    // 年休チェックをリセット
    // -------------------------------

    holidays = {};

    localStorage.setItem(
        "holidays",
        JSON.stringify(
            holidays
        )
    );


    return schedule;

}
// ===============================
// Scheduler Engine Version2
// Part3
// Render
// ===============================


// -------------------------------
// 表示作成
// -------------------------------

function renderSchedule(
    schedule,
    education
) {

    const whiteboard =
        document.getElementById(
            "whiteboard"
        );


    const days = [
        "月",
        "火",
        "水",
        "木",
        "金"
    ];


    function createPositionHTML(
        day,
        position
    ) {

        const member =
            schedule[day][position];


        if (
            member === undefined ||
            member === "-"
        ) {

            return `
                <div class="position-box">

                    <div class="position-title">
                        ${position}
                    </div>

                </div>
            `;

        }


        // -------------------------------
        // 担当者プルダウン
        // -------------------------------

        const selectableMembers =
            members.filter(
                name => name !== "伊達"
            );


        let options = "";


        selectableMembers.forEach(
            name => {

                options += `
                    <option
                        value="${name}"
                        ${
                            name === member
                            ? "selected"
                            : ""
                        }
                    >
                        ${name}
                    </option>
                `;

            }
        );


        if (
            member === "伊達"
        ) {

            options = `
                <option
                    value="伊達"
                    selected
                >
                    伊達
                </option>
            ` + options;

        }


        let html = `

            <div class="position-box">

                <div class="position-title">
                    ${position}
                </div>

                <select
                    class="member-select"
                    onchange="
                        changeMember(
                            '${day}',
                            '${position}',
                            this.value
                        )
                    "
                >

                    ${options}

                </select>

        `;


        // -------------------------------
        // 🟠 未習得表示
        // -------------------------------

        if (
            isTraining(member)
        ) {

            html += `

                <div class="training-mark">
                    🟠
                </div>

            `;

        }


        // -------------------------------
        // 教育設定がある場合だけ
        // 教育担当を表示
        // -------------------------------

        if (
            education &&
            education[day] &&
            education[day][position]
        ) {

            const educationData =
                education[day][position];


            const trainer =
                educationData.trainer;


            let trainerOptions = "";


            members.forEach(
                name => {

                    trainerOptions += `
                        <option
                            value="${name}"
                            ${
                                name === trainer
                                ? "selected"
                                : ""
                            }
                        >
                            ${name}
                        </option>
                    `;

                }
            );


            html += `

                <div class="education-trainer">

                    👨‍🏫

                    <select
                        class="trainer-select"
                        onchange="
                            changeTrainer(
                                '${day}',
                                '${position}',
                                this.value
                            )
                        "
                    >

                        ${trainerOptions}

                    </select>

                </div>

            `;

        }


        html += `

            </div>

        `;


        return html;

    }


    // -------------------------------
    // 表全体
    // -------------------------------

    let html = `

        <h2>早出表</h2>

        <p>
            ${currentShift}直
        </p>

    `;


    days.forEach(
        day => {

            html += `

                <div class="day-box">

                    <h3>
                        ${day}
                    </h3>

                    <div class="schedule-grid">

                        <div class="left-column">

                            ${createPositionHTML(
                                day,
                                "A"
                            )}

                            ${createPositionHTML(
                                day,
                                "B"
                            )}

                        </div>


                        <div class="right-column">

                            ${createPositionHTML(
                                day,
                                "C"
                            )}

                            ${
                                currentShift === 1
                                ?
                                createPositionHTML(
                                    day,
                                    "D"
                                )
                                :
                                ""
                            }

                        </div>

                    </div>

                </div>

            `;

        }
    );


    html += `

        <div class="education-legend">

            🟠＝未習得スキルあり

            <br>

            👨‍🏫＝本日の教育担当

        </div>

    `;


    whiteboard.innerHTML =
        html;

}
function changeMember(
    day,
    position,
    member
) {

    currentSchedule[day][position] = member;

    renderSchedule(
        currentSchedule,
        currentEducation
    );

}
function changeTrainer(
    day,
    position,
    trainer
) {

    if (
        !currentEducation ||
        !currentEducation[day] ||
        !currentEducation[day][position]
    ) {

        return;

    }


    currentEducation[day][position].trainer =
        trainer;


    renderSchedule(
        currentSchedule,
        currentEducation
    );

}
