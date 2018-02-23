/*globals document, window */
'use strict';

/****************
 *nmlCanvas76.js*
 ****************/
let initialize = function () { 
    $('b1').addEventListener('click', moveShapes); // a couple of button eventlisteners 
    $('b2').addEventListener('click', moveShapes);
    $('b3').addEventListener('click', moveShapes);
    $('b4').addEventListener('click', moveShapes);
    
    mycv = Object.create(Canvas);                  // create canvas object
    mycv.init('myCanvas', 'transparent');

    
    let shape1 = Object.create(Shape);             // create objects
    shape1.init(mycv, 20, 10, 120, 40, 'blue', 125);    // put in array
    
    let shape2 = Object.create(Shape);
    shape2.init(mycv, 200, 100, 80, 60, 'green', 300);
    
    let shape3 = Object.create(Shape);
    shape3.init(mycv, 50, 200, 160, 40, 'red', 138);
    
    let shape4 = Object.create(Shape);
    shape4.init(mycv, 300, 50, 90, 80, 'yellow', 69);
    
    shapes.push(shape1);
    shapes.push(shape2);
    shapes.push(shape3);
    shapes.push(shape4);
    redraw(mycv, shapes);
};



let redraw = function (cv, arr) {
    cv.clear();
    cv.prep();
    for (let i = 0; i < arr.length; i++) {         // loop through array of shapes and draw
        arr[i].draw();
    }
};




let moveShapes = function (ev) {
    if (ev.target.id === 'b1') {                   // which button was hit
        shapes[0].move(2, 4);
    } else if (ev.target.id === 'b2'){
        shapes[1].move(3, -3);
    }else if (ev.target.id === 'b3'){
        shapes[2].move(3, -3);
    }
    else {
        shapes[3].move(3, -3);
    }
    redraw(mycv, shapes);
};




var shapes = [];
var mycv;
window.addEventListener('load', initialize);
