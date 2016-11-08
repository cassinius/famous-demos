/*global famous*/
// import dependencies
var Engine = famous.core.Engine;
var Modifier = famous.core.Modifier;
var ModifierChain = famous.modifiers.ModifierChain;
var Transform = famous.core.Transform;
var Surface = famous.core.Surface;
var View = famous.core.View;
var StateModifier = famous.modifiers.StateModifier;
var Easing = famous.transitions.Easing;

// create the main context
var mainContext = Engine.createContext();

var size = mainContext.getSize();
var initialTime = Date.now();

var number = parseInt(parseParam("nodes")) || 250;
var speed = parseFloat(parseParam("speed")) || 1;
var tilt = parseFloat(parseParam("tilt")) || -35;
var mods1 = new Array(number);
var mods2 = new Array(number);
var mods3 = new Array(number);
var mods4 = new Array(number);
var nodes = new Array(number);
var angles = new Array(number);

var tiltModifier = new Modifier({
    transform: Transform.rotateX(tilt * 2 * Math.PI / 360)
});

var mainView = new View();

mainContext.add(tiltModifier).add(mainView);
mainContext.setPerspective(800);


// translateModifier = new Modifier({
//     transform: function() {
//         var dist = 100 * Math.sin(speed * 0.001 * ( Date.now() - initialTime) );
//         return Transform.translate(0, 0, dist);
//     }
// });

// rotationModifier = new Modifier({
//     transform: function() {
//         //console.log(this);
//         return Transform.rotateY(speed * 0.001 * (Date.now() - initialTime));
//     }
// });


for( var i = 0; i < number; i++ ) {
    angles[i] = Math.random() * Math.PI * 2;

    var x = Math.random() * window.innerWidth - window.innerWidth / 2;
    var y = Math.random() * window.innerHeight - window.innerHeight / 2;
    mods1[i] = new Modifier({
        transform: Transform.translate(x, y, Math.random()*500)
    });

    mods2[i] = new Modifier({
        align: [0.5, 0.5],
        origin: [0.5, 0.5],
        transform: Transform.rotateY(angles[i])
    });

    mods3[i] = new Modifier({
        transform: function() {
            var dist = 100 * Math.sin(speed * 0.001 * ( Date.now() - initialTime) );
            return Transform.translate(0, 0, dist);
        }
    });

    mods4[i] = new Modifier({
        transform: function() {
            //console.log(this);
            return Transform.rotateY(speed * 0.001 * (Date.now() - initialTime));
        }
    });

    // Random colors
    var r = Math.random() * 255 | 0,
        g = Math.random() * 255 | 0,
        b = Math.random() * 255 | 0,
        a = Math.random();

    // Random sizes
    var x = Math.random() * 100 | 0,
        y = Math.random() * 90 | 0;
    // Minimum sizes
    x = x >= 50 ? x : 50;
    y = y >= 30 ? y : 30;

    var color = "rgba(" + r + ", " + g + ", " + b + ", " + a + ")";

    nodes[i] = new Surface({
        size: [x, y],
        properties: {
            backgroundColor: color,
            borderRadius: '10px 5px',
            lineHeight: y/2 + "px",
            verticalAlign: "middle",
            textAlign: 'center'
        },
        classes: ['double-sided', 'spinding'],
        content: "<b> Div <br/> Waltz! </b>"
    });

    nodes[i].on('click', function() {
      console.log("You clicked a spinding on: " + new Date());
    });

    // mainContext.add(mod).add(node);
    mainView.add(mods1[i]).add(mods2[i]).add(mods3[i]).add(mods4[i]).add(nodes[i]); // .add(mods3[i])
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
