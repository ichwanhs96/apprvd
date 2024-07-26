init()

async function init() {
    return new Promise(function (resolve, reject) {
        initiateFloatingButtons();
        resolve(true);
      });
}

function initiateFloatingButtons() {
    const floatingHtml = `<div>
        <a href="#" id="apprvd-main-floating-button" class="apprvd-float apprvd-main-float">
            <i class="apprvd-checkmark"></i>
        </a>
        <div id="apprvd-translate-content" class="apprvd-translate-float">
            <p class="apprvd-textbox">This will contain translate function</p>
            <a href="#" id="apprvd-translate-floating-button" class="apprvd-float">
                <i class="apprvd-checkmark"></i>
            </a>
        </div>
        <div id="apprvd-review-content" class="apprvd-review-float">
            <p class="apprvd-textbox">This will contain review with AI function</p>
            <a href="#" id="apprvd-review-floating-button" class="apprvd-float">
                <i class="apprvd-checkmark"></i>
            </a>
        </div>
        <div id="apprvd-summary-content" class="apprvd-summary-float">
            <p class="apprvd-textbox">This will contain summary function</p>
            <a href="#" id="apprvd-summary-floating-button" class="apprvd-float">
                <i class="apprvd-checkmark"></i>
            </a>
        </div>
        <div id="apprvd-template-content" class="apprvd-template-float">
            <p class="apprvd-textbox">This will contain template function</p>
            <a href="#" id="apprvd-template-floating-button" class="apprvd-float">
                <i class="apprvd-checkmark"></i>
            </a>
        </div>
    </div>`;

    let mainDiv = document.createElement("div");
    mainDiv.insertAdjacentHTML('beforeEnd', floatingHtml);
    document.body.appendChild(mainDiv);
}

// TODO: check if the floating buttons are already created
var mainFloatingButton = document.getElementById('apprvd-main-floating-button');
var translateFloatingButton = document.getElementById('apprvd-translate-floating-button');
var reviewFloatingButton = document.getElementById('apprvd-review-floating-button');
var summaryFloatingButton = document.getElementById('apprvd-summary-floating-button');
var templateFloatingButton = document.getElementById('apprvd-template-floating-button');

var translateFloatingContent = document.getElementById('apprvd-translate-content');
var reviewFloatingContent = document.getElementById('apprvd-review-content');
var summaryFloatingContent = document.getElementById('apprvd-summary-content');
var templateFloatingContent = document.getElementById('apprvd-template-content');

isFloatingButtonCollapsed = true;

mainFloatingButton.addEventListener("click", function (e) {
    if (isFloatingButtonCollapsed) {
        translateFloatingContent.style.visibility = 'visible';
        reviewFloatingContent.style.visibility = 'visible';
        summaryFloatingContent.style.visibility = 'visible';
        templateFloatingContent.style.visibility = 'visible';
        isFloatingButtonCollapsed = false;
    } else {
        translateFloatingContent.style.visibility = 'hidden';
        reviewFloatingContent.style.visibility = 'hidden';
        summaryFloatingContent.style.visibility = 'hidden';
        templateFloatingContent.style.visibility = 'hidden';
        isFloatingButtonCollapsed = true;
    }
}, false)

// GOOGLE DOCS FUNCTIONS

// dispatch event to write to google docs when user click translate
translateFloatingButton.addEventListener("click", function (e) {
    writeTextToGDoc('hello world v2');
}, false)

// handle click event to get selected text on gdoc
reviewFloatingButton.addEventListener("click", function (e) {
    getSelectedTextInGDoc();
}, false)

// write letter to gdoc
function writerToGdoc(letter, doc) {
    const i = new KeyboardEvent("keypress", {
        repeat: !1,
        isComposing: !1,
        bubbles: !0,
        cancelable: !0,
        ctrlKey: !1,
        shiftKey: !1,
        altKey: !1,
        metaKey: !1,
        target: doc,
        currentTarget: doc,
        key: letter,
        code: "Key" + letter.toUpperCase(),
        keyCode: letter.codePointAt(0),
        charCode: letter.codePointAt(0),
        which: letter.codePointAt(0),
        ...{}
    })
    doc.dispatchEvent(i)
}

function writeTextToGDoc(text) {
  const doc = document.querySelector(".docs-texteventtarget-iframe").contentDocument;
  for (const letter of text) writerToGdoc(letter, doc);
}

function getSelectedTextInGDoc(elementCurrentPage) {
    const doc = document.querySelector(".docs-texteventtarget-iframe").contentDocument;
    console.log("this is the selected text: " + doc.getSelection().toString());
    return doc.getSelection().toString()
}

function getGdocCurrentPageKixElement() {
    const doc = document.querySelector(".kix-page-paginated").contentDocument;
    return doc.querySelector(".kix-page");
}

function getSelectedLineOfText(page) {
  const overlaps = (a, b) => a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top
  const selectionRects = $(".kix-canvas-tile-selection > svg > rect", page).get()
    .map(el => el.getBoundingClientRect())
  // Using text elements on that page and the selection rects, find the actual selected line of text.
  const textElements $("svg > g[role=paragraph] > rect", page).get(); 
}