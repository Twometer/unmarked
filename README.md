# Unmarked

Unmarked is designed to do the reverse of what [marked](https://github.com/markedjs/marked) does. It's an HTML to Markdown converter.

Unmarked is lossless in the sense, that when using `marked` and `unmarked` to perform the round trip `Markdown -> HTML -> Markdown -> HTML`, the HTML is always identical.

Note however, that it is _not_ possible to reconstruct the input Markdown with 100% accuracy, since the `Markdown -> HTML` compilation step is lossy. Information such as "is the list enumerated with `*` or `-`" or "was this codeblock made with fences ore indendation" etc. cannot be reconstructed.

## Compatibility

The library should work with most GitHub Flavored Markdown features. See `test/bench.md` for an example file which is fully supported.

If you find an important feture missing, open an issue.
