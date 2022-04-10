const boardX = 60, boardY = 25;
const dirKeys = {
    ArrowUp: [-1, 0],
    ArrowDown: [1, 0],
    ArrowLeft: [0, -1],
    ArrowRight: [0, 1]
};
const el = tag => document.createElement(tag);
const $ = tag => document.querySelector(tag);
const $A = tag => [...document.querySelectorAll(tag)];
const rand = n => Math.floor(Math.random() * n);
const board = [...Array(boardY)].map(a => ([...Array(boardX)].map(() => 0)));
const snake = [[Math.round(boardY / 2), Math.round(boardX / 2)]];
let speed = 0;
let ateApple = false;
let autoMode = false;
let dir = [-1, 0];
let moveQueue, apple;


const renderBoard = () => {
    const html = el('div');
    html.classList.add('game');
    board.forEach((a, y) => {
        const row = el('div');
        row.classList.add('row');
        a.forEach((_, x) => {
            const block = el('span');
            block.setAttribute('id', `y${y}-x${x}`)
            row.appendChild(block);
            snake.some(([m, n]) => m === y && n === x) && block.classList.add('solid')
        });
        html.appendChild(row);
    });
    $('main').appendChild(html)
};

const dropApple = () => {
    apple = [rand(boardY), rand(boardX)];
    while (snake.some(([a, b]) => a === apple[0] && b === apple[1])) {
        apple = [rand(boardY), rand(boardX)]
    };
    const location = $('.game').children[apple[0]].children[apple[1]];
    location.textContent = '🍎';
}

const motion = () => {
    moveQueue && clearInterval(moveQueue);
    moveQueue = setInterval(move, 250 - speed);
}

const move = () => {
    const [[y, x]] = snake;
    autoMode && autoSteer();
    const next = [(y + dir[0] + boardY) % boardY, (x + dir[1] + boardX) % boardX];
    snake.unshift(next);
    !ateApple && snake.splice(-1);
    ateApple = false;
    updateSnake();
    if (apple[0] === next[0] && apple[1] === next[1]) {
        $(`#y${apple[0]}-x${apple[1]}`).textContent = ''
        dropApple();
        ateApple = true;
        speed += 10;
        $('.score').textContent = speed;
        motion();
    }
}

const updateSnake = () => {
    $A('.solid').forEach(a => a.classList.remove('solid'));
    snake.forEach(([y, x]) => $('.game').children[y].children[x].classList.add('solid'));
}

const autoSteer = () => {
    const [aY, aX] = apple;
    const [sY, sX] = snake[0]
    if (aY !== sY) return changeDir({ key: aY < sY ? 'ArrowUp' : 'ArrowDown' });
    if (aX !== sX) return changeDir({ key: aX < sX ? 'ArrowLeft' : 'ArrowRight' });
}

renderBoard();
dropApple();
motion();

const changeDir = (e) => {
    if (!dirKeys[e.key]) return
    if (!(dirKeys[e.key][0] + dir[0]) || !(dirKeys[e.key][1] + dir[1])) return
    dir = dirKeys[e.key];
}

document.addEventListener('keyup', changeDir);

$("button").addEventListener("click", () => {
    autoMode = !autoMode;
    $(".auto").textContent = autoMode ? 'ON' : 'OFF'
});