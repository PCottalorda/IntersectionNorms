import { Option, none, some } from 'fp-ts/lib/Option'
import { pipe } from 'fp-ts/lib/pipeable'
import * as O from 'fp-ts/lib/Option'
import Flatten from 'flatten-js'
import * as A from 'fp-ts/lib/Array';
import * as Ord from 'fp-ts/lib/Ord';
import { flatten } from 'fp-ts/lib/Array'
import {} from 'cytoscape'

///===---------------------------------------------------------------------------------------------
///===--- Intersection norm computation algorithms ------------------------------------------------
///===---------------------------------------------------------------------------------------------

class MultiLinkGraphRepresentation {

}


///===---------------------------------------------------------------------------------------------


// Lightweight class that represents a "cutted edge" in the manifold in the context
// of the DrawingApp
class Edge {

    public index : number;

    constructor(index : number) {
        this.index = index;
    }

    readonly equals = (x : Edge, y : Edge) : boolean => { return x == y; }

}

// Ligtweight class that represents the projected edges -which appears twice- corresponding
// to the cutted edge in the manifold in the context of the DrawingApp
class UIEdge {

    public segment : Flatten.Segment;
    public edge_index : number;
    public ui_edge_index : number;

    constructor(p0 : Flatten.Point, p1 : Flatten.Point, edge_index : number, ui_edge_index : number) {
        this.segment = Flatten.segment(p0, p1);
        this.edge_index = edge_index;
        this.ui_edge_index = ui_edge_index;
    }

}

class UIOut {
    readonly kind = "UIOut";    
};

class UIIn {

    readonly kind = "UIIn";

    public position : Flatten.Point;

    readonly equals = (x : UIIn, y : UIIn) : boolean => { return x === y }
    
    constructor(position : Flatten.Point) {
        this.position = position;
    }

    public point() : Flatten.Point {
        return this.position;
    }
}

class UIOnEdge {

    readonly kind = "UIOnEdge";

    public ui_edge : UIEdge;
    public position_on_edge : number;

    readonly equals = (x : UIOnEdge, y : UIOnEdge) : boolean => { return x === y }

    static range_min : number = 0.01;
    static range_max : number = 0.99;

    constructor(ui_edge : UIEdge, position_on_edge : number) {
        this.ui_edge = ui_edge;
        this.position_on_edge = position_on_edge;
        if (!Ord.between(Ord.ordNumber)(UIOnEdge.range_min, UIOnEdge.range_max)(position_on_edge)) {
            throw 'Trying to create an UIOnEdge object with position on edge not between 0.01 and 0.09';
        }
    }
    
    public point() : Flatten.Point {
        const s = this.ui_edge.segment;
        console.log("UIOnEdge.point: position_on_edge:", this.position_on_edge, " seg.length:", s.length);
        return s.ps.translate(s.tangentInStart().multiply(s.length).multiply(this.position_on_edge));
    }

};

class OnEdge {
    readonly kind = "OnEdge";

    private edge : Edge;
    private position_on_edge : number;

    readonly equals = (x : OnEdge, y : OnEdge) : boolean => { return x === y }
    
    constructor(edge : Edge, position_on_edge : number) {
        this.edge = edge;
        this.position_on_edge = position_on_edge;
        if (!Ord.between(Ord.ordNumber)(UIOnEdge.range_min, UIOnEdge.range_max)(position_on_edge)) {
            throw 'Trying to create an UIOnEdge object with position on edge not between 0.01 and 0.09';
        }
    }
}

type UICanvasPosition = UIOut | UIIn | UIOnEdge;
type UIManifoldPosition = UIIn | UIOnEdge;
type ManifoldPosition = UIIn | OnEdge;

class UIManifoldSegment {

    public ps : UIManifoldPosition;
    public pe : UIManifoldPosition;

    constructor(ps : UIManifoldPosition, pe : UIManifoldPosition) {
        this.ps = ps;
        this.pe = pe;
    }
}


class UICurrentLoop {

    public start_point : UIIn;
    public segments : UIManifoldSegment[] = [];
    public last_point : UIManifoldPosition;

    private m_point_equality : (p : UIManifoldPosition, q : UIManifoldPosition) => boolean;
    private error_logger : (msg : string, color : string) => void;
    private brother_edge_pos : (e : UIOnEdge) => UIOnEdge;

    constructor( p : UIIn
               , m_point_equality : (p : UIManifoldPosition, q : UIManifoldPosition) => boolean
               , error_logger : (msg : string, color : string) => void
               , brother_edge_pos : (e : UIOnEdge) => UIOnEdge)
    {
        console.log("Init new current loop");
        console.trace();
        this.start_point = p;
        this.last_point = p;
        this.m_point_equality = m_point_equality;
        this.error_logger = error_logger;
        this.brother_edge_pos = brother_edge_pos;
    }
    
    public addPoint(p : UIManifoldPosition) : boolean {
        console.log("===--------- UICurrentLoop.addPoint ----------------------");
        console.trace();
        if (this.m_point_equality(this.start_point, p)) {
            this.error_logger("You tried to add the same point twice in a row, no addition have been done", "warning");
            return false;
        } else {
            switch(p.kind) {
                case "UIOnEdge" : switch(this.last_point.kind) { 
                    case "UIOnEdge" : if (p.ui_edge.edge_index == this.last_point.ui_edge.edge_index) {
                        this.error_logger("You tried to add a point on the same edge as the precedent, please click inside the manifold and returns to the edge", "red");
                        return false;
                    }
                }
            }
            console.log("!!!!!!!!!!!!!!!!!!! Swoosh");
            this.segments.push(new UIManifoldSegment(this.last_point, p));
            switch(p.kind) {
                case "UIOnEdge" : this.last_point = this.brother_edge_pos(p); break;
                case "UIIn"     : this.last_point = p; break;
            }
            console.log("!!!!!!!!!!!!!!!!!!! Swoosh");
            return true;
        }
    }

    public closeLoop() : Option<UIManifoldSegment[]> {
        if (this.m_point_equality(this.start_point, this.last_point)) {
            if (this.segments.length < 2) {
                return none;
            } else {
                return some(this.segments); 
            }
        } else {
            if (this.segments.length < 1) {
                return none;
            } else {
                let loop = this.segments;
                loop.push(new UIManifoldSegment(this.last_point, this.start_point));
                return some(loop);
            }
        }
    }
    
}












class DrawingApp {

    private canvas: HTMLCanvasElement;
    private context: CanvasRenderingContext2D;
    private paint: boolean = false;

    private clickX: number[] = [];
    private clickY: number[] = [];
    private clickDrag: boolean[] = [];
    
    readonly init_point_radius = 8;
    readonly stick_edge_distance = 20;
    readonly ui_dim = 500;
    readonly ui_base_circle_radius = this.ui_dim * 0.9 / 2;
    
    private genus: number = 2;  // Used to ensure that an integer is entered

    private ui_stacked_loops: UIManifoldSegment[][] = [];

    private ui_edge_matcher : number[];
    private edges_list : Edge[];
    private ui_manifold_polygon_edges : UIEdge[];
    private ui_manifold_polygon : Flatten.Polygon;

    // Logical edges are an index from 1 to 2*genus;

    private ui_curr_loop : Option<UICurrentLoop> = none;
    //private uiEngagedPoint: Option<Flatten.Point> = none;
    private ui_curr_position : Option<UICanvasPosition> = none;

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
        this.ui_edge_matcher = [];
        this.edges_list = [];
        this.ui_manifold_polygon_edges = [];
        this.ui_manifold_polygon = new Flatten.Polygon();

        this.initialize_edge_list();


        this.redraw();
        this.createUserEvents();
    }

    private initialize_edge_list() {
        // Initialize the manifold UI polygon points
        let ui_polygon_manifold_points : Flatten.Point[] = [];
        for (let i = 0; i < 4 * this.genus; ++i) {
            let angle = (2 * i + 1) * (2*Math.PI) / (8 * this.genus);
            ui_polygon_manifold_points.push(Flatten.point(this.ui_dim / 2 + Math.cos(angle) * this.ui_base_circle_radius, this.ui_dim / 2 - Math.sin(angle) * this.ui_base_circle_radius));
        }
        const mp_size = ui_polygon_manifold_points.length;

        this.edges_list = [];
        this.ui_manifold_polygon_edges = [];
        for (let i = 0; i < 2 * this.genus; ++i) {
            this.edges_list.push(new Edge(i));
            this.ui_manifold_polygon_edges.push(new UIEdge(ui_polygon_manifold_points[(2 * i) % mp_size], ui_polygon_manifold_points[(2 * i + 1) % mp_size], i, 2 * i));
            this.ui_edge_matcher.push(2 * i + 1);
            this.ui_manifold_polygon_edges.push(new UIEdge(ui_polygon_manifold_points[(2 * i + 2) % mp_size], ui_polygon_manifold_points[(2 * i + 1) % mp_size], i, 2 * i + 1));
            this.ui_edge_matcher.push(2 * i);
        }

        this.ui_manifold_polygon = new Flatten.Polygon();
        this.ui_manifold_polygon.addFace(A.map((e : UIEdge) => e.segment)(this.ui_manifold_polygon_edges));
    }

    private closest_edge_data(p : Flatten.Point) : [UIEdge, number, Flatten.Segment] {
        if (this.ui_manifold_polygon_edges.length == 0) {
            throw 'Fatal error: Manifold polygon is undefined';
        }
        let closest_edge = this.ui_manifold_polygon_edges[0];
        let distance_and_path_segment = p.distanceTo(closest_edge.segment);
        for (let i = 1; i < this.ui_manifold_polygon_edges.length; ++i) {
            const e = this.ui_manifold_polygon_edges[i];
            const d_p = p.distanceTo(e.segment);
            if (distance_and_path_segment[0] >= d_p[0]) {    // We look for the edge with the minimal distance
                closest_edge = e;
                distance_and_path_segment = d_p;
            }
        }
        return [closest_edge, distance_and_path_segment[0], distance_and_path_segment[1]];
    }

    private createUserEvents() {
        let canvas = this.canvas;

        canvas.addEventListener("mousedown", this.update_position);
        canvas.addEventListener("mousemove", this.update_position);
        canvas.addEventListener("mouseup", this.releaseEventHandler);
        canvas.addEventListener("mouseout", this.cancelEventHandler);
        canvas.addEventListener("mouseover", this.update_position)

        canvas.addEventListener("touchstart", this.update_position);
        canvas.addEventListener("touchmove", this.update_position);
        canvas.addEventListener("touchend", this.releaseEventHandler);
        canvas.addEventListener("touchcancel", this.cancelEventHandler);

        let clear_button = document.getElementById('clear');
        if (clear_button === null) {
            throw 'Fatal error: Unable to find the clear button in the DOM';
        }
        clear_button.addEventListener("click", this.clearEventHandler);
    }

    private get_manifold_pos(p : UIManifoldPosition) : ManifoldPosition {
        switch(p.kind) {
            case "UIIn" : return p; break;
            case "UIOnEdge" : return new OnEdge(this.edges_list[p.ui_edge.edge_index], p.position_on_edge); break;
        }
    }

    private manifold_eq(p : UIManifoldPosition, q : UIManifoldPosition) : boolean {
        return this.get_manifold_pos(p) == this.get_manifold_pos(q);
    }

    private draw_point(p : Flatten.Point, fillColor : string, radius : number) {
        this.context.save();
        this.context.fillStyle = fillColor;
        this.context.beginPath();
        this.context.arc(p.x, p.y, radius, 0, 2*Math.PI);
        this.context.fill();
        this.context.closePath();
        this.context.restore();
    }

    private draw_segment(s : Flatten.Segment, color : string, dash_param : number[]) {
        this.context.save();
        this.context.fillStyle = color;
        this.context.setLineDash(dash_param);
        this.context.beginPath();
        this.context.moveTo(s.ps.x, s.ps.y);
        this.context.lineTo(s.pe.x, s.pe.y);
        this.context.stroke();
        this.context.closePath();
        this.context.restore();
    }

    private draw_manifold() {
        for(let ui_edge of this.ui_manifold_polygon_edges) {
            this.draw_segment(ui_edge.segment, 'black', []);
        }
    }

    // To each edge corresponds two distincts ui_edges. Given one, it provides the other
    private brother_ui_edge(e : UIEdge) : UIEdge {
        console.log("===--- brother_ui_edge");
        console.log("Edge index:", e.ui_edge_index);
        console.log("Brother edge index:", this.ui_edge_matcher[e.ui_edge_index]);
        return this.ui_manifold_polygon_edges[this.ui_edge_matcher[e.ui_edge_index]];
    }

    private brother_ui_edge_position(e : UIOnEdge) : UIOnEdge {
        console.log("===--- brother_ui_edge_position");
        const a = new UIOnEdge(this.brother_ui_edge(e.ui_edge), e.position_on_edge);
        console.log("Original:", e);
        console.log("Brother:", a);
        return a;
    }

    private draw_nearest_segment(p : Flatten.Point) {
        console.log('draw_nearest_segment');
        let [ui_edge, _, shortest_seg] = this.closest_edge_data(p); // Closest Edge Data
        const proj_factor_on_edge = ui_edge.segment.tangentInStart().dot(Flatten.vector(ui_edge.segment.ps, p)) / ui_edge.segment.length;
        this.draw_segment(shortest_seg, 'grey', [5, 5]);
        console.log(shortest_seg);
        let draw_proj = (s : Flatten.Segment, color : string) => { this.draw_point(s.ps.translate(s.tangentInStart().multiply(s.length).multiply(proj_factor_on_edge)), color, 5); };
        draw_proj(ui_edge.segment, 'red');
        draw_proj(this.brother_ui_edge(ui_edge).segment, 'purple');
    }

    private draw_segments(l : UIManifoldSegment[]) {
        this.context.beginPath();
        for (let s of l) {
            this.context.moveTo(s.ps.point().x, s.ps.point().y);
            this.context.lineTo(s.pe.point().x, s.pe.point().y);
        }
        this.context.stroke();
        this.context.closePath();
    }

    private draw_stacked_loop() {
        for (const l of this.ui_stacked_loops) {
            this.draw_segments(l);
        }
    }

    private draw_current_loop() {
        pipe(this.ui_curr_loop, O.map((l : UICurrentLoop) => {
            this.draw_segments(l.segments)
            const pos_looped = this.position_looped();
            this.draw_point(l.start_point.point(), pos_looped ? 'yellow' : 'green'
                                                 , (pos_looped ? 1.2 : 1.0) *  this.init_point_radius);
            this.draw_point(l.last_point.point(), "black", 1.2 * this.init_point_radius);
        }));
    }

    private draw_ui_edges_points() {
        let m_seg_draw_ui_edges = (s : UIManifoldSegment) => {
            let m_pos_draw_ui_edge = (p : UIManifoldPosition) => {
                switch(p.kind) {
                    case "UIOnEdge" : this.draw_point(p.point(), "black", 0.5 * this.init_point_radius); break;
                }
            }
            m_pos_draw_ui_edge(s.pe);
            m_pos_draw_ui_edge(s.ps);
        };
        pipe(this.ui_curr_loop, O.map((l : UICurrentLoop) => { l.segments.forEach(m_seg_draw_ui_edges); }));
        flatten(this.ui_stacked_loops).forEach(m_seg_draw_ui_edges);
    }

    private redraw() {
        console.log('redraw');
        this.clearCanvas();

        this.draw_manifold();
        this.draw_stacked_loop();
        this.draw_current_loop();
        
        pipe(this.ui_curr_position, O.map((p: UICanvasPosition) => {
            switch(p.kind) {
                case "UIOut" : {} break;
                default : {
                    this.draw_nearest_segment(p.point());
                    pipe(this.ui_curr_loop, O.map((l : UICurrentLoop) => {
                        this.draw_segment(Flatten.segment(p.point(), l.last_point.point()), "black", [2, 2]);
                    }));
                } break;
            }
        }));
    }

    private loop_head() : Option<UIManifoldPosition> {
        return pipe(this.ui_curr_loop, O.map((l : UICurrentLoop) => l.start_point));
    }

    private distance_to_head(p : UIManifoldPosition) : Option<number> {
        return pipe(this.loop_head(), O.map((head : UIManifoldPosition) => head.point().distanceTo(p.point())[0]));
    }

    private position_looped() : boolean {
        return pipe( this.ui_curr_position
                   , O.chain((p : UICanvasPosition) : Option<number> => {
                       switch(p.kind) {
                           case "UIOut"    : return none; break;
                           case "UIIn"     : return this.distance_to_head(p); break;
                           case "UIOnEdge" : return this.distance_to_head(p); break;
                       }
                   })
                   , O.exists((d : number) => d <= this.init_point_radius));
    }

    private addPoint(p: UIManifoldPosition) {
        console.log('addPoint');
        switch(this.ui_curr_loop._tag) {
            case "None" : {
                switch(p.kind) {
                    case "UIOnEdge" : this.log_in_windows("You are currently on the edge, the first point must be placed inside the manifold.", "red"); break;
                    case "UIIn" : this.ui_curr_loop = some(new UICurrentLoop( p
                                                                            , (a, b) => this.manifold_eq(a, b)
                                                                            , (msg, c) => this.log_in_windows(msg, c)
                                                                            , (e : UIOnEdge) => this.brother_ui_edge_position(e)
                                                                            )); break;
                }
            } break;
            case "Some" : {
                if (this.position_looped()) {
                    pipe( this.ui_curr_loop.value.closeLoop()
                        , O.map((l : UIManifoldSegment[]) => {
                            this.ui_stacked_loops.push(l);
                            this.ui_curr_loop = none;
                        }));
                } else {
                    this.ui_curr_loop.value.addPoint(p);
                }
            } break;
        }


    }
    
    private clearCanvas() {
        console.log('clearCanvas');
        //console.trace();
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    private clearEventHandler = () => {
        console.log('clearEventHandler');
        this.ui_curr_loop = none;
        this.ui_stacked_loops = [];
        this.redraw();
    }

    private log_in_windows(msg : string, color : string) {
        console.log(msg);
    }
    
    private releaseEventHandler = () => {
        console.log('release');
        pipe(this.ui_curr_position, O.map((curr_pos : UICanvasPosition) => {
            pipe(this.ui_curr_position, O.map((pos: UICanvasPosition) => {
                switch (pos.kind) {
                    case "UIOut" : this.log_in_windows("You are currently out of the manifold, click a point inside the manifold", "red"); break;
                    default      : this.addPoint(pos); break;
                }
            }));
        }))

        this.redraw();
    }
    
    private cancelEventHandler = () => {
    }

    private getPositionInCanvas(e : MouseEvent | TouchEvent) : UICanvasPosition {
        let mouseX = (e as TouchEvent).changedTouches ?
                     (e as TouchEvent).changedTouches[0].pageX :
                     (e as MouseEvent).pageX;
        let mouseY = (e as TouchEvent).changedTouches ?
                     (e as TouchEvent).changedTouches[0].pageY :
                     (e as MouseEvent).pageY;
        mouseX -= this.canvas.offsetLeft;
        mouseY -= this.canvas.offsetTop;

        const p = Flatten.point(mouseX, mouseY);

        if (this.ui_manifold_polygon.contains(p)) {
            if (this.ui_manifold_polygon_edges.length == 0) {
                throw 'Fatal error: Manifold polygon is undefined';
            }
            let closest_edge = this.ui_manifold_polygon_edges[0];
            let distance_and_path_segment = p.distanceTo(closest_edge.segment);
            for (let i = 1; i < this.ui_manifold_polygon_edges.length; ++i) {
                const e = this.ui_manifold_polygon_edges[i];
                const d_p = p.distanceTo(e.segment);
                if (distance_and_path_segment[0] >= d_p[0]) {    // We look for the edge with the minimal distance
                    closest_edge = e;
                    distance_and_path_segment = d_p;
                }
            }
            if (distance_and_path_segment[0] <= this.stick_edge_distance) {
                const proj_factor_on_edge = closest_edge.segment.tangentInStart().dot(Flatten.vector(closest_edge.segment.ps, p)) / closest_edge.segment.length;
                const clamped_proj_factor = Ord.clamp(Ord.ordNumber)(UIOnEdge.range_min, UIOnEdge.range_max)(proj_factor_on_edge);
                console.log("UIOnEdge: proj_factor:", proj_factor_on_edge, " clamped:", clamped_proj_factor);
                return new UIOnEdge(closest_edge, clamped_proj_factor);
            } else {
                console.log("UIIn");
                return new UIIn(p);
            }
        } else {
            console.log("UIOut");
            return new UIOut();
        }
    }

    private update_position = (e: MouseEvent | TouchEvent) => {
        console.log('update_position');
        this.ui_curr_position = some(this.getPositionInCanvas(e));
        this.redraw();
    }

}

new DrawingApp();