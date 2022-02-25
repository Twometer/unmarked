const domino = require('domino')

function parseHtml(html) {
    return domino.createWindow(html).document
}

function hasParentOfType(node, type) {
    do {
        if (node.nodeName == type) return true
        node = node.parentNode
    } while (node != null)
    return false
}

module.exports = { parseHtml, hasParentOfType }
