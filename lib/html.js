const domino = require('domino')

function parseHtml(html) {
    return domino.createWindow(html).document
}

function isOrHasParentOfType(node, type) {
    do {
        if (node.nodeName == type) return true
        node = node.parentNode
    } while (node != null)
    return false
}

function hasParentOfType(node, type) {
    while ((node = node.parentNode) != null) {
        if (node.nodeName == type) return true
    }
    return false
}

module.exports = { parseHtml, isOrHasParentOfType, hasParentOfType }
