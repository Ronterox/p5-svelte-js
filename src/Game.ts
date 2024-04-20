import { Bodies, Body, Bounds, Composite, Engine, Runner, type IChamferableBodyDefinition } from 'matter-js';
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

type Game = { table: Table, playerSticks: PlayerStick[], balls: Ball[]};

let engine = Engine.create();
let boxes: Body[] = [];
let toRemove: number[] = [];

function Box(x: number, y: number, w: number, h: number, options?: IChamferableBodyDefinition): Body {
    let body = Bodies.rectangle(x, y, w, h, options);
    Composite.add(engine.world, body); // Adds the body to the world
    return body;
}

function BoxSize(bounds: Bounds): { w: number, h: number } {
    const { min, max } = bounds;
    return { w: max.x - min.x, h: max.y - min.y };
}

export default (p: P5) => {
    p.mouseDragged = () => {
        boxes.push(Box(p.mouseX, p.mouseY, 50, 50));
    }
    p.setup = () => {
        p.createCanvas(800, 640);
        p.background(0);

        boxes.push(Box(p.width / 2, p.height - 20, p.width, 20, { isStatic: true }));
        Runner.run(engine); // Runs the physics engine on the background
    };
    p.draw = () => {
        p.background(27);
        boxes.forEach((box, i) => {
            if (box.position.y > p.height || box.position.x < 0 || box.position.x > p.width) {
                Composite.remove(engine.world, box);
                toRemove.push(i);
            }
            const { w, h } = BoxSize(box.bounds);
            p.push();
            // set x, y to the center of the rectangle since matter.js uses
            // the center of but p5.js uses the top-left corner
            p.rectMode(p.CENTER);
            p.translate(box.position.x, box.position.y);
            p.rotate(box.angle);
            p.rect(0, 0, w, h);
            p.pop();
        });

        toRemove.forEach(i => { boxes.splice(i, 1); });
        toRemove.length = 0;
    };
};
