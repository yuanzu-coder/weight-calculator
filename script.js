function checkEmpty(values, errors) {
    for(const v of values) {
        if(v === "") {
            errors.push("すべての項目に入力してください");
            break;
        }
    }
    return;
}
function checkNumber(values, errors) {
    for(const v of values) {
        const n = Number(v);
        if(Number.isNaN(n)) {
            errors.push("すべて数値で入力してください");
            break;
        }
    }
    return;
}
function checkWeightRange(value, label, errors) {
    if(value < 20 || value >= 500) {
        errors.push(`「${label}」は20以上500未満の値で入力してください`)
    }
    return;
}
function checkRatioRange(value, errors) {
    if(value < -100 || value >= 100) {
        errors.push(`「１日あたりの減量率」は-100以上100未満の値で入力してください`)
    }
    else if(value == 0) {
        errors.push(`「1日あたりの減量率」に0を入力することはできません`)
    }
    return;
}
function checkDaysRange(value, errors) {
    if(value < 1 || value >= 1000) {
        errors.push(`「減量期間」は1以上999未満の整数値で入力してください`)
    }
    else if(!Number.isInteger(value)) {
        errors.push(`「減量期間」は整数値で入力してください`)
    }
    return;
}
function checkCalc(value, errors) {
    if(!Number.isFinite(value)){
        errors.push("この入力値では計算できませんでした。")
    }
    return;
}

function createRangeValidators(x, y, z, mode, errors) {
    switch(mode) {
        case "01":
            return [
                () => checkWeightRange(x, "現在の体重", errors),
                () => checkWeightRange(y, "目標体重", errors),
                () => checkRatioRange(z, errors)
            ];

        case "02":
            return [
                () => checkWeightRange(x, "現在の体重", errors),
                () => checkRatioRange(y, errors),
                () => checkDaysRange(z, errors)
            ];
        
        case "03":
            return [
                () => checkWeightRange(x, "現在の体重", errors),
                () => checkWeightRange(y, "目標体重", errors),
                () => checkDaysRange(z, errors)
            ];
        
        default: return [];
    }
}
function runRangeValidators(validators) {
    for(const validate of validators) {
        validate();
    }
    return;
}

function makeDailyGoals(currentWeight, goalWeight, reduceRatio, numberDays) {
    let goals = [];

    goals.push("---１日ごとの目標---")

    const ceiledNumberDays = Math.ceil(numberDays);

    for(let i = 0; i <= ceiledNumberDays; i += 1) {
        const weight = currentWeight * Math.pow(((100.0 - reduceRatio) / 100.0), i)

        if(i === 0) {
            goals.push(`${String(0).padStart(4, " ")}日目： ${currentWeight.toFixed(2).padStart(6, " ")}[kg]（現在の体重）`);
        }
        else if(i === ceiledNumberDays) {
            goals.push(`${String(ceiledNumberDays).padStart(4, " ")}日目： ${goalWeight.toFixed(2).padStart(6, " ")}[kg]（最終目標）`);
        }
        else {
            goals.push(`${String(i).padStart(4, " ")}日目： ${weight.toFixed(2).padStart(6, " ")}[kg]`);
        }
    }

    return goals;
}

//日数計算モード
function printUI01() {
    const ui = document.getElementById("UI");
    
    ui.innerHTML = `
        <h2>目標達成までにかかる日数を計算します</h2>

        <p>
            現在の体重 [kg]：
            <input type="text" id="currentWeight">
        </p>

        <p>
            目標体重 [kg]：
            <input type="text" id="goalWeight">
        </p>

        <p>
            １日あたりの減量率 [%]：
            <input type="text" id="reduceRatio">
        </p>

        <button onclick="calc01()">計算する</button>

        <p id="result"></p>
        <p id="dailyGoals" style="font-family: monospace; white-space: pre;"></p>
    `;
}
function calc01() {
    const result =  document.getElementById("result");
    result.textContent = "";  
    let errors = [];

    const cw = document.getElementById("currentWeight").value;
    const gw = document.getElementById("goalWeight").value;
    const rr = document.getElementById("reduceRatio").value;

    checkEmpty([cw, gw, rr], errors)
    if(errors.length > 0) {
        result.innerHTML = errors.join("<br>");
        return;
    }

    checkNumber([cw, gw, rr], errors);
    if(errors.length > 0) {
        result.innerHTML = errors.join("<br>");
        return;
    }

    const currentWeight = Number(cw);
    const goalWeight = Number(gw);
    const reduceRatio = Number(rr);

    const validators = createRangeValidators(currentWeight, goalWeight, reduceRatio, "01", errors);
    runRangeValidators(validators);
    if(errors.length > 0) {
        result.innerHTML = errors.join("<br>");
        return;
    }
    
    const numberDays = Math.log(goalWeight / currentWeight) / Math.log((100.0 - reduceRatio) / 100.0);

    checkCalc(numberDays, errors);
    if(errors.length > 0) {
        result.innerHTML = errors.join("<br>");
        return;
    }

    result.textContent =
        `目標達成に必要な減量期間は ${Math.ceil(numberDays)}[日] です`;

    const dailyGoals = document.getElementById("dailyGoals")
    dailyGoals.innerHTML = makeDailyGoals(currentWeight, goalWeight, reduceRatio, numberDays).join("\n");
}

//最終体重計算モード
function printUI02() {
    const ui = document.getElementById("UI");

    ui.innerHTML = `
        <h2>減量後の体重[kg]を計算します</h2>

        <p>
            現在の体重 [kg]：
            <input type="text" id="currentWeight">
        </p>

        <p>
            １日あたりの減量率 [%]：
            <input type="text" id="reduceRatio">
        </p>

        <p>
            減量期間 [日]：
            <input type="text" id="numberDays">
        </p>

        <button onclick="calc02()">計算する</button>

        <p id="result"></p>
        <p id="dailyGoals" style="font-family: monospace; white-space: pre;"></p>
    `;
}
function calc02() {
    const result =  document.getElementById("result");
    result.textContent = "";

    let errors = [];

    const cw = document.getElementById("currentWeight").value;
    const rr = document.getElementById("reduceRatio").value;
    const nd = document.getElementById("numberDays").value

    checkEmpty([cw, rr, nd], errors);

    if(errors.length > 0) {
        result.innerHTML = errors.join("<br>");
        return;
    }

    checkNumber([cw, rr, nd], errors);

    if(errors.length > 0) {
        result.innerHTML = errors.join("<br>");
        return;
    }

    const currentWeight = Number(cw);
    const reduceRatio = Number(rr);
    const numberDays = Number(nd);

    const validators = createRangeValidators(currentWeight, reduceRatio, numberDays, "02", errors);
    runRangeValidators(validators);

    if(errors.length > 0) {
        result.innerHTML = errors.join("<br>");
        return;
    }
    
    const goalWeight = currentWeight * Math.pow((100.0 - reduceRatio) / 100.0, numberDays);

    checkCalc(goalWeight, errors);
    if(errors.length > 0) {
        result.innerHTML = errors.join("<br>");
        return;
    }

    result.textContent =
        `この計画での最終体重は ${goalWeight.toFixed(2)}[kg] です`;  

    const dailyGoals = document.getElementById("dailyGoals")
    dailyGoals.innerHTML = makeDailyGoals(currentWeight, goalWeight, reduceRatio, numberDays).join("\n");
}

//減量率計算モード
function printUI03() {
    const ui = document.getElementById("UI");
    
    ui.innerHTML = `
        <h2>１日あたりの減量率[%]を計算します</h2>

        <p>
            現在の体重 [kg]：
            <input type="text" id="currentWeight">
        </p>

        <p>
            目標体重 [kg]：
            <input type="text" id="goalWeight">
        </p>

        <p>
            減量期間 [日]：
            <input type="text" id="numberDays">
        </p>

        <button onclick="calc03()">計算する</button>

        <p id="result"></p>
        <p id="dailyGoals" style="font-family: monospace; white-space: pre;"></p>
    `;
}
function calc03() {
    const result =  document.getElementById("result");
    result.textContent = "";

    let errors = [];

    const cw = document.getElementById("currentWeight").value;
    const gw = document.getElementById("goalWeight").value;
    const nd = document.getElementById("numberDays").value;

    checkEmpty([cw, gw, nd], errors);

    if(errors.length > 0) {
        result.innerHTML = errors.join("<br>");
        return;
    }

    checkNumber([cw, gw, nd], errors);

    if(errors.length > 0) {
        result.innerHTML = errors.join("<br>");
        return;
    }

    const currentWeight = Number(cw);
    const goalWeight = Number(gw);
    const numberDays = Number(nd);

    const validators = createRangeValidators(currentWeight, goalWeight, numberDays, "03", errors);
    runRangeValidators(validators);

    if(errors.length > 0) {
        result.innerHTML = errors.join("<br>");
        return;
    }

    const reduceRatio = 100.0 - 100.0 * Math.pow(goalWeight / currentWeight, 1.0 / numberDays);

    checkCalc(reduceRatio, errors);
    if(errors.length > 0) {
        result.innerHTML = errors.join("<br>");
        return;
    }

    result.textContent =
        `目標達成のために必要な１日あたりの減量率は ${reduceRatio.toFixed(2)}[%] です`;

    const dailyGoals = document.getElementById("dailyGoals")
    dailyGoals.innerHTML = makeDailyGoals(currentWeight, goalWeight, reduceRatio, numberDays).join("\n");
}
