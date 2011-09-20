var isIE = (window.navigator.userAgent.indexOf("MSIE") >= 0);
var mainCanvas = null;
var ctx = null;
var cloud = null;
var viewport = null;


function onLoad() {
  mainCanvas = document.getElementById('canvas');
  if(mainCanvas.getContext)
  {
    ctx = mainCanvas.getContext('2d');
    mainCanvas.onresize = function() {
        // Not sure yet
    };
    setupInputHandlers();

    ctx.globalCompositeOperation = "source-over";

    ctx.fillStyle = "blue";
    ctx.shadowOffsetX = 1;
    ctx.shadowOffsetY = 1;
    ctx.shadowColor = "black";
  }
}
  

function clearCanvas(context)
{
    context.clearRect(0, 0, 1200, 1200);
}

function setCursor(canvas, name) {
    switch (name) {
        case null:
        case "":
        case "default":
        case "arrow":
            canvas.style.cursor = "";
            break;
        case "hand":
            canvas.style.cursor = "pointer";
            break;
    }
}

function setupInputHandlers() {
    var leftMouseDown = false;
    var lastMouseX = 0, lastMouseY = 0;
    var ctrlDown = false;
    var shiftDown = false;

    var handlers = {};

    handlers.onMouseDown = function (button, x, y, el) {
        alert("down");
        leftMouseDown = true;
        setCursor(mainCanvas, "hand");
        lastMouseX = x;
        lastMouseY = y;

        ctx.fillStyle = "blue";
        ctx.shadowOffsetX = 1;
        ctx.shadowOffsetY = 1;
        ctx.shadowColor = "black";

        ctx.beginPath();
        ctx.lineWidth = 3;
        ctx.lineCap = "round";
        ctx.lineJoin = "miter";
        ctx.miterLimit = 10;
        ctx.moveTo(x,y);
        ctx.lineTo(x,y);
        ctx.fill();
    }

    handlers.onMouseUp = function (button, x, y, el) {
        leftMouseDown = false;
        setCursor(mainCanvas, null);
    }

    handlers.onMouseMove = function (x, y) {
        if (leftMouseDown == true) {
            ctx.beginPath();
            ctx.lineWidth = 3;
            ctx.lineCap = "round";
            ctx.lineJoin = "miter";
            ctx.miterLimit = 10;
            ctx.moveTo(lastMouseX,lastMouseY);
            ctx.lineTo(x,y);
            ctx.fill();
        
            lastMouseX = x;
            lastMouseY = y;
        }
    }

    handlers.onMouseWheel = function (delta, x, y, el) {
        if (shiftDown == true) {
            var sxy = viewport.screenToScene(x, y);
        } else {
            var newScale = viewport.cameraScale.current;
            if (delta < 0) {
                newScale /= 3.0;
            } else {
                newScale *= 2.0;
            }
            viewport.stopPan();
            viewport.zoomToScaleKeepingViewPointConstant(newScale, x - 80, y - 250, 1.0);
        }
    }

    handlers.onTouchStart = function (button, x, y, el) {
        setCursor(mainCanvas, "hand");
        lastMouseX = x;
        lastMouseY = y;
    }

    handlers.onTouchEnd = function (button, x, y, el) {
        setCursor(mainCanvas, null);

        if (mouseDelta < 4) {
            // Zoom
            var newScale = viewport.cameraScale.current * 3.0;
            viewport.stopPan();
            viewport.zoomToScaleKeepingViewPointConstant(newScale, x - 80, y - 250, 1.0);
        }
        mouseDelta = 0;
    }

    handlers.onTouchMove = function (x, y) {
        var vx = viewport.cameraOriginX.target;
        var vy = viewport.cameraOriginY.target;
        var vs = viewport.cameraScale.current;
        mouseDelta += Math.abs(lastMouseX - x) + Math.abs(lastMouseY - y);
        var dx = (lastMouseX - x) / vs;
        var dy = (lastMouseY - y) / vs;
        if ((dx != 0) || (dy != 0)) {
            vx += dx;
            vy += dy;
            viewport.setCamera(vs, vx, vy, 1.0);
        }
        lastMouseX = x;
        lastMouseY = y;
    }


    handlers.onGestureStart = function (button, x, y, el) {
        setCursor(mainCanvas, "hand");
        lastMouseX = x;
        lastMouseY = y;
    }

    handlers.onGestureEnd = function (button, x, y, el) {
        setCursor(mainCanvas, null);

        if (mouseDelta < 4) {
            // Zoom
            var newScale = viewport.cameraScale.current * 3.0;
            viewport.stopPan();
            viewport.zoomToScaleKeepingViewPointConstant(newScale, x - 80, y - 250, 1.0);
        }
        mouseDelta = 0;
    }

    handlers.onGestureChange = function (delta, x, y, el) {
        var newScale = scale;
        viewport.stopPan();
        viewport.zoomToScaleKeepingViewPointConstant(newScale, x - 80, y - 250, 1.0);
    }


    handlers.onKeyDown = function (keyCode) {
         switch (keyCode) {
            case 16: // shift
                shiftDown = true;
                return true;
            case 17: // ctrl
                ctrlDown = true;
                return true;
            case 32:
                return true;
        }
        return false;
    }

    handlers.onKeyUp = function (keyCode) {
        switch (keyCode) {
            case 16: // shift
               shiftDown = false;
               return true;
            case 17: // ctrl
                ctrlDown = false;
                return true;
            case 32: // space
                viewport.zoomToFit(3.0);
                return true;
        }
        return false;
    }

    setupInput(mainCanvas, handlers);
}



