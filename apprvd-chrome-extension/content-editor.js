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

setTimeout(() => {
    const doc = document.querySelector(".docs-texteventtarget-iframe").contentDocument
    for (const letter of writeTextToGDoc) write(letter, doc)
}, 5000);