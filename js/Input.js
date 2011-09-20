function setupInput(displayRoot, handlers) {

    var touchDown = false;
    displayRoot.onmousedown = function (event) {
        touchDown = true;
        if (handlers.onMouseDown) {
            var button = 0;
            var x = event.clientX - event.target.clientLeft;
            var y = event.clientY - event.target.clientTop;
            handlers.onMouseDown(button, x, y, event.target);
        }
        if (event.preventDefault) {
            event.preventDefault();
        }
        event.returnValue = false;
    };

    displayRoot.onmouseup = function (event) {
        touchDown = false;
        if (handlers.onMouseUp) {
            var button = 0;
            var x = event.clientX - event.target.clientLeft;
            var y = event.clientY - event.target.clientTop;
            handlers.onMouseUp(button, x, y, event.target);
        }
        if (event.preventDefault) {
            event.preventDefault();
        }
        event.returnValue = false;
    };

    displayRoot.onmousemove = function (event) {
        if (handlers.onMouseMove) {
            var x = event.clientX - event.target.clientLeft;
            var y = event.clientY - event.target.clientTop;
            handlers.onMouseMove(x, y, event.target);
        }
        if (event.preventDefault) {
            event.preventDefault();
        }
        event.returnValue = false;
    };

    displayRoot.onmousewheel = function (event) {
        var delta = 0;
        if (event.wheelDelta) {
            delta = event.wheelDelta / 120;
        } else if (event.detail) {
            delta = -event.detail / 3;
        }
        if (delta) {
            if (handlers.onMouseWheel) {
                var x = event.clientX - event.target.clientLeft;
                var y = event.clientY - event.target.clientTop;
                if (!isNaN(x) && !isNaN(y)) {
                    handlers.onMouseWheel(delta, x, y, event.target);
                }
            }
        }
        if (event.preventDefault) {
            event.preventDefault();
        }
        event.returnValue = false;
    };
    if (!isIE) {
        displayRoot.addEventListener("DOMMouseScroll", displayRoot.onmousewheel, false);
    }
    displayRoot.onmouseout = function (event) {
        if (leftMouseDown) {
            displayRoot.onmouseup({ target: displayRoot });
        }
    };

    displayRoot.ontouchstart = function (event) {
        touchDown = true;
        if (handlers.onTouchStart) {
            var button = 0;
            var x = event.touches[0].clientX - event.target.clientLeft;
            var y = event.touches[0].clientY - event.target.clientTop;
            handlers.onTouchStart(button, x, y, event.target);
        }
        if (event.preventDefault) {
            event.preventDefault();
        }
        event.returnValue = false;
    };

    displayRoot.ontouchend = function (event) {
        touchDown = false;
        if (handlers.onTouchEnd) {
            var button = 0;
            var x = event.touches[0].clientX - event.target.clientLeft;
            var y = event.touches[0].clientY - event.target.clientTop;
            handlers.onTouchEnd(button, x, y, event.target);
        }
        if (event.preventDefault) {
            event.preventDefault();
        }
        event.returnValue = false;
    };

    displayRoot.ontouchmove = function (event) {
        if (handlers.onTouchMove) {

            var x = event.touches[0].clientX - event.target.clientLeft;
            var y = event.touches[0].clientY - event.target.clientTop;
            handlers.onTouchMove(x, y, event.target);
        }
        if (event.preventDefault) {
            event.preventDefault();
        }
        event.returnValue = false;
    };

    displayRoot.ongesturestart = function (event) {
        if (handlers.onGestureStart) {
            var button = 0;
            var x = event.clientX - event.target.clientLeft;
            var y = event.clientY - event.target.clientTop;
            handlers.onGestureStart(button, x, y, event.target);
        }
        if (event.preventDefault) {
            event.preventDefault();
        }
        event.returnValue = false;
    };

    displayRoot.ongestureend = function (event) {
        if (handlers.onGestureEnd) {
            var button = 0;
            var x = event.clientX - event.target.clientLeft;
            var y = event.clientY - event.target.clientTop;
            handlers.onGestureEnd(button, x, y, event.target);
        }
        if (event.preventDefault) {
            event.preventDefault();
        }
        event.returnValue = false;
    };

    displayRoot.ongesturechange = function (event) {
        if (event.scale) {
            scale = event.scale;
        } else if (event.rotation) {
            rotation = event.rotation;
        } else if (event.position) {
            rotation = event.position;
        }
        if (scale) {
            if (handlers.onGestureChange) {
                var x = event.clientX - event.target.clientLeft;
                var y = event.clientY - event.target.clientTop;
                if (!isNaN(x) && !isNaN(y)) {
                    handlers.onGestureChange(scale, x, y, event.target);
                }
            }
        }
        if (event.preventDefault) {
            event.preventDefault();
        }
        event.returnValue = false;
    };

    function getKey(event) {
        var key;
        if (event.keyCode) {
            key = event.keyCode;
        } else {
            // IE9 is bizarre
            switch (event.key) {
                case "Shift":
                    key = 16;
                    break;
                case "Control":
                    key = 17;
                    break;
                default:
                    key = event.key.toUpperCase().charCodeAt(0);
                    break;
            }
        }
        return key;
    };

    if (handlers.onKeyDown) {
        document.onkeydown = function (event) {
            var result = false;
            var key = getKey(event);
            if (handlers.onKeyDown) {
                result = handlers.onKeyDown(key);
            }
            if (result) {
                if (event.preventDefault) {
                    event.preventDefault();
                }
                event.returnValue = !result;
            }
            return !result;
        };
    }
    if (handlers.onKeyUp) {
        document.onkeyup = function (event) {
            var result = false;
            var key = getKey(event);
            if (handlers.onKeyUp) {
                result = handlers.onKeyUp(key);
            }
            if (result) {
                if (event.preventDefault) {
                    event.preventDefault();
                }
                event.returnValue = !result;
            }
            return !result;
        };
    }
}