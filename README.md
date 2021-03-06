# Marksnap.js
CLI tool for parse markdown(.md) to HTML, PDF.

### Getting started

```
    npm install marksnap -g
```

**This package requires `node` version `>= 0.10`.**

### Example usage

##### Convert to `HTML`

```javascript
    marksnap /source/file.md
```

This will generate the `HTML` file in the same directory as the source file.

You can specify the output `directory` or `name` like this:

```javascript
    marksnap /source/file.md /target_directory --name html_file
```

You don't need to specify the file extension, `Marksnap` will generating that.

##### Convert to `PDF`

If you want the `PDF` version, you just simply add a parameter like this:

```javascript
    marksnap /source/file.md --pdf
```

##### Convert multiple files

```javascript
    marksnap --multi /source/*.md some-other.md another.md
```
or
```javascript
    marksnap --multi /source/*.md some-other.md another.md ~/output-directory
```

### Notices

##### `images` in `markdown` file

If you have some `images` in your `markdown` file and image links are from
local file-system, then in `HTML` converting, just for sharing, you better use
`relative path`, and put the images and output `HTML` file in the same
directory, then you can pack this directory and send to anyone.

In `PDF` converting, you need to use `absolute path` for local images, so the
converter can read your image files, and pack them in one `PDF` file.

In next version, `Marksnap` will do this `path converting` automatically.


## TODO

~~1. [Solved]Capable of converting `.md` to `.html` and `pdf`~~

~~2. [Solved]Can specify output file path~~

~~3. [Solved]Convert to a randomly named file in the `source` directory by default~~

4. Convert local image file links automatically
5. If converting to `.html` and specified an output directory, copy all local
images to the directory
6. Write a render engine for both `HTML` and `PDF`
7. Add a little more flavors to standard `markdown`


## Special thanks to:

[markdown-js](https://github.com/evilstreak/markdown-js)

[markdown-pdf](https://github.com/alanshaw/markdown-pdf)


## License

Apache license V2. Copyright @ 2015 [AaronJan](https://github.com/AaronJan)

