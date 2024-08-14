import { Wrapper } from 'html-resize';

const app = {
    wrapper: new Wrapper({
        el: document.getElementById('wrapper'),
    }),
    addElement(e) {
        const contentEl = (e.target).cloneNode(true);
        this.wrapper.addElement({
            contentEl,
            isResizable: true,
            isDragabble: true,
        });
    },
    onElementSelect(callback) {
        this.wrapper.onElementSelect = callback;
    },
    onNoneElementSelect(callback) {
        this.wrapper.onNoneElementSelect = callback;
    }
};

document.querySelectorAll('main .addElement')
.forEach((addElement) => {
    addElement.addEventListener('click', app.addElement.bind(app));
});

var elementSelected = null;

/**
 * 
 * @param {ElementManipulable} el 
 */
const onElementSelect = (el) => {
    if (el.getType() === 'text') {
        elementSelected = el;
        showTextMenu();
    }
};

app.onElementSelect(onElementSelect);
app.onNoneElementSelect(() => {
    elementSelected = null;
    hideMenu();
});

function showTextMenu() {
    document.getElementById('fontSize').value = '';
    document.getElementById('menuTop').querySelector('.menu.text').classList.add('show');
}

function hideMenu() {
    document.getElementById('menuTop').querySelectorAll('.menu').forEach(elem => {
        elem.classList.remove('show');
    });
}

document.getElementById('fontFamily').addEventListener('change', (e) => {
    if (!elementSelected) {
        return;
    }
    elementSelected.setTextFont(e.target.value);
}, false);

document.getElementById('boldText').addEventListener('click', (e) => {
    if (!elementSelected) {
        return;
    }
    elementSelected.toggleBoldInSelection();
}, false);

document.getElementById('colorText').addEventListener('change', (e) => {
    if (!elementSelected) {
        return;
    }
    elementSelected.setColorInSelection(e.target.value);
}, false);

document.getElementById('fontSize').addEventListener('change', (e) => {
    if (!elementSelected) {
        return;
    }
    elementSelected.setFontSize(e.target.value);
}, false);