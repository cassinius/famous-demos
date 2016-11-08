var Engine = famous.core.Engine;
var Surface = famous.core.Surface;
var ImageSurface = famous.surfaces.ImageSurface;
var Modifier = famous.core.Modifier;
var StateModifier = famous.modifiers.StateModifier;
var Transform = famous.core.Transform;
var Transitionable = famous.transitions.Transitionable;
var Easing = famous.transitions.Easing;
var Utility = famous.utilities.Utility;
var GenericSync = famous.inputs.GenericSync;
var MouseSync   = famous.inputs.MouseSync;
var TouchSync   = famous.inputs.TouchSync;
var ScrollSync  = famous.inputs.ScrollSync;

// register sync classes globally for later use in GenericSync
GenericSync.register({
    "mouse" : MouseSync,
    "touch" : TouchSync,
    "scroll" : ScrollSync
});

// Create context
var mainContext = Engine.createContext();

var scrollSync = new ScrollSync({
    scale : 2
});
mainContext.pipe(scrollSync);
scrollSync.on('update', function(data) {
    console.log(data);
    mainContext.setPerspective(mainContext.getPerspective() + data.delta[1]);
});


//////////////////////////////////////////////////////////
//                 LEMONTIGER CONTACT
//////////////////////////////////////////////////////////

// state variables
var PERSPECTIVE = 800;
var WIDTH = 200;
var HEIGHT = 300;
var NUMBER = parseInt(parseParam('friends')) || 50;
var defaultAngle = -Math.PI / 13;
var size = [WIDTH, HEIGHT];
var angle = new Transitionable(defaultAngle);
var swing = false;
window.toggle_duration = 2500;
window.surfaces = new Array(NUMBER);
window.distModifiers = new Array(NUMBER);
window.syncs = new Array(NUMBER);
window.positions = new Array(NUMBER);
window.dists = new Array(NUMBER);
window.pics = [
    "bernd", "chris", "clau", "dani", "geli", "hosam", "lisa", "liz", "sara", "yara"
];
window.spinners = [
    "diskspin", "freqspin", "spinner1", "spinner2", "spinner3", "stepper", "wachel"
];
window.greets = [
    "Dear friend: ", "Dear leader: ", "Great one: ", "Close buddy: ", "Contact: "
];
window.drag = false;

for( var i = 0; i < NUMBER; i++ ) {

    var surface = new Surface({
        size: size,
        content: greets[Math.random() * greets.length | 0] + pics[i % pics.length],
        properties: {
            fontSize: '20px',
            paddingTop: '15px',
            color: 'white',
            textAlign: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.3)',
            borderRadius: '30px',
            boxShadow: '0px 0px 20px #999',
            cursor: 'pointer',

            // TODO: find out how to give non-CSS properties
            selected: false,
            idx: i
        },
        classes: ["contact"]
    });
    surfaces[i] = surface;


    surface.on('click', function() {

        console.log("Drag: " + this.properties.drag);
        if( this.properties.drag ) {
            this.properties.drag = false;
            return;
        }

        if( this.properties.selected ) {
            this.setProperties({
                boxShadow: '0px 0px 20px #999'
            });
            this.properties.selected = false;
        }
        else {
            this.setProperties({
                boxShadow: '0px 0px 20px red'
            });
            this.properties.selected = true;
        }
    });

    // TODO: Not a good idea to use distance transform (could switch item focus)
    surface.on('mouseover', function() {
        if( window.drag ) {
            return;
        }
        var i = this.properties.idx;
        var x = this.properties.x;
        var y = this.properties.y;
        var d = this.properties.d;
        this.properties.d = dists[i] = d = 0.9 * d;
        distModifiers[i].setTransform(
            Transform.translate(x, y, d),
            //Transform.scale(1.2),
            {duration : 150, curve : 'linear'}
        );
    });
    
    surface.on('mouseout', function() {
        if( window.drag ) {
            return;
        }
        var i = this.properties.idx;
        var x = this.properties.x;
        var y = this.properties.y;
        var d = this.properties.d;
        this.properties.d = dists[i] = d = d / 0.9;
        distModifiers[i].setTransform(
            Transform.translate(x, y, d),
            //Transform.scale(1),
            {duration : 150, curve : 'linear'}
        );
    });

    var x = window.innerWidth / 2 - Math.random() * window.innerWidth;
    var y = window.innerHeight / 2 - Math.random() * window.innerHeight;
    dists[i] = -Math.random() * 2500;

    // Save position in properties:
    surface.properties.x = x;
    surface.properties.y = y;
    surface.properties.d = dists[i];

    // the position state
    positions[i] = [x, y];

    distModifiers[i] = new Modifier({
        transform: Transform.translate(positions[i][0], positions[i][1], dists[i])
    });

    // create a Sync to listen to mouse events
    syncs[i] = new GenericSync({
        "mouse"  : {i: i},
        "touch"  : {i: i}
    });

    surface.pipe(syncs[i]);
    syncs[i].on('update', function(data) {
        window.drag = true;
        var i = this._syncs.mouse.getOptions().i;
        var d1 = data.delta[0];
        var d2 = data.delta[1];
        var m1 = d1 > 0 ? -1 : d1 < 0 ? 1 : 0;
        var m2 = d2 > 0 ? -1 : d2 < 0 ? 1 : 0;
        positions[i][0] += d1 + 0.003 * m1 * dists[i];
        positions[i][1] += d2 + 0.002 * m2 * dists[i];

        // Save new position so animations still work
        surfaces[i].properties.x = positions[i][0];
        surfaces[i].properties.y = positions[i][1];

        surfaces[i].properties.drag = true;

        distModifiers[i].setTransform(
            Transform.translate(positions[i][0], positions[i][1], dists[i])
        );
    });

    syncs[i].on('end', function(data) {
        var i = this._syncs.mouse.getOptions().i;
        if( surfaces[i].properties.selected ) {
            surfaces[i].setProperties({
                boxShadow: '0px 0px 20px red'
            });
        }
        else {
            surfaces[i].setProperties({
                boxShadow: '0px 0px 20px #999'
            });
        }
        window.drag = false;
        // NOTE: Click mouseup event comes after this one!!!
        //surfaces[i].properties.drag = false;
    });

    // rotates red card surface and circle
    var rotationModifier = new Modifier({
        size: size,
        origin: [0.5, 0.5],
        align: [0.5, 0.5],
        transform: function () {
            return Transform.rotateY(angle.get());
        }
    });


    // scales card surface and picture
    var scaleModifier = new Modifier({
        origin: [0.5, 0.5],
        align: [0.5, 0.5],
        transform: function () {
            var scale = 0.9 * Math.cos(angle.get());
            return Transform.scale(scale, scale, 1);
        }
    });


    var buddyNode = mainContext
        .add(distModifiers[i])
        .add(rotationModifier)
        .add(scaleModifier);

    buddyNode.add(surface);


    //====================================================================
    // CIRCLE
    //====================================================================

    var circle = new ImageSurface({
        size: [150, 150],
        properties: {
            borderRadius: '125px',
            pointerEvents: 'none',
            zIndex: 1
        },
        classes: ["circle"]
    });

    circle.setContent("./img/" + pics[i % pics.length] + ".jpg");

    var circleModifier = new StateModifier({
        transform: Transform.translate(0, -20, 1)
    });

    var circleModifierRotate = new Modifier({
        transform: function() {
            var rotation = 1/6 * ( defaultAngle / 2 - angle.get() );
            return Transform.rotateZ(rotation);
        }
    });


    // The spinner...
    var spinner = new ImageSurface({
        size: [150, 50],
        properties: {
            pointerEvents: 'none',
            zIndex: 1
        }
    });

    spinner.setContent("./img/" + spinners[i % spinners.length] + ".gif");
    spinner.setContent("./img/diskspin.gif");

    var spinModifier = new StateModifier({
        align: [0.5, 1],
        origin: [0.5, 1],
        transform: Transform.translate(10, 0, -2)
    });


    buddyNode.add(circleModifier).add(circleModifierRotate).add(circle);
    //buddyNode.add(spinModifier).add(spinner);
}

mainContext.setPerspective(PERSPECTIVE);


//=======================================================================
// Only after complete instantiation
toggle();
// toggles angle
function toggle() {
    var targetAngle = swing ? defaultAngle : -defaultAngle;
    // halts the transitionable transition if animation
    // is in progress
    if (angle.isActive())
        angle.halt();
    angle.set(targetAngle, { duration: window.toggle_duration, curve: 'easeInOut' });
    swing = !swing;

    setTimeout(function(){toggle()}, window.toggle_duration);
}



//=============== HELPERS ===============

function parseParam(val) {
    var result = "Not found",
        tmp = [];
    location.search
    //.replace ( "?", "" ) 
    // this is better, there might be a question mark inside
    .substr(1)
        .split("&")
        .forEach(function (item) {
            tmp = item.split("=");
            if (tmp[0] === val) result = decodeURIComponent(tmp[1]);
        });
    return result;
}








/*

//////////////////////////////////////////////////////////
//             SWITCH - A LITTLE AUGMENTED
//////////////////////////////////////////////////////////

// App parameters
var HEIGHT = 75;
var WIDTH = 250;
var TRANSITION = { duration: 700, curve: Easing.outBounce };

// Storing toggle state
var state = new Transitionable(0);
var isToggled = false;

// Modifier to center renderables
var centerModifier = new Modifier({
    size: [WIDTH, HEIGHT],
    align: [0, 0.1],
    origin: [0, 0.5]
});

var mainNode = mainContext.add(centerModifier);

// Create renderables
var greenBackground = new Surface({
    size: [WIDTH, HEIGHT],
    properties: {
        backgroundColor: 'limegreen',
        border: '1px solid gray',
        borderRadius: HEIGHT + 'px',
        cursor: 'pointer'
    }
});

var redBackground = new Surface({
    size: [WIDTH, HEIGHT],
    properties: {
        backgroundColor: '#FA5C4F',
        border: '1px solid gray',
        borderRadius: HEIGHT + 'px',
        cursor: 'pointer'
    }
});

var toggleSwitch1 = new Surface({
    size: [HEIGHT, HEIGHT],
    content: 'ON >>',
    properties: {
        textAlign: 'center',
        lineHeight: HEIGHT + 'px',
        backgroundColor: 'limegreen',
        border: '1px solid gray',
        borderRadius: HEIGHT + 'px',
        cursor: 'pointer',
        zIndex: 1
    }
});

var toggleSwitch2 = new Surface({
    size: [HEIGHT, HEIGHT],
    content: '<< OFF',
    properties: {
        textAlign: 'center',
        lineHeight: HEIGHT + 'px',
        backgroundColor: '#FA5C4F',
        border: '1px solid gray',
        borderRadius: HEIGHT + 'px',
        cursor: 'pointer',
        zIndex: 1
    }
});

// Create modifiers to crossfade background color between
// red and green on toggle and move the toggle button
var mod1 = new Modifier({
    // toggle between 0 and 1
    opacity: function() {
        return state.get();
    }
});

var mod2 = new Modifier({
    // toggle between 1 and 0
    opacity: function() {
        return 1 - state.get();
    }
});

var toggleModifier1 = new Modifier({
    // toggle between 0 and right x-position
    transform: function() {
        var xPos = state.get() * (WIDTH - HEIGHT);
        return Transform.translate(xPos, 0, 0);
    }
});

var toggleModifier2 = new Modifier({
    // toggle between 0 and right x-position
    transform: function() {
        var xPos = state.get() * (WIDTH - HEIGHT);
        return Transform.translate(xPos, 0, 0);
    }
});

// Add modifiers and renderales to context
var rel_node_1 = mainNode.add(mod1);
var rel_node_2 = mainNode.add(mod2);
rel_node_1.add(greenBackground);
rel_node_2.add(redBackground);
rel_node_1.add(toggleModifier1).add(toggleSwitch2);
rel_node_2.add(toggleModifier2).add(toggleSwitch1);


// Listen for click event and toggle state
toggleSwitch1.on('click', toggleState);
toggleSwitch2.on('click', toggleState);
greenBackground.on('click', toggleState);
redBackground.on('click', toggleState);

// Toggle state between 0 and 1
function toggleState() {
    // Halts current animation if active
    if(state.isActive()) state.halt();
    // Sets end transition state
    if(isToggled) state.set(0, TRANSITION);
    else state.set(1, TRANSITION);

    isToggled = !isToggled;
}

 */