var fs = require('fs');
var parseSvg = require('./svgcompoundpath');

var fileSource = process.argv[2] ? process.argv[2] : null;
var fileDestination = process.argv[3] ? process.argv[3] : null;

if (!fileSource) {
  console.log('Syntax:');
  console.log('$> node ./app.js source.svg [destionation.svg]');
} else {

  var source = fs.readFileSync(fileSource, {
    'encoding' : 'utf8'
  });
  var pathObj = import_svg_image(source, fileDestination);

}

function import_svg_image(data, file) {
  var parsed = parseSvg(data);
  // console.log(parsed);
  if (parsed.ok) {
    if (parsed.path) {
      var templ = fs.readFileSync(__dirname + '/template.svg.tpl', {
        'encoding' : 'utf8'
      });
      templ = templ.replace(/\{\$path\}/g, parsed.path);
      if (file)
        fs.writeFileSync(file, templ, {
          'encoding' : 'utf8'
        });
      else
        console.log(templ);
      return parsed;
    }
  }
  console.log("There are some errors.");
}
