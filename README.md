# Unmarked

Unmarked is designed to do the reverse of what [marked](https://github.com/markedjs/marked) does. It's an HTML to Markdown converter.

## Compatibility

The library should work with most GitHub Flavored Markdown features. See `test/bench.md` for an example file which is fully supported.

Unmarked is lossless in the sense, that when using `marked` and `markdown` to perform the round trip `Markdown -> HTML -> Markdown -> HTML`, the HTML is always identical. It is not possible to restore the input Markdown 100% perfectly, since `Markdown -> HTML` the compilation loses information (e.g. is the list enumerated with `*` or `~`, was this codeblock made with fences ore indendation, ...?)
