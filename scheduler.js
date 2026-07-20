// ===============================
// GR TRACK MANAGER
// Scheduler Engine Version2
// Part1
// ===============================


// -------------------------------
// ポジション取得
// -------------------------------

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
// 公平選択 Version2
// -------------------------------

function pickMember(
    candidates,
    counts,
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


    counts[selected]++;


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
    counts
) {


    const result = {};

    const usedMembers = [];


    const availableMembers =
        getAvailableMembers(day);



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



result[position] =
    pickMember(
        candidates,
        counts,
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



    const schedule =
        {};



    days.forEach(day=>{


        schedule[day] =
            createDaySchedule(
                day,
                counts
            );


    });



    return {
        schedule,
        counts
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


    const data =
        buildSchedule();



    const schedule =
        data.schedule;


    const counts =
        data.counts;



    const education =
        createEducationInfo(
            schedule,
            counts
        );



    renderSchedule(
        schedule,
        education
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



    let html = `

        <h2>早出表</h2>

        <p>${currentShift}直</p>

    `;



    days.forEach(day=>{


        html += `

            <h3>${day}</h3>

        `;



        getPositions()
        .forEach(position=>{


            const member =
                schedule[day][position];



            let mark = "";



            if (
                education[day] &&
                education[day][position]
            ) {


                mark += "🟠";



                const trainer =
                    education[day][position]
                    .trainer;



                if (
                    trainer !== "-"
                ) {

                    mark +=
                    ` 👨‍🏫(${trainer})`;

                }


            }



            html += `

                <p>

                ${position}　${member}${mark}

                </p>

            `;



        });



        html += "<hr>";



    });



    html += `

        <p style="
        font-size:14px;
        line-height:1.6;
        ">

        🟠＝教育中<br>

        👨‍🏫＝教育担当

        </p>

    `;



    whiteboard.innerHTML =
        html;


}
