import { Option, none, some } from 'fp-ts/lib/Option'
import { pipe } from 'fp-ts/lib/pipeable'
import * as O from 'fp-ts/lib/Option'
import { head } from 'fp-ts/lib/Array'
import { sequenceT } from 'fp-ts/lib/Apply';

class Point {
    readonly x: number;
    readonly y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }
}

function dist_points(p0 : Point, p1 : Point) : number {
    let diff_x = p0.x - p1.x;
    let diff_y = p0.y - p1.y;
    return Math.sqrt(diff_x * diff_x + diff_y * diff_y);
}

class DrawingApp {

    private canvas: HTMLCanvasElement;
    private context: CanvasRenderingContext2D;
    private paint: boolean = false;

    private clickX: number[] = [];
    private clickY: number[] = [];
    private clickDrag: boolean[] = [];
    readonly init_point_radius = 8;

    private uiDrawPoints: [Point, boolean][] = [];

    private uiCurrentLoopSegment: Point[] = [];
    private uiEngagedPoint: Option<Point> = none;

    constructor() {
        let canvas = document.getElementById('canvas') as
            HTMLCanvasElement;
        let context = canvas.getContext('2d');

        if (context === null) {
            throw 'Fatal error: Unable to fetch a canvas context, this should not happend at all, maybe there is a problem with the browser';
        }

        context.lineCap = 'round';
        context.lineJoin = 'round';
        context.strokeStyle = 'black';
        context.lineWidth = 1;

        this.canvas = canvas;
        this.context = context;

        this.redraw();
        this.createUserEvents();
    }

    private createUserEvents() {
        let canvas = this.canvas;

        canvas.addEventListener("mousedown", this.pressEventHandler);
        canvas.addEventListener("mousemove", this.dragEventHandler);
        canvas.addEventListener("mouseup", this.releaseEventHandler);
        canvas.addEventListener("mouseout", this.cancelEventHandler);

        canvas.addEventListener("touchstart", this.pressEventHandler);
        canvas.addEventListener("touchmove", this.dragEventHandler);
        canvas.addEventListener("touchend", this.releaseEventHandler);
        canvas.addEventListener("touchcancel", this.cancelEventHandler);

        let clear_button = document.getElementById('clear');
        if (clear_button === null) {
            throw 'Fatal error: Unable to find the clear button in the DOM';
        }
        clear_button.addEventListener("click", this.clearEventHandler);
    }

    private draw_point(p : Point, fillColor : string, radius : number) {
        this.context.save();
        this.context.fillStyle = fillColor;
        this.context.beginPath();
        this.context.arc(p.x, p.y, radius, 0, 2*Math.PI);
        this.context.fill();
        this.context.closePath();
        this.context.restore();
    }

    private draw_current_loop() {
        const move_ctx_to = (p:  Point) => { this.context.moveTo(p.x, p.y) };
        const line_to_ctx = (p:  Point) => { this.context.lineTo(p.x, p.y) };

        if (this.uiCurrentLoopSegment.length > 0) {
            this.context.beginPath();
            move_ctx_to(this.uiCurrentLoopSegment[0])
            for (let i = 1; i < this.uiCurrentLoopSegment.length; ++i) {
                line_to_ctx(this.uiCurrentLoopSegment[i]);
                move_ctx_to(this.uiCurrentLoopSegment[i]);
            }
            pipe(this.uiEngagedPoint, O.map(line_to_ctx));
            this.context.stroke();
            this.context.closePath();
        }
    }

    private redraw() {
        console.log('redraw');
        console.log(this.uiCurrentLoopSegment.length)
        this.clearCanvas();

        this.draw_current_loop();
        pipe(head(this.uiCurrentLoopSegment), O.map((p : Point) => { this.draw_point(p, 'green', this.init_point_radius); }));
        const override_init_point = ([init_point, current_pos] : [Point, Point]) => {
            if (dist_points(init_point, current_pos) < this.init_point_radius) {
                this.draw_point(init_point, 'yellow', this.init_point_radius * 1.2);
            }
        };
        pipe(sequenceT(O.option)(head(this.uiCurrentLoopSegment), this.uiEngagedPoint), O.map(override_init_point));
    }

    private addPoint(p: Point) {
        console.log('addPoint')
        this.uiCurrentLoopSegment.push(p);
    }
    
    private clearCanvas() {
        console.log('clear')
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    private clearEventHandler = () => {
        this.uiCurrentLoopSegment = [];
        this.clearCanvas();
    }
    
    private releaseEventHandler = () => {
        console.log('release')
        pipe(this.uiEngagedPoint, O.map(p => this.addPoint(p)));
        this.uiEngagedPoint = none;
        this.redraw();
    }
    
    private cancelEventHandler = () => {
    }

    private getPositionInCanvas(e : MouseEvent | TouchEvent) : Point {
        let mouseX = (e as TouchEvent).changedTouches ?
                     (e as TouchEvent).changedTouches[0].pageX :
                     (e as MouseEvent).pageX;
        let mouseY = (e as TouchEvent).changedTouches ?
                     (e as TouchEvent).changedTouches[0].pageY :
                     (e as MouseEvent).pageY;
        mouseX -= this.canvas.offsetLeft;
        mouseY -= this.canvas.offsetTop;
        
        return new Point(mouseX, mouseY);
    }

    private pressEventHandler = (e: MouseEvent | TouchEvent) => {
        console.log('press')
        this.uiEngagedPoint = some(this.getPositionInCanvas(e));
        this.redraw();
    }
    
    private dragEventHandler = (e: MouseEvent | TouchEvent) => {
        console.log('drag')
        if (pipe(this.uiEngagedPoint, O.exists(_ => true))) {
            this.uiEngagedPoint = some(this.getPositionInCanvas(e));
            this.redraw();
        }
        e.preventDefault();
    }

}

new DrawingApp();