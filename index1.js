



let jugs = [
    {
        currentValueHTML: document.querySelector('#volume-3L'),
        currentWaterHighetOrLevelHTML: document.querySelector("#L3 .water"),
        currentValue: 0,
        maxValue: 3
    },
    {
        currentValueHTML: document.querySelector('#volume-5L'),
        currentWaterHighetOrLevelHTML: document.querySelector("#L5 .water"),
        currentValue: 0,
        maxValue: 5
    },
    {
        currentValueHTML: document.querySelector('#volume-8L'),
        currentWaterHighetOrLevelHTML: document.querySelector("#L8 .water"),
        currentValue: 0,
        maxValue: 8
    }
];

let resultHTML = document.querySelector("#result");



function updateJugUI() {
    jugs.forEach(jug => {
        if (jug.currentValueHTML) {
            jug.currentValueHTML.textContent = `${jug.currentValue}L`;
        }

        if (jug.currentWaterHighetOrLevelHTML) {
            const percent = (jug.currentValue / jug.maxValue) * 100;
            jug.currentWaterHighetOrLevelHTML.style.height = `${percent}%`;
        }
    });
}

function applyState(state) {
    for (let i = 0; i < jugs.length; i++) {
        jugs[i].currentValue = state[i];
    }
    updateJugUI();
}

function getCurrentState() {
    return jugs.map(jug => jug.currentValue);
}

function stateKey(state) {
    return state.join(",");
}

function isGoal(state) {
    return state.includes(4);
}

function formatState(state) {
    return `[${state.join(", ")}]`;
}

function actionLabel(action) {
    if (action.type === "fill") {
        return `fill(${jugs[action.x].maxValue}L)`;
    }

    if (action.type === "empty") {
        return `empty(${jugs[action.x].maxValue}L)`;
    }

    if (action.type === "pour") {
        return `pour(${jugs[action.x].maxValue}L, ${jugs[action.y].maxValue}L)`;
    }

    return "start";
}

function fillState(state, x) {
    if (state[x] === jugs[x].maxValue) return null;

    const newState = [...state];
    newState[x] = jugs[x].maxValue;
    return newState;
}

function emptyState(state, x) {
    if (state[x] === 0) return null;

    const newState = [...state];
    newState[x] = 0;
    return newState;
}

function pourState(state, x, y) {
    if (x === y) return null;
    if (state[x] === 0) return null;
    if (state[y] === jugs[y].maxValue) return null;

    const newState = [...state];
    const freeSpace = jugs[y].maxValue - newState[y];
    const amount = Math.min(newState[x], freeSpace);

    newState[x] -= amount;
    newState[y] += amount;

    return newState;
}

function getNextStates(state) {
    const nextStates = [];

    for (let i = 0; i < jugs.length; i++) {
        const filled = fillState(state, i);
        if (filled) {
            nextStates.push({
                state: filled,
                action: { type: "fill", x: i }
            });
        }

        const emptied = emptyState(state, i);
        if (emptied) {
            nextStates.push({
                state: emptied,
                action: { type: "empty", x: i }
            });
        }
    }

    for (let i = 0; i < jugs.length; i++) {
        for (let j = 0; j < jugs.length; j++) {
            const poured = pourState(state, i, j);
            if (poured) {
                nextStates.push({
                    state: poured,
                    action: { type: "pour", x: i, y: j }
                });
            }
        }
    }

    return nextStates;
}

function dfs(startState) {
    const visited = new Set();
    const stack = [];

    stack.push({
        state: startState,
        path: []
    });

    while (stack.length > 0) {
        const current = stack.pop();
        const key = stateKey(current.state);

        if (visited.has(key)) {
            continue;
        }

        visited.add(key);

        if (isGoal(current.state)) {
            return current.path;
        }

        const nextStates = getNextStates(current.state);

        for (let i = nextStates.length - 1; i >= 0; i--) {
            const next = nextStates[i];
            const nextKey = stateKey(next.state);

            if (!visited.has(nextKey)) {
                stack.push({
                    state: next.state,
                    path: [...current.path, next.action]
                });
            }
        }
    }

    return null;
}

function bfs(startState) {
    const visited = new Set();
    const queue = [];

    queue.push({
        state: startState,
        path: []
    });

    visited.add(stateKey(startState));

    while (queue.length > 0) {
        const current = queue.shift();

        if (isGoal(current.state)) {
            return current.path;
        }

        const nextStates = getNextStates(current.state);

        for (const next of nextStates) {
            const key = stateKey(next.state);

            if (!visited.has(key)) {
                visited.add(key);
                queue.push({
                    state: next.state,
                    path: [...current.path, next.action]
                });
            }
        }
    }

    return null;
}

function applyActionToJugs(action) {
    if (action.type === "fill") {
        jugs[action.x].currentValue = jugs[action.x].maxValue;
    }

    else if (action.type === "empty") {
        jugs[action.x].currentValue = 0;
    }

    else if (action.type === "pour") {
        const fromJug = jugs[action.x];
        const toJug = jugs[action.y];

        const freeSpace = toJug.maxValue - toJug.currentValue;
        const amount = Math.min(fromJug.currentValue, freeSpace);

        fromJug.currentValue -= amount;
        toJug.currentValue += amount;
    }

    updateJugUI();
}

function playSolutionActions(actions, delay = 1500) {
    if (!actions) {
        resultHTML.textContent = "No solution found.";
        return;
    }

    applyState([0, 0, 0]);
    resultHTML.innerHTML = "";

    let step = 0;

    const startDiv = document.createElement("div");
    startDiv.textContent = `Start -> ${formatState(getCurrentState().reverse())}`;
    startDiv.style.marginBottom = "10px";
    startDiv.style.padding = "10px";
    startDiv.style.borderRadius = "8px";
    startDiv.style.backgroundColor = "rgba(255, 255, 255, 0.1)";
    startDiv.style.color = "white";
    startDiv.style.fontFamily = "monospace";

    resultHTML.appendChild(startDiv);

    function runStep() {
        if (step >= actions.length) {
            const goalDiv = document.createElement("div");
            goalDiv.textContent = `Goal reached -> ${formatState(getCurrentState().reverse())}`;
            goalDiv.style.marginTop = "10px";
            goalDiv.style.padding = "10px";
            goalDiv.style.borderRadius = "8px";
            goalDiv.style.backgroundColor = "rgba(255, 255, 255, 0.15)";
            goalDiv.style.color = "white";
            goalDiv.style.fontFamily = "monospace";

            resultHTML.appendChild(goalDiv);
            return;
        }

        const action = actions[step];
        applyActionToJugs(action);

        const stepDiv = document.createElement("div");
        stepDiv.textContent = `${step + 1}. ${actionLabel(action)} -> ${formatState(getCurrentState().reverse())}`;
        stepDiv.style.marginBottom = "10px";
        stepDiv.style.padding = "10px";
        stepDiv.style.borderRadius = "8px";
        stepDiv.style.backgroundColor = "rgba(255, 255, 255, 0.1)";
        stepDiv.style.color = "white";
        stepDiv.style.fontFamily = "monospace";

        resultHTML.appendChild(stepDiv);

        step++;
        setTimeout(runStep, delay);
    }

    setTimeout(runStep, delay);
}


function playDFS(){

    const startState = [0, 0, 0];
    applyState(startState);

    const solutionActions = dfs(startState);
    playSolutionActions(solutionActions, 1200);

}

function playBFS(){

    const startState = [0, 0, 0];
    applyState(startState);

    const solutionActions = bfs(startState);
    playSolutionActions(solutionActions, 1200);

}


