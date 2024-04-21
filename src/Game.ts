import { Bodies, Body, Composite, Engine, Runner } from 'matter-js';
import P5 from 'p5';

type Size = Area | Radius;
type Position = { x: number, y: number };

type Area = { w: number, h: number };
type Radius = { r: number };

type Color = 'yellow' | 'blue' | 'red' | 'purple' | 'orange' | 'green' | 'brown' | 'black' | 'white';
type Angle = number;

type Sprite = { position: Position, size: Size, color: Color };

type BallType = 'solid' | 'striped' | 'black' | 'white';
type Ball = { sprite: Sprite, body: Body, ballType: BallType };
type PlayerStick = { sprite: Sprite, body: Body, angle: Angle };

type Hole = { sprite: Sprite, balls: Ball[] };
type Table = { sprite: Sprite, holes: Hole[] };

type PlayerId = number;
type GameState = { whiteBall: Ball, playerTurn: PlayerId };
type Game = { table: Table, players: PlayerStick[], balls: Ball[], state: GameState };

const engine = Engine.create({ gravity: { y: 0 } });

function createBody({ x, y }: Position, size: Size): Body {
    const { w, h, r } = size as Area & Radius;
    const body = r ? Bodies.circle(x, y, r) : Bodies.rectangle(x, y, w, h);
    Composite.add(engine.world, body);
    return body;
}

function createBalls({ width, height }: P5): Ball[] {
    const balls: Ball[] = [];
    const colors: Color[] = ['yellow', 'blue', 'red', 'purple', 'orange', 'green', 'brown'];
    let line = 5, color_i = 0;
    while (line > 0) {
        const r = 20;
        const size = { r };
        const x = width * 0.5 + (1 - line) * r;
        const y = height * 0.5 - line * r * 2;
        for (let i = 0; i < line; i++) {
            const ballType = i % 2 === 0 ? 'solid' : 'striped';
            const position = { x: x + i * r * 2, y };
            const color = colors[color_i];
            const body = createBody(position, size);
            balls.push({ sprite: { position, size, color }, body, ballType });
            color_i = (color_i + 1) % colors.length;
        }
        line--;
    }
    const lastball = balls[balls.length - 1];
    lastball.sprite.color = lastball.ballType = 'black';
    return balls;
}

function createTable({ width, height }: P5): Table {
    const size: Radius = { r: 25 };
    const color: Color = 'black';
    const posr = size.r * 1.5;
    const hole = (x: number, y: number) => ({ sprite: { position: { x, y }, size, color }, balls: [] });
    return {
        sprite: { position: { x: width * 0.5, y: height * 0.5 }, size: { w: width * 0.9, h: height * 0.8 }, color: 'green' },
        holes: [
            hole(size.r, posr),
            hole(width - size.r, posr),
            hole(size.r, height - posr),
            hole(width - posr, height - posr),
            hole(width * 0.5, posr),
            hole(width * 0.5, height - posr)
        ]
    }
}

function createPlayers(p: P5, num: number): PlayerStick[] {
    let players: PlayerStick[] = [];
    for (let i = 0; i < num; i++) {
        players.push({
            sprite: {
                position: { x: p.width * 0.15 + i * p.width * 0.15, y: p.height * 0.5 },
                size: { w: 10, h: p.width * 0.5 },
                color: 'brown'
            },
            body: createBody({ x: p.width * 0.15 + i * p.width * 0.15, y: p.height * 0.5 }, { w: 10, h: p.width * 0.5 }),
            angle: 0
        });
    }
    return players;
}

function startGame(table: Table, balls: Ball[], players: PlayerStick[]): Game {
    Runner.run(engine);
    const { position: { x, y }, size } = balls[balls.length - 1].sprite;
    return {
        table, balls, players,
        state: {
            playerTurn: 0,
            whiteBall: {
                sprite: { position: { x, y: y + y * 0.5 }, color: 'white', size },
                body: createBody({ x, y: y + y * 0.5 }, size),
                ballType: 'white'
            }
        }
    };
}

function turnEnded(game: Game): boolean {

}

function winner(game: Game): boolean {

}

function showWinner(p: P5, game: Game) {

}

function nextTurn(game: Game) {

}

function draw(p: P5, game: Game) {
    const objects = [game.table, ...game.table.holes, game.state.whiteBall, ...game.balls, ...game.players];
    for (let i = 0; i < objects.length; i++) {
        const { position: { x, y }, size, color } = objects[i].sprite;
        p.fill(color);
        if ('body' in objects[i]) {
            const object = objects[i] as Ball | PlayerStick;
            object.sprite.position = object.body.position;
        }
        if ('r' in size) {
            p.ellipse(x, y, size.r * 2);
            if ('ballType' in objects[i]) {
                const ball = objects[i] as Ball;
                if (ball.ballType === 'striped' || ball.ballType === 'black') {
                    p.fill('white');
                    p.ellipse(x, y, size.r * 1.2);
                }
                p.fill('black');
                p.textSize(size.r - 5);
                p.text(i.toLocaleString(undefined, { minimumIntegerDigits: 2 }), x - size.r * 0.5, y + size.r * 0.25);
            }
        }
        else {
            p.rect(x - size.w * 0.5, y - size.h * 0.5, size.w, size.h);
        }
    }
}

let game: Game;
export default (p: P5) => {
    p.mouseMoved = () => {
        const player = game.players[game.state.playerTurn];
        // player.sprite.position = { x: p.mouseX, y: p.mouseY };
        const { x, y } = player.sprite.position;
        const { x: mx, y: my } = { x: p.mouseX, y: p.mouseY };
        Body.setPosition(player.body, { x: x + (mx - x) * 0.1, y: y + (my - y) * 0.1 });
    }
    p.mouseDragged = () => {
        const player = game.players[game.state.playerTurn];
        const { x, y } = player.sprite.position;
        const { y: my } = { y: p.mouseY };
        Body.setPosition(player.body, { x, y: y + (my - y) * 0.1 });
    }
    p.setup = () => {
        p.createCanvas(800, 640);
        const balls = createBalls(p);
        const table = createTable(p);
        const players = createPlayers(p, 1);
        game = startGame(table, balls, players);
        p.loop();
    };
    p.draw = () => {
        p.background(27);
        if (turnEnded(game)) {
            if (winner(game)) {
                p.noLoop();
                showWinner(p, game);
                return;
            }
            nextTurn(game);
        }
        draw(p, game);
    };
};


