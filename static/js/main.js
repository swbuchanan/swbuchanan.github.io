import DrawController from './draw-controller.js';
import Conductor from './conductor.js';
import { getScrollPosition } from './controller-util.js'; // I guess I don't use this?
import DisplayController from './display-controller.js';

let conductor = null;

function init() {

    let controllers = [];

    if (hasElement('header-background')) {
        let controller = new HeadingController('header-background');
        controllers.push(controller);
    }

    if (hasElement('self-draw')) {
        let controller = new SelfDrawController('self-draw');
        controllers.push(controller);
    }

    if (hasElement('display-zone')) {
        displayZone = new DisplayController('display-zone');
        controllers.push(displayZone);
    }

    let drawZone, circleZoneSlider;
    if (hasElement('draw-zone')) {
        drawZone = new DrawController('draw-zone');
        controllers.push(drawZone);
    }
    if (hasElement('draw-zone-instruction')) {
        const instruction = document.getElementById('draw-zone-instruction');
        if (drawZone) {
            drawZone.onDrawingStart.push(() => instruction.classList.add('hidden'))
        }
    }
    if (hasElement('draw-zone-undo-button')) {
        const undoButton = document.getElementById('draw-zone-undo-button');
        if (drawZone) {
            undoButton.addEventListener('click', () => drawZone.undo());
        }
    }


    if (hasElement('email-text')) {
        const emailElement = document.getElementById('email-text');
        // Add my email using js so that non-js scrapers can't just get it
        const email = 'steven.buchanan' + '@' + 'anu.edu.au';
        const emailText = `<a href="mailto:${email}">${email}</a>`;
        emailElement.innerHTML = emailText;
    }


    conductor = new Conductor(controllers);
    conductor.start();
    // To let me play around with things in the console.
    window.conductor = conductor;
}

function hasElement(id) {
    return document.getElementById(id) != null;
}

/**
 * Configure the canvases to be able to handle screens with higher dpi.
 *
 * We can only call this once because after that, the width has changed!
 */
function updateCanvasSizes() {
    const pixelRatio = window.devicePixelRatio || 1;
    const canvases = document.getElementsByTagName("canvas");
    for (let canvas of canvases) {
        const width = canvas.width;
        const height = canvas.height;
        canvas.width = width * pixelRatio;
        canvas.height = height * pixelRatio;
        canvas.style.width = width + 'px';
        canvas.style.height = height + 'px';
    }
}


// updateCanvasSizes();
init();
