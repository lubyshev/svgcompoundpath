var fs = require('fs');
var parseSvg = require('./svgcompoundpath');
var SvgPath = require('svgpath');

var fileSource = process.argv[2] ? process.argv[2] : null;
var fileDestination = process.argv[3] ? process.argv[3] : null;

if (!fileSource) {
  console.log('Syntax:');
  console.log('$ node ./app.js source.svg [destionation.svg]');
} else {

  var source = fs.readFileSync(fileSource, {
    'encoding' : 'utf8'
  });
  var pathObj = import_svg_image(source, fileDestination);

}

function import_svg_image(data, file) {
  var parsed = parseSvg(data);
  if (parsed.ok) {
    if (parsed.path) {

      /*
       * Some viewports are not include the picture
       * 
       * var scale = 1000 / parsed.height; parsed.path = new
       * SvgPath(parsed.path).translate(-parsed.x, -parsed.y)
       * .scale(scale).abs().round(1).toString(); width =
       * Math.round(parsed.width * scale); // new width
       */
      var newDocument = [
          '<?xml version="1.0" standalone="no"?>',
          '<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">',
          '<svg xmlns="http://www.w3.org/2000/svg">', '<path d="{$path}" />', ]
          .join('\n');

      newDocument = newDocument.replace(/\{\$path\}/g, parsed.path);
      if (file)
        fs.writeFileSync(file, newDocument, {
          'encoding' : 'utf8'
        });
      else
        console.log(newDocument);
      return parsed;
    }
  }
  console.log("There are some errors.");
}
