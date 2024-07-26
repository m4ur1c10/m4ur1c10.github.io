'use strict';

/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise, SuppressedError, Symbol */

var extendStatics = function(d, b) {
    extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
    return extendStatics(d, b);
};

function __extends(d, b) {
    if (typeof b !== "function" && b !== null)
        throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
    extendStatics(d, b);
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};

typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
    var e = new Error(message);
    return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
};

var ManipuleElementsEventEnum;
(function (ManipuleElementsEventEnum) {
    ManipuleElementsEventEnum["RESIZING"] = "resizing";
    ManipuleElementsEventEnum["START_RESIZE"] = "start-resizing";
    ManipuleElementsEventEnum["STOP_RESIZING"] = "stop-resizing";
})(ManipuleElementsEventEnum || (ManipuleElementsEventEnum = {}));
var ManipuleElementsEvents = /** @class */ (function () {
    function ManipuleElementsEvents() {
    }
    ManipuleElementsEvents.createNew = function (eventName) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        var customEvent = new CustomEvent("".concat(ManipuleElementsEvents.PREFFIX).concat(eventName), {
            detail: __assign({}, args)
        });
        window.dispatchEvent(customEvent);
    };
    ManipuleElementsEvents.listen = function (eventName, callback) {
        window.addEventListener("".concat(ManipuleElementsEvents.PREFFIX).concat(eventName), function (e) { callback(e.detail); });
    };
    ManipuleElementsEvents.PREFFIX = 'manipule-elements:';
    return ManipuleElementsEvents;
}());

var ResizePointTypeEnum;
(function (ResizePointTypeEnum) {
    ResizePointTypeEnum["TOP_LEFT"] = "tl";
    ResizePointTypeEnum["TOP_RIGHT"] = "tr";
    ResizePointTypeEnum["BOTTOM_LEFT"] = "bl";
    ResizePointTypeEnum["BOTTOM_RIGHT"] = "br";
    ResizePointTypeEnum["MIDDLE_RIGHT"] = "mr";
    ResizePointTypeEnum["MIDDLE_LEFT"] = "ml";
    ResizePointTypeEnum["MIDDLE_TOP"] = "mt";
    ResizePointTypeEnum["MIDDLE_BOTTOM"] = "mb";
})(ResizePointTypeEnum || (ResizePointTypeEnum = {}));
var ResizePointTypeEventEnum;
(function (ResizePointTypeEventEnum) {
    ResizePointTypeEventEnum["RESIZING"] = "resizing";
    ResizePointTypeEventEnum["START_RESIZE"] = "start-resizing";
    ResizePointTypeEventEnum["STOP_RESIZING"] = "stop-resizing";
})(ResizePointTypeEventEnum || (ResizePointTypeEventEnum = {}));
var ResizePoint = /** @class */ (function () {
    function ResizePoint(type) {
        this.onEvents = {};
        if (!Object.values(ResizePointTypeEnum).includes(type)) {
            throw new Error('ResizePoint type not recognized');
        }
        this.el = document.createElement('div');
        this.el.classList.add('res-point', type);
        this.el.addEventListener('mousedown', this.initResize.bind(this), false);
        this.type = type;
    }
    ResizePoint.prototype.on = function (typeEvent, callback) {
        if (!Object.values(ResizePointTypeEventEnum).includes(typeEvent)) {
            return;
        }
        this.onEvents[typeEvent] = callback;
    };
    ResizePoint.prototype.send = function (typeEvent) {
        var _a;
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        ManipuleElementsEvents.createNew(typeEvent, args);
        if (!Object.values(ResizePointTypeEventEnum).includes(typeEvent)) {
            return;
        }
        (_a = this.onEvents)[typeEvent].apply(_a, args);
    };
    ResizePoint.prototype.getElement = function () {
        return this.el;
    };
    ResizePoint.prototype.getType = function () {
        return this.type;
    };
    ResizePoint.prototype.initResize = function (e) {
        var _this = this;
        if (!e.target) {
            return;
        }
        this.send(ResizePointTypeEventEnum.START_RESIZE);
        var startResize = function (e) {
            _this.send(ResizePointTypeEventEnum.RESIZING, e);
        };
        var stopResize = function () {
            _this.send(ResizePointTypeEventEnum.STOP_RESIZING);
            window.removeEventListener('mousemove', startResize, false);
            window.removeEventListener('mouseup', stopResize, false);
        };
        window.addEventListener('mousemove', startResize, false);
        window.addEventListener('mouseup', stopResize, false);
    };
    return ResizePoint;
}());

var ResizableShadow = /** @class */ (function () {
    function ResizableShadow(resizeType) {
        this.resizeType = resizeType;
        this.onStartResize = function () { };
        this.onStopResize = function () { };
        this.onResizing = function () { };
        var shadowElement = document.createElement('div');
        shadowElement.classList.add('shadow');
        this.shadowElement = shadowElement;
    }
    ResizableShadow.prototype.getElement = function () {
        return this.shadowElement;
    };
    ResizableShadow.prototype.start = function () {
        var _this = this;
        this.shadowElement.style.display = 'initial';
        var topLeft = new ResizePoint(ResizePointTypeEnum.TOP_LEFT);
        topLeft.on(ResizePointTypeEventEnum.RESIZING, function (e) { _this.onResizing(e, ResizePointTypeEnum.TOP_LEFT); });
        topLeft.on(ResizePointTypeEventEnum.START_RESIZE, function () { _this.onStartResize(); });
        topLeft.on(ResizePointTypeEventEnum.STOP_RESIZING, function () { _this.onStopResize(); });
        var topRight = new ResizePoint(ResizePointTypeEnum.TOP_RIGHT);
        topRight.on(ResizePointTypeEventEnum.RESIZING, function (e) { _this.onResizing(e, ResizePointTypeEnum.TOP_RIGHT); });
        topRight.on(ResizePointTypeEventEnum.START_RESIZE, function () { _this.onStartResize(); });
        topRight.on(ResizePointTypeEventEnum.STOP_RESIZING, function () { _this.onStopResize(); });
        var bottomLeft = new ResizePoint(ResizePointTypeEnum.BOTTOM_LEFT);
        bottomLeft.on(ResizePointTypeEventEnum.RESIZING, function (e) { _this.onResizing(e, ResizePointTypeEnum.BOTTOM_LEFT); });
        bottomLeft.on(ResizePointTypeEventEnum.START_RESIZE, function () { _this.onStartResize(); });
        bottomLeft.on(ResizePointTypeEventEnum.STOP_RESIZING, function () { _this.onStopResize(); });
        var bottomRight = new ResizePoint(ResizePointTypeEnum.BOTTOM_RIGHT);
        bottomRight.on(ResizePointTypeEventEnum.RESIZING, function (e) { _this.onResizing(e, ResizePointTypeEnum.BOTTOM_RIGHT); });
        bottomRight.on(ResizePointTypeEventEnum.START_RESIZE, function () { _this.onStartResize(); });
        bottomRight.on(ResizePointTypeEventEnum.STOP_RESIZING, function () { _this.onStopResize(); });
        var middleRight = new ResizePoint(ResizePointTypeEnum.MIDDLE_RIGHT);
        middleRight.on(ResizePointTypeEventEnum.RESIZING, function (e) { _this.onResizing(e, ResizePointTypeEnum.MIDDLE_RIGHT); });
        middleRight.on(ResizePointTypeEventEnum.START_RESIZE, function () { _this.onStartResize(); });
        middleRight.on(ResizePointTypeEventEnum.STOP_RESIZING, function () { _this.onStopResize(); });
        var middleLeft = new ResizePoint(ResizePointTypeEnum.MIDDLE_LEFT);
        middleLeft.on(ResizePointTypeEventEnum.RESIZING, function (e) { _this.onResizing(e, ResizePointTypeEnum.MIDDLE_LEFT); });
        middleLeft.on(ResizePointTypeEventEnum.START_RESIZE, function () { _this.onStartResize(); });
        middleLeft.on(ResizePointTypeEventEnum.STOP_RESIZING, function () { _this.onStopResize(); });
        this.resPoints = {
            topLeft: topLeft,
            topRight: topRight,
            bottomLeft: bottomLeft,
            bottomRight: bottomRight,
            middleLeft: middleLeft,
            middleRight: middleRight,
        };
        this.shadowElement.appendChild(topLeft.getElement());
        this.shadowElement.appendChild(topRight.getElement());
        this.shadowElement.appendChild(bottomLeft.getElement());
        this.shadowElement.appendChild(bottomRight.getElement());
        this.shadowElement.appendChild(middleLeft.getElement());
        this.shadowElement.appendChild(middleRight.getElement());
        if (this.resizeType === ResizableType.RESIZABLE_TYPE_IMAGE) {
            var middleTop = new ResizePoint(ResizePointTypeEnum.MIDDLE_TOP);
            middleTop.on(ResizePointTypeEventEnum.RESIZING, function (e) { _this.onResizing(e, ResizePointTypeEnum.MIDDLE_TOP); });
            middleTop.on(ResizePointTypeEventEnum.START_RESIZE, function () { _this.onStartResize(); });
            middleTop.on(ResizePointTypeEventEnum.STOP_RESIZING, function () { _this.onStopResize(); });
            var middleBottom = new ResizePoint(ResizePointTypeEnum.MIDDLE_BOTTOM);
            middleBottom.on(ResizePointTypeEventEnum.RESIZING, function (e) { _this.onResizing(e, ResizePointTypeEnum.MIDDLE_BOTTOM); });
            middleBottom.on(ResizePointTypeEventEnum.START_RESIZE, function () { _this.onStartResize(); });
            middleBottom.on(ResizePointTypeEventEnum.STOP_RESIZING, function () { _this.onStopResize(); });
            this.resPoints.middleBottom = middleBottom;
            this.resPoints.middleTop = middleTop;
            this.shadowElement.appendChild(middleTop.getElement());
            this.shadowElement.appendChild(middleBottom.getElement());
        }
    };
    ResizableShadow.prototype.finish = function () {
        var _a, _b;
        if (!this.resPoints) {
            return;
        }
        this.resPoints.topLeft.getElement().remove();
        this.resPoints.topRight.getElement().remove();
        this.resPoints.bottomLeft.getElement().remove();
        this.resPoints.bottomRight.getElement().remove();
        this.resPoints.middleLeft.getElement().remove();
        this.resPoints.middleRight.getElement().remove();
        (_a = this.resPoints.middleBottom) === null || _a === void 0 ? void 0 : _a.getElement().remove();
        (_b = this.resPoints.middleTop) === null || _b === void 0 ? void 0 : _b.getElement().remove();
    };
    return ResizableShadow;
}());

var ResizableType;
(function (ResizableType) {
    ResizableType["RESIZABLE_TYPE_TEXT"] = "text";
    ResizableType["RESIZABLE_TYPE_IMAGE"] = "image";
})(ResizableType || (ResizableType = {}));
var Resizable = /** @class */ (function () {
    function Resizable(_a) {
        var contentEl = _a.contentEl, type = _a.type, wrapperLeft = _a.wrapperLeft;
        this.wrapperLeft = 0;
        this.onStartResize = function () { };
        this.onStopResize = function () { };
        if (contentEl.parentElement && contentEl.parentElement.classList.contains('content-wrapper')) {
            contentEl.parentElement.classList.add(type, 'resizable');
            this.resizableElement = contentEl.parentElement;
        }
        else {
            this.resizableElement = contentEl;
        }
        this.type = type;
        this.shadowElement = null;
        // TODO: Melhorar como pegar essa parte
        this.wrapperLeft = wrapperLeft;
        this.initEvents();
    }
    Resizable.prototype.initEvents = function () {
        var _this = this;
        this.resizableElement.addEventListener('click', this.handleClick.bind(this), true);
        this.shadowElement = new ResizableShadow(this.type);
        this.shadowElement.onStartResize = function () {
            _this.onStartResize();
        };
        this.shadowElement.onStopResize = function () {
            _this.onStopResize();
        };
        this.shadowElement.onResizing = function (_a, resizeDirection) {
            var clientX = _a.clientX, clientY = _a.clientY;
            _this.doResize(clientX, clientY, resizeDirection);
        };
        this.resizableElement.appendChild(this.shadowElement.getElement());
    };
    Resizable.prototype.handleClick = function () {
        this.resizableElement.classList.add('selected');
        if (!this.shadowElement || this.resizableElement.classList.contains('is-dragging')) {
            return false;
        }
        this.shadowElement.start();
    };
    Resizable.prototype.removeSelection = function () {
        this.resizableElement.classList.remove('selected');
        if (this.shadowElement) {
            this.shadowElement.finish();
            // this.shadowElement.getElement().remove();
        }
    };
    Resizable.prototype.getElement = function () {
        return this.resizableElement;
    };
    return Resizable;
}());

var Drag = /** @class */ (function () {
    function Drag(contentEl, wrapperBounds, wrapperElement) {
        this.contentEl = contentEl;
        this.wrapperBounds = wrapperBounds;
        this.wrapperElement = wrapperElement;
        this.pos1 = 0;
        this.pos2 = 0;
        this.pos3 = 0;
        this.pos4 = 0;
        this.classesAllowedToDrag = ['shadow', 'content'];
        this.boundStartDragEventHandler = this.startDrag.bind(this);
        this.initEvents();
    }
    Drag.prototype.initEvents = function () {
        this.contentEl.addEventListener('mousedown', this.initDrag.bind(this), false);
    };
    Drag.prototype.initDrag = function (e) {
        var _this = this;
        if (!this.isElementCanBeDragged(e.target)) {
            return;
        }
        this.pos3 = e.clientX;
        this.pos4 = e.clientY;
        this.contentEl.classList.add('is-dragging');
        var stopDrag = function () {
            _this.contentEl.classList.remove('is-dragging');
            _this.wrapperElement.removeEventListener('mouseup', stopDrag, false);
            _this.wrapperElement.removeEventListener('mousemove', _this.boundStartDragEventHandler, false);
            _this.wrapperElement.removeEventListener('mouseleave', stopDrag, false);
        };
        this.wrapperElement.addEventListener('mouseup', stopDrag, false);
        this.wrapperElement.addEventListener('mousemove', this.boundStartDragEventHandler, false);
        this.wrapperElement.addEventListener('mouseleave', stopDrag, false);
    };
    Drag.prototype.startDrag = function (e) {
        this.pos1 = this.pos3 - e.clientX;
        this.pos2 = this.pos4 - e.clientY;
        this.pos3 = e.clientX;
        this.pos4 = e.clientY;
        var top = this.contentEl.offsetTop - this.pos2;
        var left = this.contentEl.offsetLeft - this.pos1;
        if ((left + this.wrapperBounds.x) > this.wrapperBounds.x &&
            (left + this.contentEl.clientWidth) < this.wrapperBounds.w) {
            this.contentEl.style.left = "".concat(left, "px");
        }
        if ((top + this.wrapperBounds.y) > this.wrapperBounds.y &&
            (top + this.contentEl.clientHeight) < this.wrapperBounds.h) {
            this.contentEl.style.top = "".concat(top, "px");
        }
    };
    Drag.prototype.isElementCanBeDragged = function (element) {
        var _a;
        if (element.classList.contains('is-editing') || ((_a = element.parentElement) === null || _a === void 0 ? void 0 : _a.classList.contains('is-editing'))) {
            return false;
        }
        return this.classesAllowedToDrag.filter(function (className) { return element.classList.contains(className); }).length > 0;
    };
    return Drag;
}());

var ResizableText = /** @class */ (function (_super) {
    __extends(ResizableText, _super);
    function ResizableText(_a) {
        var contentEl = _a.contentEl, wrapperLeft = _a.wrapperLeft;
        contentEl.classList.add('content');
        return _super.call(this, { contentEl: contentEl, wrapperLeft: wrapperLeft, type: ResizableType.RESIZABLE_TYPE_TEXT }) || this;
    }
    ResizableText.prototype.doResize = function (clientX, _clientY, resizeDirection) {
        var _a = this.resizableElement.getBoundingClientRect(), left = _a.left, width = _a.width, height = _a.height;
        var toGrowSize = this.calculateToGrowSize(resizeDirection, clientX, left, width);
        if (toGrowSize < 1 && height < 20) {
            return;
        }
        this.resizableElement.style.width = width + toGrowSize + 'px';
        if ([
            ResizePointTypeEnum.MIDDLE_LEFT,
            ResizePointTypeEnum.TOP_LEFT,
            ResizePointTypeEnum.BOTTOM_LEFT,
        ].includes(resizeDirection)) {
            this.resizableElement.style.left = (left - this.wrapperLeft - toGrowSize) + 'px';
        }
        if (resizeDirection === ResizePointTypeEnum.TOP_RIGHT || resizeDirection === ResizePointTypeEnum.TOP_LEFT) {
            var top_1 = parseFloat(window.getComputedStyle(this.resizableElement, null).getPropertyValue('top'));
            var calc = top_1 - (toGrowSize / 8) + 'px';
            this.resizableElement.style.top = calc;
        }
        if (![ResizePointTypeEnum.MIDDLE_LEFT, ResizePointTypeEnum.MIDDLE_RIGHT].includes(resizeDirection)) {
            var fontSize = parseFloat(window.getComputedStyle(this.resizableElement, null).getPropertyValue('font-size'));
            this.resizableElement.style.fontSize = fontSize + (toGrowSize / 8) + 'px';
        }
    };
    ResizableText.prototype.calculateToGrowSize = function (resizeDirection, clientX, left, width) {
        if ([
            ResizePointTypeEnum.MIDDLE_LEFT,
            ResizePointTypeEnum.TOP_LEFT,
            ResizePointTypeEnum.BOTTOM_LEFT,
        ].includes(resizeDirection)) {
            return left - clientX;
        }
        return clientX - (left + width);
    };
    return ResizableText;
}(Resizable));

var ResizableImage = /** @class */ (function (_super) {
    __extends(ResizableImage, _super);
    function ResizableImage(_a) {
        var contentEl = _a.contentEl, wrapperLeft = _a.wrapperLeft;
        var _this = this;
        contentEl.classList.add('content');
        _this = _super.call(this, { contentEl: contentEl, wrapperLeft: wrapperLeft, type: ResizableType.RESIZABLE_TYPE_IMAGE }) || this;
        _this.imageElement = contentEl;
        return _this;
    }
    ResizableImage.prototype.doResize = function (clientX, clientY, resizeDirection) {
        var _a = this.resizableElement.getBoundingClientRect(), left = _a.left, top = _a.top;
        var _b = this.imageElement.getBoundingClientRect(), width = _b.width, height = _b.height;
        var toGrowSize = this.calculateToGrowSize(resizeDirection, clientX, clientY, left, width, height, top);
        if (toGrowSize < 1 && height < 20) {
            return;
        }
        if (!this.isMiddlePoint(resizeDirection)) {
            var propImg = height / width;
            this.imageElement.style.height = height + (propImg * toGrowSize) + 'px';
        }
        if (this.isMiddleVerticalPoint(resizeDirection)) {
            this.imageElement.style.height = height + toGrowSize + 'px';
        }
        else if (this.isMiddleHorizontalPoint(resizeDirection)) {
            this.imageElement.style.width = width + toGrowSize + 'px';
        }
        else {
            this.imageElement.style.width = width + toGrowSize + 'px';
        }
        if ([
            ResizePointTypeEnum.MIDDLE_LEFT,
            ResizePointTypeEnum.TOP_LEFT,
            ResizePointTypeEnum.BOTTOM_LEFT,
        ].includes(resizeDirection)) {
            this.resizableElement.style.left = (left - this.wrapperLeft - toGrowSize) + 'px';
        }
        if (resizeDirection === ResizePointTypeEnum.TOP_RIGHT ||
            resizeDirection === ResizePointTypeEnum.TOP_LEFT ||
            resizeDirection === ResizePointTypeEnum.MIDDLE_TOP) {
            var top_1 = parseFloat(window.getComputedStyle(this.resizableElement, null).getPropertyValue('top'));
            var calc = top_1 - (toGrowSize) + 'px';
            this.resizableElement.style.top = calc;
        }
    };
    ResizableImage.prototype.calculateToGrowSize = function (resizeDirection, clientX, clientY, left, width, height, top) {
        if (resizeDirection === ResizePointTypeEnum.MIDDLE_TOP) {
            return top - clientY;
        }
        if (resizeDirection === ResizePointTypeEnum.MIDDLE_BOTTOM) {
            return clientY - (top + height);
        }
        if ([
            ResizePointTypeEnum.MIDDLE_LEFT,
            ResizePointTypeEnum.TOP_LEFT,
            ResizePointTypeEnum.BOTTOM_LEFT,
        ].includes(resizeDirection)) {
            return left - clientX;
        }
        return clientX - (left + width);
    };
    ResizableImage.prototype.isMiddleHorizontalPoint = function (resizeDirection) {
        return resizeDirection === ResizePointTypeEnum.MIDDLE_LEFT ||
            resizeDirection === ResizePointTypeEnum.MIDDLE_RIGHT;
    };
    ResizableImage.prototype.isMiddleVerticalPoint = function (resizeDirection) {
        return resizeDirection === ResizePointTypeEnum.MIDDLE_TOP ||
            resizeDirection === ResizePointTypeEnum.MIDDLE_BOTTOM;
    };
    ResizableImage.prototype.isMiddlePoint = function (resizeDirection) {
        return this.isMiddleHorizontalPoint(resizeDirection) || this.isMiddleVerticalPoint(resizeDirection);
    };
    return ResizableImage;
}(Resizable));

var ResizableFactory = /** @class */ (function () {
    function ResizableFactory() {
    }
    ResizableFactory.make = function (contentEl, type) {
        var _a, _b, _c, _d;
        if (type === ResizableType.RESIZABLE_TYPE_IMAGE) {
            return new ResizableImage({
                contentEl: contentEl,
                wrapperLeft: (_b = (_a = document.getElementById('wrapper')) === null || _a === void 0 ? void 0 : _a.offsetLeft) !== null && _b !== void 0 ? _b : 0,
            });
        }
        if (type === ResizableType.RESIZABLE_TYPE_TEXT) {
            return new ResizableText({
                contentEl: contentEl,
                wrapperLeft: (_d = (_c = document.getElementById('wrapper')) === null || _c === void 0 ? void 0 : _c.offsetLeft) !== null && _d !== void 0 ? _d : 0,
            });
        }
        throw new Error("Resizable type: ".concat(type, " not found"));
    };
    return ResizableFactory;
}());

var Rotate = /** @class */ (function () {
    function Rotate(contentElement, wrapperElement) {
        this.contentElement = contentElement;
        this.wrapperElement = wrapperElement;
        this.rotation = 0;
        this.mouseCoords = {
            x: 0,
            y: 0,
        };
        this.rotatePoint = document.createElement('div');
        this.rotatePoint.classList.add('rotate-point');
        this.rotatePoint.innerHTML =
            "<?xml version=\"1.0\" encoding=\"utf-8\"?>\n        <svg width=\"20px\" height=\"20px\" viewBox=\"0 0 24 24\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n            <path d=\"M12.5 20.5C17.1944 20.5 21 16.6944 21 12C21 7.30558 17.1944 3.5 12.5 3.5C7.80558 3.5 4 7.30558 4 12C4 13.5433 4.41128 14.9905 5.13022 16.238M1.5 15L5.13022 16.238M6.82531 12.3832L5.47107 16.3542L5.13022 16.238\" stroke=\"#000000\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>\n        </svg>";
        this.contentElement.appendChild(this.rotatePoint);
        this.boundStartDragEventHandler = this.startDrag.bind(this);
        this.initEvents();
    }
    Rotate.prototype.initEvents = function () {
        this.rotatePoint.addEventListener('mousedown', this.startMoving.bind(this), false);
    };
    Rotate.prototype.startMoving = function (e) {
        var _this = this;
        var stopDrag = function () {
            _this.contentElement.classList.remove('is-rotating');
            _this.wrapperElement.removeEventListener('mouseup', stopDrag, false);
            _this.wrapperElement.removeEventListener('mousemove', _this.boundStartDragEventHandler, false);
        };
        this.contentElement.classList.add('is-rotating');
        this.wrapperElement.addEventListener('mouseup', stopDrag, false);
        this.wrapperElement.addEventListener('mousemove', this.boundStartDragEventHandler, false);
        this.mouseCoords.x = e.clientX;
        this.mouseCoords.y = e.clientY;
    };
    Rotate.prototype.startDrag = function (e) {
        var mouseX = e.clientX;
        var mouseY = e.clientY;
        var _a = this.rotatePoint.getBoundingClientRect(), posY = _a.y, height = _a.height;
        var centerY = posY + (height / 2);
        var isInverted = mouseY < centerY;
        var velocity = this.mouseCoords.x !== mouseX ? (this.mouseCoords.x - mouseX) : (this.mouseCoords.y - mouseY);
        if (isInverted) {
            this.rotation -= velocity;
        }
        else {
            this.rotation += velocity;
        }
        this.mouseCoords.x = e.clientX;
        this.mouseCoords.y = e.clientY;
        this.contentElement.style.transform = "rotate(".concat(this.rotation, "deg)");
    };
    return Rotate;
}());

var ElementManipulable = /** @class */ (function () {
    function ElementManipulable(contentEl, wrapperElement, isResizable, isDragabble, type) {
        this.contentEl = contentEl;
        this.wrapperElement = wrapperElement;
        this.type = type;
        this.wrapperBounds = {
            w: 0,
            h: 0,
            x: 0,
            y: 0,
        };
        this.onStartResize = function () { };
        this.onStopResize = function () { };
        this.onElementSelect = function (_id) { };
        this.resizableElement = null;
        this.contentEl.setAttribute('contenteditable', 'false');
        this.contentWrapper = document.createElement('div');
        this.contentWrapper.classList.add('content-wrapper');
        this.contentWrapper.appendChild(this.contentEl);
        this.wrapperElement.appendChild(this.contentWrapper);
        this.id = String(new Date().getTime());
        var _a = this.wrapperElement.getBoundingClientRect(), x = _a.x, y = _a.y, width = _a.width, height = _a.height;
        this.wrapperBounds.h = height;
        this.wrapperBounds.w = width;
        this.wrapperBounds.x = x;
        this.wrapperBounds.y = y;
        this.configureElements(isDragabble, isResizable);
        this.initEvents();
    }
    ElementManipulable.prototype.configureElements = function (isDragabble, isResizable) {
        var _this = this;
        if (isDragabble) {
            new Drag(this.contentWrapper, this.wrapperBounds, this.wrapperElement);
        }
        if (isResizable) {
            this.resizableElement = ResizableFactory.make(this.contentEl, this.type);
            this.resizableElement.onStartResize = function () {
                _this.onStartResize();
            };
            this.resizableElement.onStopResize = function () {
                _this.onStopResize();
            };
        }
        new Rotate(this.contentWrapper, this.wrapperElement);
        this.setCenterPosition();
    };
    ElementManipulable.prototype.initEvents = function () {
        this.contentWrapper.addEventListener("dragstart", function (e) {
            e.preventDefault();
        });
        this.contentWrapper.addEventListener('click', this.handleSelectedElement.bind(this), false);
    };
    ElementManipulable.prototype.handleSelectedElement = function () {
        this.onElementSelect(this.id);
    };
    ElementManipulable.prototype.removeSelection = function () {
        var _a;
        this.contentWrapper.classList.remove('is-editing');
        this.contentEl.setAttribute('contenteditable', 'false');
        (_a = this.resizableElement) === null || _a === void 0 ? void 0 : _a.removeSelection();
    };
    ElementManipulable.prototype.getElement = function () {
        return this.contentEl;
    };
    ElementManipulable.prototype.getId = function () {
        return this.id;
    };
    ElementManipulable.prototype.getType = function () {
        return this.type;
    };
    return ElementManipulable;
}());

var ImageElementManipulable = /** @class */ (function (_super) {
    __extends(ImageElementManipulable, _super);
    function ImageElementManipulable(contentEl, wrapperElement, isResizable, isDragabble) {
        var _this = _super.call(this, contentEl, wrapperElement, isResizable, isDragabble, ResizableType.RESIZABLE_TYPE_IMAGE) || this;
        _this.contentEl = contentEl;
        _this.wrapperElement = wrapperElement;
        return _this;
    }
    ImageElementManipulable.prototype.setCenterPosition = function () {
        this.contentEl.onload = this.onLoadImageContent.bind(this);
    };
    ImageElementManipulable.prototype.onLoadImageContent = function () {
        var _a = this.contentWrapper.getBoundingClientRect(), height = _a.height, width = _a.width;
        this.contentWrapper.style.left = "calc(50% - ".concat(width / 2, "px)");
        this.contentWrapper.style.top = "calc(50% - ".concat(height / 2, "px)");
        var _b = this.contentEl.getBoundingClientRect(), contentElW = _b.width, contentElH = _b.height;
        this.contentEl.style.width = "".concat(contentElW, "px");
        this.contentEl.style.height = "".concat(contentElH, "px");
    };
    return ImageElementManipulable;
}(ElementManipulable));

var StyleConfigEnum;
(function (StyleConfigEnum) {
    StyleConfigEnum["BOLD"] = "bold";
    StyleConfigEnum["COLOR"] = "color";
    StyleConfigEnum["ITALIC"] = "italic";
    StyleConfigEnum["STRIKE_THROUGH"] = "strikeThrough";
    StyleConfigEnum["SUPERSCRIPT"] = "superscript";
    StyleConfigEnum["SUBSCRIPT"] = "subscript";
    StyleConfigEnum["UNDERLINE"] = "underline";
})(StyleConfigEnum || (StyleConfigEnum = {}));

// https://github.com/s00d/on-codemerge/blob/main/helpers/DomUtils.ts
var DomUtils = /** @class */ (function () {
    function DomUtils() {
    }
    DomUtils.prototype.getDeepestNodes = function (range) {
        var nodesToProcess = [];
        var deepestNodes = [];
        if (!range.collapsed) {
            var startContainer = range.startContainer;
            var endContainer = range.endContainer;
            var treeWalker = document.createTreeWalker(range.commonAncestorContainer, NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT, null);
            var currentNode = treeWalker.currentNode = startContainer;
            while (currentNode) {
                if (currentNode.nodeType === Node.TEXT_NODE && currentNode.textContent && currentNode.textContent.trim().length > 0) {
                    if (range.intersectsNode(currentNode)) {
                        var parent_1 = currentNode.parentElement;
                        if (parent_1 && this.isStyledTextNode(parent_1)) {
                            if (!deepestNodes.includes(parent_1)) {
                                deepestNodes.push(parent_1);
                            }
                        }
                        else {
                            if (range.intersectsNode(currentNode)) {
                                nodesToProcess.push(currentNode);
                            }
                        }
                    }
                }
                if (currentNode === endContainer) {
                    break;
                }
                currentNode = treeWalker.nextNode();
            }
            for (var _i = 0, nodesToProcess_1 = nodesToProcess; _i < nodesToProcess_1.length; _i++) {
                var node = nodesToProcess_1[_i];
                var newSpan = this.createSpanIfNeeded(node, range);
                if (newSpan && !deepestNodes.includes(newSpan)) {
                    deepestNodes.push(newSpan);
                }
            }
        }
        if (deepestNodes.length === 1) {
            var node = deepestNodes[0];
            if (!this.hasStyledTextNode(node)) {
                var newSpan = document.createElement('span');
                range.surroundContents(newSpan);
                deepestNodes = [newSpan];
            }
        }
        return deepestNodes;
    };
    DomUtils.prototype.hasStyledTextNode = function (node) {
        if (node.nodeType === Node.ELEMENT_NODE) {
            var element = node;
            return element.style
                .length > 0;
        }
        return false;
    };
    DomUtils.prototype.getSelectedRoot = function (selection) {
        var _a;
        var nodesToStyle = [];
        var range = selection.getRangeAt(0);
        if (!range.collapsed) {
            var range_1 = selection.getRangeAt(0);
            nodesToStyle = this.getDeepestNodes(range_1);
            console.log(3333, nodesToStyle);
        }
        else {
            var currentNode = selection.anchorNode;
            if (currentNode) {
                var span = document.createElement('span');
                if (currentNode && currentNode.tagName === 'SPAN') {
                    span = currentNode;
                }
                else {
                    var element = currentNode.parentNode;
                    if (element && element.tagName === 'SPAN') {
                        span = currentNode.parentNode;
                    }
                    else {
                        span.textContent = ' \u200B';
                        if (currentNode.nodeType === Node.TEXT_NODE) {
                            (_a = currentNode.parentNode) === null || _a === void 0 ? void 0 : _a.insertBefore(span, currentNode.nextSibling);
                        }
                        else if (currentNode.nodeType === Node.ELEMENT_NODE) {
                            currentNode.appendChild(span);
                        }
                    }
                }
                nodesToStyle = [span];
                var nextNode = range.endContainer.nextSibling;
                while (nextNode && nextNode.nodeType !== Node.TEXT_NODE) {
                    nextNode = nextNode.nextSibling;
                }
                range.setStart(span, 1);
                range.setEnd(span, 1);
                selection.removeAllRanges();
                selection.addRange(range);
            }
        }
        return nodesToStyle;
    };
    DomUtils.prototype.createSpanIfNeeded = function (node, range) {
        if (node.nodeType !== Node.TEXT_NODE || !node.textContent) {
            return null;
        }
        var text = node.textContent;
        var startOffset = node === range.startContainer ? range.startOffset : 0;
        var endOffset = node === range.endContainer ? range.endOffset : text.length;
        if (endOffset === 0 || startOffset === text.length || startOffset === endOffset) {
            return null;
        }
        var span = document.createElement('span');
        span.textContent = text.substring(startOffset, endOffset);
        this.replaceNodeWithSpan(node, span, startOffset, endOffset);
        return span;
    };
    DomUtils.prototype.replaceNodeWithSpan = function (node, span, startOffset, endOffset) {
        var text = node.textContent;
        var parent = node.parentNode;
        if (!parent || !text)
            return;
        var beforeText = document.createTextNode(text.substring(0, startOffset));
        var afterText = document.createTextNode(text.substring(endOffset));
        parent.insertBefore(beforeText, node);
        parent.insertBefore(span, node);
        parent.insertBefore(afterText, node);
        parent.removeChild(node);
    };
    DomUtils.prototype.isStyledTextNode = function (node) {
        if (!node)
            return false;
        return !node.classList.contains('on-codemerge');
    };
    DomUtils.prototype.isStyleApplied = function (spanElements, styleCommand, checkStyle) {
        return (checkStyle(spanElements, styleCommand));
    };
    DomUtils.prototype.applyStyleToDeepestNodes = function (node, styleCommand, setStyle, dynamicValue) {
        var _a;
        var fragment = document.createDocumentFragment();
        var element = node;
        setStyle(element, styleCommand, dynamicValue);
        (_a = node === null || node === void 0 ? void 0 : node.parentNode) === null || _a === void 0 ? void 0 : _a.insertBefore(fragment, node);
    };
    DomUtils.prototype.removeStyleFromDeepestNodes = function (node, styleCommand, removeStyle) {
        var _a;
        if (node.nodeType === Node.ELEMENT_NODE) {
            var element = node;
            if (this.isStyledTextNode(element)) {
                removeStyle(element, styleCommand);
                if (!element.getAttribute('style') && element.tagName === 'SPAN') {
                    var fragment = document.createDocumentFragment();
                    while (element.firstChild) {
                        fragment.appendChild(element.firstChild);
                    }
                    (_a = element.parentNode) === null || _a === void 0 ? void 0 : _a.replaceChild(fragment, element);
                }
            }
        }
    };
    return DomUtils;
}());

var _a;
var styleConfigConstant = (_a = {},
    _a[StyleConfigEnum.BOLD] = {
        name: 'Bold',
        property: 'fontWeight',
        enabledValue: 'bold',
        isComplex: false,
    },
    _a[StyleConfigEnum.ITALIC] = {
        name: 'Italic',
        property: 'fontStyle',
        enabledValue: 'italic',
        isComplex: false,
    },
    _a[StyleConfigEnum.UNDERLINE] = {
        name: 'Underline',
        property: 'textDecoration',
        enabledValue: 'underline',
        isComplex: true,
    },
    _a[StyleConfigEnum.STRIKE_THROUGH] = {
        name: 'Strike Through',
        property: 'textDecoration',
        enabledValue: 'line-through',
        isComplex: true,
    },
    _a[StyleConfigEnum.SUPERSCRIPT] = {
        name: 'Superscript',
        property: 'verticalAlign',
        enabledValue: 'super',
        isComplex: false,
    },
    _a[StyleConfigEnum.SUBSCRIPT] = {
        name: 'Subscript',
        property: 'verticalAlign',
        enabledValue: 'sub',
        isComplex: false,
    },
    _a[StyleConfigEnum.COLOR] = {
        name: 'Color',
        property: 'color',
        enabledValue: '#000000',
        isComplex: false,
    },
    _a);

var StyleManager = /** @class */ (function () {
    function StyleManager() {
    }
    StyleManager.prototype.set = function (element, styleCommand, dynamicValue) {
        var config = styleConfigConstant[styleCommand];
        if (config) {
            var value = dynamicValue !== null && dynamicValue !== void 0 ? dynamicValue : config.enabledValue;
            if (config.isComplex) {
                this.setComplexStyle(element, config.property, value);
            }
            else {
                element.style[config.property] = value;
            }
        }
    };
    StyleManager.prototype.remove = function (element, styleCommand) {
        var config = styleConfigConstant[styleCommand];
        if (config) {
            if (config.isComplex) {
                this.removeComplexStyle(element, config.property, config.enabledValue);
            }
            else {
                // @ts-ignore
                element.style[config.property] = null;
            }
        }
    };
    StyleManager.prototype.has = function (element, styleCommand) {
        var config = styleConfigConstant[styleCommand];
        if (!config) {
            return false;
        }
        var style = element.style[config.property];
        return style !== '' || style === config.enabledValue;
    };
    StyleManager.prototype.setComplexStyle = function (element, property, value) {
        var _a;
        var currentStyles = (_a = element.style[property]) === null || _a === void 0 ? void 0 : _a.toString().split(' ');
        if (currentStyles && !currentStyles.includes(value)) {
            currentStyles.push(value);
            element.style[property] = currentStyles.join(' ').trim();
        }
    };
    StyleManager.prototype.removeComplexStyle = function (element, property, value) {
        var _a;
        var currentStyles = (_a = element.style[property]) === null || _a === void 0 ? void 0 : _a.toString().split(' ').filter(function (style) { return style !== value; });
        if (currentStyles) {
            element.style[property] = currentStyles.join(' ').trim();
        }
    };
    return StyleManager;
}());

var TextElementManipulable = /** @class */ (function (_super) {
    __extends(TextElementManipulable, _super);
    function TextElementManipulable(contentEl, wrapperElement, isResizable, isDragabble) {
        var _this = _super.call(this, contentEl, wrapperElement, isResizable, isDragabble, ResizableType.RESIZABLE_TYPE_TEXT) || this;
        _this.contentEl = contentEl;
        _this.wrapperElement = wrapperElement;
        _this.domUtils = new DomUtils();
        _this.styleManager = new StyleManager();
        _this.initEventsText();
        return _this;
    }
    TextElementManipulable.prototype.initEventsText = function () {
        var _this = this;
        this.contentWrapper.addEventListener('dblclick', function (e) {
            if (e.target.classList.contains('shadow')) {
                e.target.style.display = 'none';
            }
            _this.contentWrapper.classList.add('is-editing');
            _this.contentEl.setAttribute('contenteditable', 'true');
        }, false);
    };
    TextElementManipulable.prototype.setCenterPosition = function () {
        var _a = this.contentWrapper.getBoundingClientRect(), height = _a.height, width = _a.width;
        this.contentWrapper.style.left = "calc(50% - ".concat(width / 2, "px)");
        this.contentWrapper.style.top = "calc(50% - ".concat(height / 2, "px)");
    };
    TextElementManipulable.prototype.setTextFont = function (fontFamily) {
        this.contentEl.style.fontFamily = fontFamily;
    };
    TextElementManipulable.prototype.toggleBoldInSelection = function () {
        this.appplyStyleInTextSelected(StyleConfigEnum.BOLD);
    };
    TextElementManipulable.prototype.setColorInSelection = function (color) {
        this.appplyStyleInTextSelected(StyleConfigEnum.COLOR, color);
    };
    TextElementManipulable.prototype.toggleItalicInSelection = function () {
        this.appplyStyleInTextSelected(StyleConfigEnum.ITALIC);
    };
    TextElementManipulable.prototype.toggleStrikeThroughInSelection = function () {
        this.appplyStyleInTextSelected(StyleConfigEnum.STRIKE_THROUGH);
    };
    TextElementManipulable.prototype.toggleSuperscriptInSelection = function () {
        this.appplyStyleInTextSelected(StyleConfigEnum.SUPERSCRIPT);
    };
    TextElementManipulable.prototype.toggleSubscriptInSelection = function () {
        this.appplyStyleInTextSelected(StyleConfigEnum.SUBSCRIPT);
    };
    TextElementManipulable.prototype.toggleUnderlineInSelection = function () {
        this.appplyStyleInTextSelected(StyleConfigEnum.UNDERLINE);
    };
    TextElementManipulable.prototype.appplyStyleInTextSelected = function (styleCommand, dynamicValue) {
        var _this = this;
        var _a;
        var selection = window.getSelection();
        if (!selection)
            return;
        var nodesToStyle = (_a = this.domUtils.getSelectedRoot(selection)) !== null && _a !== void 0 ? _a : [];
        nodesToStyle.forEach(function (node) {
            var isFormatted = _this.domUtils.isStyleApplied(node, styleCommand, _this.styleManager.has.bind(_this.styleManager));
            if (isFormatted) {
                _this.domUtils.removeStyleFromDeepestNodes(node, styleCommand, _this.styleManager.remove.bind(_this.styleManager));
            }
            else {
                _this.domUtils.applyStyleToDeepestNodes(node, styleCommand, _this.styleManager.set.bind(_this.styleManager), dynamicValue);
            }
        });
    };
    return TextElementManipulable;
}(ElementManipulable));

var Wrapper = /** @class */ (function () {
    function Wrapper(_a) {
        var el = _a.el;
        this.onElementSelect = function (_element) { };
        this.onNoneElementSelect = function () { };
        this.wrapperElement = el;
        this.isResizing = false;
        this.elements = new Map();
        this.wrapperElement.style.position = 'relative';
        this.initEvents();
    }
    Wrapper.prototype.addElement = function (wrapperContentElemConfig) {
        var el = this.makeElement(wrapperContentElemConfig);
        this.addElementManipulate(el);
    };
    Wrapper.prototype.makeElement = function (_a) {
        var contentEl = _a.contentEl, _b = _a.isResizable, isResizable = _b === void 0 ? false : _b, _c = _a.isDragabble, isDragabble = _c === void 0 ? false : _c;
        if (contentEl.nodeName === 'IMG') {
            return new ImageElementManipulable(contentEl, this.wrapperElement, isResizable, isDragabble);
        }
        return new TextElementManipulable(contentEl, this.wrapperElement, isResizable, isDragabble);
    };
    Wrapper.prototype.addElementManipulate = function (element) {
        var _this = this;
        element.onStartResize = function () {
            _this.isResizing = true;
        };
        element.onStopResize = function () {
            setTimeout(function () {
                // This is a hack to prevent element unselected
                _this.isResizing = false;
            }, 100);
        };
        element.onElementSelect = function (id) {
            var elem = _this.elements.get(id);
            if (!elem) {
                throw new Error("Element with id: ".concat(id, " not found."));
            }
            _this.elements.forEach(function (el) {
                if (el.getId() !== id) {
                    el.removeSelection();
                }
            });
            _this.onElementSelect(elem);
        };
        var newId = element.getId();
        this.elements.set(newId, element);
    };
    Wrapper.prototype.initEvents = function () {
        this.wrapperElement.addEventListener('click', this.handleClick.bind(this), true);
    };
    Wrapper.prototype.handleClick = function (e) {
        if (this.isResizing) {
            return;
        }
        if (e.target === this.wrapperElement) {
            this.elements.forEach(function (el) {
                el.removeSelection();
            });
            this.onNoneElementSelect();
        }
    };
    return Wrapper;
}());

exports.Wrapper = Wrapper;
