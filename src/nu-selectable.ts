/**
 * nuSelectable
 * Copyright (c) 2017, Jacek Spławski
 * Copyrights licensed under The MIT License (MIT)
 */

export class NuSelectable {
    container: Element;
    options: any;
    selection: Element;
    items: Element[];
    itemData: any[];
    selecting: boolean;
    pos: number[];
    touchable: boolean;

    _mouseDownBound: any;
    _mouseMoveBound: any;
    _mouseUpBound: any;

    constructor(container: string, options) {
        const defaults = {
            onSelect: function () { },
            onUnSelect: function () { },
            onClear: function () { }
        };

        this.options = { ...defaults, ...options };

        this.container = document.querySelector(container);
        this.items = this.container.querySelectorAll(this.options.items);
        this.selection = document.createElement('div');
        this.selection.className = this.options.selectionClass;

        this.touchable = this._isTouchDevice();

        this._mouseDownBound = this._mouseDown.bind(this);
        this._mouseMoveBound = this._mouseMove.bind(this);
        this._mouseUpBound = this._mouseUp.bind(this);

        this.init();
    }

    init() {
        if (!this.options.autoRefresh) {
            this.itemData = this._cacheItemData();
        }
        this.selecting = false;
        this._normalizeContainer();
        this._bindEvents();
        return true;
    };

    _normalizeContainer() {
        const css = {
            '-webkit-touch-callout': 'none',
            '-webkit-user-select': 'none',
            '-khtml-user-select': 'none',
            '-moz-user-select': 'none',
            '-ms-user-select': 'none',
            'user-select': 'none'
        };

        Object.entries(css).forEach(([key, value]) => {
            (this.container as HTMLElement).style[key] = value;
        });
    };

    _cacheItemData() {
        const itemData = [];

        this.items.forEach(item => {
            itemData.push({
                element: item,
                selected: item.classList.contains(this.options.selectedClass),
                selecting: false,
                position: item.getBoundingClientRect(),
            });
        });

        return itemData;
    };

    _collisionDetector() {
        const selector = this.selection.getBoundingClientRect();

        this.itemData.forEach(item => {
            const collided = !(selector.right < item.position.left ||
                selector.left > item.position.right ||
                selector.bottom < item.position.top ||
                selector.top > item.position.bottom);

            if (collided) {
                if (item.selected) {
                    item.element.classList.remove(this.options.selectedClass);
                    item.selected = false;
                }

                if (!item.selected) {
                    item.element.classList.add(this.options.selectedClass);
                    item.selected = true;
                    this.options.onSelect(item.element);
                }
            } else {
                if (this.selecting) {
                    item.element.classList.remove(this.options.selectedClass);
                    this.options.onUnSelect(item.element);
                }
            }
        });
    };

    _createSelection(x, y) {
        const css = {
            'position': 'absolute',
            'top': y + 'px',
            'left': x + 'px',
            'width': '0',
            'height': '0',
            'z-index': '999',
            'overflow': 'hidden',
        };

        Object.entries(css).forEach(([key, value]) => {
            (this.selection as HTMLElement).style[key] = value;
        });

        (this.container as any).append(this.selection);
    };

    _drawSelection(width, height, x, y) {
        const css = {
            'width': width + 'px',
            'height': height + 'px',
            'top': y + 'px',
            'left': x + 'px',
        };

        Object.entries(css).forEach(([key, value]) => {
            (this.selection as HTMLElement).style[key] = value;
        });
    };

    clear() {
        this.items.forEach(item => {
            item.classList.remove(this.options.selectedClass);
        });
        this.options.onClear();
    };

    _mouseDown(event) {
        event.preventDefault();
        event.stopPropagation();

        if (this.options.disable) {
            return false;
        }

        if (this.options.autoRefresh) {
            this.itemData = this._cacheItemData();
        }

        if (event.metaKey || event.ctrlKey) {
            this.selecting = false;
        } else {
            this.selecting = true;
        }

        this.pos = [event.pageX, event.pageY];
        this._createSelection(event.pageX, event.pageY);
    };

    _mouseMove(event) {
        event.preventDefault();
        event.stopPropagation();

        const pos = this.pos;

        if (!pos) {
            return false;
        }

        const newpos = [event.pageX, event.pageY];
        const width = Math.abs(newpos[0] - pos[0]);
        const height = Math.abs(newpos[1] - pos[1]);
        const top = (newpos[0] < pos[0]) ? (pos[0] - width) : pos[0];
        const left = (newpos[1] < pos[1]) ? (pos[1] - height) : pos[1];

        this._drawSelection(width, height, top, left);
        this._collisionDetector();

    };

    _mouseUp(event) {
        event.preventDefault();
        event.stopPropagation();

        if (!this.pos) {
            return false;
        }

        this.selecting = false;
        this.selection.remove();

        if (event.pageX === this.pos[0] && event.pageY === this.pos[1]) {
            this.clear();
        }
    };

    _bindEvents() {
        if (this.touchable) {
            this.container.addEventListener('touchstart', this._mouseDownBound);
            this.container.addEventListener('touchmove', this._mouseMoveBound);
            document.addEventListener('touchend', this._mouseUpBound);
        } else {
            this.container.addEventListener('mousedown', this._mouseDownBound);
            this.container.addEventListener('mousemove', this._mouseMoveBound);
            document.addEventListener('mouseup', this._mouseUpBound);
        }
    };

    _unbindEvents() {
        if (this.touchable) {
            this.container.removeEventListener('touchstart', this._mouseDownBound);
            this.container.removeEventListener('touchmove', this._mouseMoveBound);
            document.removeEventListener('touchend', this._mouseUpBound);
        } else {
            this.container.removeEventListener('mousedown', this._mouseDownBound);
            this.container.removeEventListener('mousemove', this._mouseMoveBound);
            document.removeEventListener('mouseup', this._mouseUpBound);
        }
    }

    _isTouchDevice() {
        // works on most browsers || works on IE10/11 and Surface
        return !!('ontouchstart' in window || navigator.maxTouchPoints);
    };

    destroy() {
        this._unbindEvents();
    }
}
