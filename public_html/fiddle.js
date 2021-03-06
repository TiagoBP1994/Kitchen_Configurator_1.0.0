var canvas, ctx, BB, offsetX, offsetY, WIDTH, HEIGHT, drag, startX, startY, rects, selectedRect, selectedRectOrigin;

function initialize() {
    // prepare canvas elements
    prepareCanvas();

    // drag related variables
    drag = false;

    // create objects for the canvas
    createObjects();

    // set up event listeners
    setEventListeners(canvas);

    // call to draw the scene
    draw();

}

function prepareCanvas() {
    // get canvas related references
    canvas = Object.create(Canvas);
    canvas.init('canvas', "#FAF7F8");
    ctx = canvas.getContext();
    BB = canvas.getBoundingClientRect();
    offsetX = BB.left;
    offsetY = BB.top;
    WIDTH = canvas.getWidth();
    HEIGHT = canvas.getHeight();
}

// create objects
function createObjects() {
    // an array of objects that define different rectangles
    rects = [];

    var fCabinetA = Object.create(Shape);
    fCabinetA.init(canvas, 300, 610, 40, 70, '#444444'); // (x,y,width,height)

    var fCabinetB = Object.create(Shape);
    fCabinetB.init(canvas, 220, 610, 60, 70, '#ff550d'); // (x,y,width,height)

    var wCabinetA = Object.create(Shape);
    wCabinetA.init(canvas, 360, 485, 30, 75, '#800080'); // (x,y,width,height)

    var wCabinetB = Object.create(Shape);
    wCabinetB.init(canvas, 400, 485, 60, 75, '#0c64e8'); // (x,y,width,height)

    var kCounter = Object.create(Shape);
    kCounter.init(canvas, 350, 610, 250, 90, '#A97D5D'); // (x,y,width,height)

    rects.push(fCabinetA);
    rects.push(fCabinetB);
    rects.push(wCabinetA);
    rects.push(wCabinetB);
    rects.push(kCounter);
}

// draw a single rect
function rect(x, y, w, h) {
    ctx.beginPath();
    ctx.rect(x, y, w, h);
    ctx.closePath();
    ctx.fill();
}

// clear the canvas
function clear() {
    // ctx.clearRect(0, 0, WIDTH, HEIGHT);
    // Store the current transformation matrix
    ctx.save();

    // Use the identity matrix while clearing the canvas
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, WIDTH, HEIGHT);

    // Restore the transform
    ctx.restore();
}

// redraw the scene
function draw() {
    clear();
    ctx.fillStyle = "#FAF7F8";
    rect(0, 0, WIDTH, HEIGHT);
    // redraw each rect in the rects[] array
    for (var i = 0; i < rects.length; i++) {
        var rectangle = rects[i];
        ctx.fillStyle = rectangle.fill;
        rect(rectangle.x, rectangle.y, rectangle.width, rectangle.height);
    }
}

// set event listeners
function setEventListeners(canvas) {
    // listen for mouse events
    canvas.onMouseDown(mDown);
    canvas.onMouseUp(mUp);
    canvas.onMouseMove(mMove);
}

// handle mousedown events
function mDown(e) {

    // tell the browser we're handling this mouse event
    e.preventDefault();
    e.stopPropagation();

    // get the current mouse position
    var mouseX = parseInt(e.clientX - offsetX);
    var mouseY = parseInt(e.clientY - offsetY);

    // test each rect to see if mouse is inside
    drag = false;
    for (var i = 0; i < rects.length; i++) {
        var rectangle = rects[i];
        if (mouseX > rectangle.x && mouseX < rectangle.x + rectangle.width && mouseY > rectangle.y && mouseY < rectangle.y + rectangle.height) {
            // if yes, set that rects isDragging=true
            drag = true;
            rectangle.isDragging = true;

            selectedRect = rectangle;
            selectedRectOrigin = Object.assign({}, selectedRect);
            console.log('Object Origin: ', selectedRectOrigin);
        }
    }
    // save the current mouse position
    startX = mouseX;
    startY = mouseY;
    ////////////////////////////////////////////////////////////////////////draw item list
    //////////////////////////////////////////////////////////////////////////displayFurniture();
}


// handle mouseup events
function mUp(e) {
    // tell the browser we're handling this mouse event
    e.preventDefault();
    e.stopPropagation();

    // create a temp array of shapes, except for the selected rect
    var temp = rects.slice();
    temp.pop(selectedRect);
    console.log(temp);

    for (var i = 0; i < temp.length; i++) {
        if (detectCollision(selectedRect, temp[i])) {
            // reset selected object
            selectedRect = Object.assign({}, selectedRectOrigin);
            draw();
        }
        console.log('New Pos: ', selectedRect);
    }

    // clear selected retangle
    selectedRect = null;
    selectedRectOrigin = null;

    // clear all the dragging flags
    drag = false;
    for (var i = 0; i < rects.length; i++) {
        rects[i].isDragging = false;
    }
}


// handle mouse moves
function mMove(e) {
    // if we're dragging anything...
    if (drag) {

        // tell the browser we're handling this mouse event
        e.preventDefault();
        e.stopPropagation();

        // get the current mouse position
        var mouseX = parseInt(e.clientX - offsetX);
        var mouseY = parseInt(e.clientY - offsetY);

        // calculate the distance the mouse has moved
        // since the last mousemove
        var dx = mouseX - startX;
        var dy = mouseY - startY;

        // move each rect that isDragging 
        // by the distance the mouse has moved
        // since the last mousemove
        for (var i = 0; i < rects.length; i++) {
            var r = rects[i];
            if (r.isDragging) {

                r.x += dx;
                r.y += dy;
            }
        }
    }

    // redraw the scene with the new rect positions
    draw();

    // reset the starting mouse position for the next mousemove
    startX = mouseX;
    startY = mouseY;

}


function detectCollision(object1, object2) {
    if (object1.x < object2.x + object2.width &&
            object1.x + object1.width > object2.x &&
            object1.y < object2.y + object2.height &&
            object1.height + object1.y > object2.y) {
        console.log('Collision');
        return true;
    } else {
        console.log('No Collision');
        return false;
    }
}

function displayFurniture() {
    var list = $('itemList');
    var text;
    var p;
    var li;
    for (var i = 0; i < rects.length; i++) {
        text = document.createTextNode('Item_' + parseInt(i) + ': ' + parseInt(rects[i].price) + '$');
        p = document.createElement('p');
        li = document.createElement('li');
        p.appendChild(text);
        li.appendChild(p);
        list.appendChild(li);
    }
    console.log(list);
}

var nml = window.addEventListener('load', initialize, false);