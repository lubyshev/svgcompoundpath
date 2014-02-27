var fs = require('fs');
var parseSvg = require('./svg');

var fileSource = process.argv[2] ? process.argv[2] : __dirname + '/default.svg'; 
var fileDestination = process.argv[3] ? process.argv[3] : null; 




var source = fs.readFileSync( fileSource, { 'encoding' : 'utf8'});

var	pathObj  = import_svg_image(source);
console.log( pathObj);
	
	function import_svg_image(data, file) {
		var parsed = parseSvg( data);
		
		return parsed;
		
		
/*
  	var xmlDoc = (new XMLDOMParser()).parseFromString(data, 'application/xml');

	  var customIcons = N.app.fontsList.getFont('custom_icons');

	  // Allocate reference code, used to show generated font on fontello page
	  // That's for internal needs, don't confuse with glyph (model) code
	  var maxRef = _.max(customIcons.glyphs(), function(glyph) {
	    return utils.fixedCharCodeAt(glyph.charRef);
	  }).charRef;

	  var allocatedRefCode = (!maxRef) ? 0xe800 : utils.fixedCharCodeAt(maxRef) + 1;
	  var svgTag = xmlDoc.getElementsByTagName('svg')[0];
	  var pathTags = xmlDoc.getElementsByTagName('path');

	  if (pathTags.length !== 1) {
	    N.wire.emit('notify', t('error.bad_svg_image', { name: file.name }));
	  }

	  var d = pathTags[0].getAttribute('d');

	  // getting viewBox values array
	  var viewBox = _.map(
	    (svgTag.getAttribute('viewBox') || '').split(' '),
	    function(val) { return parseInt(val, 10); }
	  );

	  // getting base parameters

	  var attr = {};

	  _.forEach(['x', 'y', 'width', 'height'], function(key) {
	    attr[key] = parseInt(svgTag.getAttribute(key), 10);
	  });

	  var x = viewBox[0] || attr.x || 0;
	  var y = viewBox[1] || attr.y || 0;
	  var width = viewBox[2] || attr.width;
	  var height = viewBox[3] || attr.height;

	  // Scale to standard grid
	  var scale = 1000 / height;
	  d = new SvgPath(d)
	            .translate(-x, -y)
	            .scale(scale)
	            .abs()
	            .round(1)
	            .toString();
	  width = Math.round(width * scale); // new width

	  var glyphName = basename(file.name.toLowerCase(), '.svg').replace(/\s/g, '-');

	  customIcons.addGlyph({
	    css: glyphName,
	    code: allocatedRefCode,
	    charRef: allocatedRefCode++,
	    search: [glyphName],
	    svg: {
	      path: d,
	      width: width
	    }
	  });
*/	  
	}


