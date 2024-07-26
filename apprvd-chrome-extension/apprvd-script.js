// A generic onclick callback function.
chrome.contextMenus.onClicked.addListener(genericOnClick);

const writeTextToGDoc = 'hello world'

// write letter to gdoc
function write(letter, doc) {
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

function getSelectionText() {
    var text = "";
    if (window.getSelection) {
        text = window.getSelection().toString();
    } else if (document.selection && document.selection.type != "Control") {
        text = document.selection.createRange().text;
    }
    return text;
}

// A generic onclick callback function.
function genericOnClick(info) {
  switch (info.menuItemId) {
    case 'analyze':
        // TODO: pull highlighted text and send to LLM backend
        document.getElementById('human-chat').innerHTML = getSelectionText();;
        // TODO: send API request to LLM backend
        document.getElementById('bot-chat').innerHTML = 'Analyze item clicked.';
        break;
    case 'write':
        const doc = document.querySelector(".docs-texteventtarget-iframe").contentDocument
        for (const letter of writeTextToGDoc) write(letter, doc)

        // do nothing
        break;
    default:
      // Standard context menu item function
      console.log('Standard context menu item clicked.');
  }
}
chrome.runtime.onInstalled.addListener(function () {
    // Create a button for the text of the highlighted element and send to backend
    chrome.contextMenus.create({
        title: 'Analyze',
        id: 'analyze'
    });

    chrome.contextMenus.create({
        title: 'Write something',
        id: 'write'
    });

    chrome.contextMenus.create({
        title: 'Consult with expert',
        id: 'consult'
    });
});