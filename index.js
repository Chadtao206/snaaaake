const boardX = 60;
const boardY = 25;
const el = tag => document.createElement(tag);
const $ = tag => document.querySelector(tag);
const $A = tag => [...document.querySelectorAll(tag)];
const rand = n => Math.floor(Math.random() * n);
const log = s => console.log(s);
const board = [...Array(boardY)].map(a => ([...Array(boardX)].map(() => 0)));
const snake = [[Math.round(boardY / 2), Math.round(boardX / 2)]];
let speed = 0;

//directions
// N - -1,0 E - 0,1 S - 1,0 W - 0, -1
let dir = [-1, 0];
let moveQueue = null;


const renderBoard = () => {
    const html = el('div');
    html.classList.add('game');
    board.forEach((a, y) => {
        const row = el('div');
        row.classList.add('row');
        a.forEach((_, x) => {
            const block = el('span');
            block.setAttribute('data-x', x);
            block.setAttribute('data-y', y);
            row.appendChild(block);
            snake.some(([m, n]) => m === y && n === x) && block.classList.add('solid')
        });
        html.appendChild(row);
    });
    $('main').appendChild(html)
};

const dropApple = () => {
    let apple = [rand(boardY), rand(boardX)];
    while (snake.some(([a, b]) => a === apple[0] && b === apple[1])) {
        apple = [rand(boardY), rand(boardX)]
    };
    log($('.game').children[apple[0]].children[apple[1]]);
    const location = $('.game').children[apple[0]].children[apple[1]];
    location.textContent = '🍎';
}

const motion = () => {
    moveQueue && clearInterval(moveQueue);
    moveQueue = setInterval(move, 1000 - speed);
}

const move = () => {
    const [[y, x]] = snake;
    snake.unshift([(y + dir[0] + boardY) % boardY, (x + dir[1] + boardX) % boardX]);
    snake.splice(-1);
    updateSnake()
}

const updateSnake = () => {
    $A('.solid').forEach(a => a.classList.remove('solid'));
    log(snake)
    snake.forEach(([y,x])=> {
        const location = $('.game').children[y].children[x];
        location.classList.add('solid')
    })
}



renderBoard();
dropApple();
motion();