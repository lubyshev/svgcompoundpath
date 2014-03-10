'use strict';

var fs = require('fs');
var parseSvg = require('./svgcompoundpath');
var SvgPath = require('svgpath');

var fileSource = process.argv[2] ? process.argv[2] : null;
var fileDestination = process.argv[3] ? process.argv[3] : null;

function import_svg_image(data, file) {
  var parsed = parseSvg(data);
  var errString;
  if (parsed.ok) {
    if (parsed.path) {
      parsed.path = new SvgPath(parsed.path);
      if (parsed.height !== '100%') {
        var scale = 1000 / parsed.height;
        parsed.path = parsed.path.translate(-parsed.x, -parsed.y).scale(scale)
            .abs();
        parsed.width = Math.round(parsed.width * scale); // new width
        parsed.height = 1000;

      }
      parsed.path = parsed.path.round(1).toString();
      var newDocument = [
          '<?xml version="1.0" standalone="no"?>',
          '<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">',
          '<svg x="$x" y="$y" width="$width" height="$height" xmlns="http://www.w3.org/2000/svg">',
          '<path d="$path" />', '</svg>'
        ].join('\n');

      [ 'x', 'y', 'width', 'height', 'path' ].forEach(function(val) {
        var pat = new RegExp('\\$' + val, 'g');
        newDocument = newDocument.replace(pat, parsed[val]);
      });

      if (file) {
        fs.writeFileSync(file, newDocument, {
          'encoding' : 'utf8'
        });
        console.log('Output: ' + file);
      } else {
        console.log(newDocument);
      }
    }
  }
  
  
  if( parsed.path === ''){
    if( ! parsed.ok){
      errString = 'Invalid file';
    } else {
      errString = 'Image import failed';
    }
  } else {
    if( ! parsed.ignoredTags && ! parsed.ignoredAttributes && !parsed.hasManySources ){
      errString = 'That`s all right';
    } else {
      var ignoredString = '';
      if(parsed.ignoredTags){
        ignoredString += ' Ignored tag(s): ' + parsed.ignoredTags.join(', ') + '.';
      }
      if(parsed.ignoredAttributes){
        ignoredString += ' Ignored attribute(s): ' + parsed.ignoredAttributes.join(', ') + '.';
      }
      errString = 'If result is not the same as need try to convert with an editor.' + ignoredString;
    }
  }
  
  console.log(errString);
}

if (!fileSource) {
  console.log('Syntax:');
  console.log('$ node ./app.js source.svg [destionation.svg]');
} else {
  var source = fs.readFileSync(fileSource, {
    'encoding' : 'utf8'
  });
  import_svg_image(source, fileDestination);
}
