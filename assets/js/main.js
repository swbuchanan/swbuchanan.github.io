import DrawController from './draw-controller.js';
import Conductor from './conductor.js';

function init() {
    const drawCanvas = document.getElementById('draw-zone');
    if (drawCanvas) {
        const drawZone = new DrawController('draw-zone');
        const instruction = document.getElementById('draw-zone-instruction');
        const undoButton = document.getElementById('draw-zone-undo-button');

        if (instruction) {
            drawZone.onDrawingStart.push(() => instruction.classList.add('hidden'));
        }
        if (undoButton) {
            undoButton.addEventListener('click', () => drawZone.undo());
        }

        const conductor = new Conductor([drawZone]);
        conductor.start();
    }

    const emailElement = document.getElementById('email-text');
    if (emailElement) {
        // Add my email using js so that non-js scrapers can't just get it
        const email = 'steven.buchanan' + '@' + 'anu.edu.au';
        const emailText = `<a href="mailto:${email}">${email}</a>`;
        emailElement.innerHTML = emailText;
    }
}

init();
