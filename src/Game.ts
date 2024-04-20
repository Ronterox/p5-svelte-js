import { Bodies, Body, Composite, Engine, Runner, type IChamferableBodyDefinition } from 'matter-js';
import P5 from 'p5';

type Position = { x: number, y: number };
type Size = { w: number, h: number } | { r: number };
type Color = string;
type Angle = number;

type BallType = 'solid' | 'striped' | 'black' | 'white';
type Ball = { position: Position, size: Size, color: Color, stripe: BallType };
type PlayerStick = { position: Position, size: Size, color: Color, angle: Angle };

type Hole = { position: Position, size: Size, balls: Ball[] };
type Table = { position: Position, size: Size, color: Color, holes: Hole[] };

type PlayerId = number;
type GameState = unknown;
type Game = { table: Table, players: PlayerStick[], playerTurn: PlayerId, balls: Ball[], state: GameState };

let engine = Engine.create();

function Box(x: number, y: number, w: number, h: number, options?: IChamferableBodyDefinition): Body {
    let body = Bodies.rectangle(x, y, w, h, options);
    Composite.add(engine.world, body); // Adds the body to the world
    return body;
}

function createBalls(p: P5): Ball[] {

}

function createTable(p: P5): Table {

}

function createPlayers(p: P5, num: number): PlayerStick[] {

}

function startGame(table: Table, balls: Ball[], players: PlayerStick[]): Game {

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

}

let game: Game;
export default (p: P5) => {
    p.setup = () => {
        p.createCanvas(800, 640);
        let balls = createBalls(p);
        let table = createTable(p);
        let players = createPlayers(p, 2);
        game = startGame(table, balls, players);
        Runner.run(engine);
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


