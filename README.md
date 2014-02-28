svgcompoundpath
===============

Convert SVG document to the document with compound path only.

Install
-------

Clone project from github
```
$ git clone https://github.com/lubyshev/svgcompoundpath [install_dir]`
```

Go to the install directory
```
$ cd [install_dir]
```

Install project dependencies
```
$ npm install
```

Run
---

Go to the project directory
```
$ cd [install_dir]
```

Convert test-01.svg  
```
$ node ./app.js ./examples/test-01.svg
```

Convert test-01.svg and save to the /tmp/output.svg file
```
$ node ./app.js ./examples/test-01.svg /tmp/output.svg
```
