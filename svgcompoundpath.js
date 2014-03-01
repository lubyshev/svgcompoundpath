/**
 * Function to convert svg document to the compound path
 * 
 * IN: string SVG document
 * 
 * OUT: object { path, x, y, width, height, missedTags[], missedAttrs[], ok
 * (boolean) - true if svg converted without distortion }
 * 
 */

var XMLDOMParser = require('xmldom').DOMParser;
var _ = require('lodash');
var SvgPath = require('svgpath');

var allowedTags = [ 'a', 'altGlyph', 'altGlyphDef', 'altGlyphItem', 'animate',
    'animateColor', 'animateMotion', 'animateTransform', 'circle', 'clipPath',
    'color-profile', 'cursor', 'defs', 'desc', 'ellipse', 'feBlend',
    'feColorMatrix', 'feComponentTransfer', 'feComposite', 'feConvolveMatrix',
    'feDiffuseLighting', 'feDisplacementMap', 'feDistantLight', 'feFlood',
    'feFuncA', 'feFuncB', 'feFuncG', 'feFuncR', 'feGaussianBlur', 'feImage',
    'feMerge', 'feMergeNode', 'feMorphology', 'feOffset', 'fePointLight',
    'feSpecularLighting', 'feSpotLight', 'feTile', 'feTurbulence', 'filter',
    'font', 'font-face', 'font-face-format', 'font-face-name', 'font-face-src',
    'font-face-uri', 'foreignObject', 'g', 'glyph', 'glyphRef', 'hkern',
    'image', 'line', 'linearGradient', 'marker', 'mask', 'metadata',
    'missing-glyph', 'mpath', 'path', 'pattern', 'polygon', 'polyline',
    'radialGradient', 'rect', 'script', 'set', 'stop', 'style', 'svg',
    'switch', 'symbol', 'text', 'textPath', 'title', 'tref', 'tspan', 'use',
    'view', 'vkern', ];

var allowedAttrs = [ 'accent-height', 'accumulate', 'additive', 'alphabetic',
    'amplitude', 'arabic-form', 'ascent', 'attributeName', 'attributeType',
    'azimuth', 'baseFrequency', 'baseProfile', 'bbox', 'begin', 'bias', 'by',
    'calcMode', 'cap-height', 'class', 'clipPathUnits', 'contentScriptType',
    'contentStyleType', 'cx', 'cy', 'd', 'descent', 'diffuseConstant',
    'divisor', 'dur', 'dx', 'dy', 'edgeMode', 'elevation', 'end', 'exponent',
    'externalResourcesRequired', 'fill', 'filterRes', 'filterUnits',
    'font-family', 'font-size', 'font-stretch', 'font-style', 'font-variant',
    'font-weight', 'format', 'from', 'fx', 'fy', 'g1', 'g2', 'glyph-name',
    'glyphRef', 'gradientTransform', 'gradientUnits', 'hanging', 'height',
    'horiz-adv-x', 'horiz-origin-y', 'id', 'ideographic', 'in', 'in2',
    'intercept', 'k', 'k1', 'k2', 'k3', 'k4', 'kernelMatrix',
    'kernelUnitLength', 'keyPoints', 'keySplines', 'keyTimes', 'lang',
    'lengthAdjust', 'limitingConeAngle', 'local', 'markerHeight',
    'markerUnits', 'markerWidth', 'maskContentUnits', 'maskUnits',
    'mathematical', 'max', 'media', 'method', 'min', 'mode', 'name', 'name',
    'numOctaves', 'offset', 'onabort', 'onactivate', 'onbegin', 'onclick',
    'onend', 'onerror', 'onfocusin', 'onfocusout', 'onload', 'onmousedown',
    'onmousemove', 'onmouseout', 'onmouseover', 'onmouseup', 'onrepeat',
    'onresize', 'onscroll', 'onunload', 'onzoom', 'operator', 'order',
    'orient', 'orientation', 'origin', 'overline-position',
    'overline-thickness', 'panose-1', 'path', 'pathLength',
    'patternContentUnits', 'patternTransform', 'patternUnits', 'points',
    'pointsAtX', 'pointsAtY', 'pointsAtZ', 'preserveAlpha',
    'preserveAspectRatio', 'primitiveUnits', 'r', 'radius', 'refX', 'refY',
    'rendering-intent', 'repeatCount', 'repeatDur', 'requiredExtensions',
    'requiredFeatures', 'restart', 'result', 'rotate', 'rx', 'ry', 'scale',
    'seed', 'slope', 'spacing', 'specularConstant', 'specularExponent',
    'spreadMethod', 'startOffset', 'stdDeviation', 'stemh', 'stemv',
    'stitchTiles', 'strikethrough-position', 'strikethrough-thickness',
    'string', 'style', 'surfaceScale', 'systemLanguage', 'tableValues',
    'target', 'targetX', 'targetY', 'textLength', 'title', 'to', 'transform',
    'type', 'u1', 'u2', 'underline-position', 'underline-thickness', 'unicode',
    'unicode-range', 'units-per-em', 'v-alphabetic', 'v-hanging',
    'v-ideographic', 'v-mathematical', 'values', 'values', 'version',
    'vert-adv-y', 'vert-origin-x', 'vert-origin-y', 'viewBox', 'viewTarget',
    'width', 'widths', 'x', 'x-height', 'x1', 'x2', 'xChannelSelector',
    'xlink:actuate', 'xlink:arcrole', 'xlink:href', 'xlink:role', 'xlink:show',
    'xlink:title', 'xlink:type', 'xml:base', 'xml:lang', 'xml:space', 'y',
    'y1', 'y2', 'yChannelSelector', 'z', 'zoomAndPan', ];

var missedTags;
var missedAttrs;
var parsingStatus;

/**
 * Main function
 * 
 */
function parseSvg(svgData) {

  missedTags = [];
  missedAttrs = [];
  parsingStatus = false;

  var path = null;
  var x = 0;
  var y = 0;
  var width = '100%';
  var height = '100%';

  var doc = (new XMLDOMParser()).parseFromString(svgData, 'application/xml');
  var svgTag = null;

  if (typeof doc != 'undefined')
    svgTag = doc.getElementsByTagName('svg')[0];

  if (typeof svgTag != 'undefined') {

    var viewBox = _.map((svgTag.getAttribute('viewBox') || '').split(' '),
        function(val) {
          return parseInt(val, 10);
        });

    var attr = {};

    _.forEach([ 'x', 'y', 'width', 'height' ], function(key) {
      attr[key] = parseInt(svgTag.getAttribute(key), 10);
    });

    x = viewBox[0] || attr.x || x;
    y = viewBox[1] || attr.y || y;
    width = viewBox[2] || attr.width || width;
    height = viewBox[3] || attr.height || height;

    if (path = parseNodeList(svgTag.childNodes))
      parsingStatus = true;
  }

  return new Object({
    'path' : path ? path : null,
    'x' : x,
    'y' : y,
    'width' : width,
    'height' : height,
    'tags' : missedTags.length > 0 ? missedTags : null,
    'attr' : missedAttrs.length > 0 ? missedAttrs : null,
    'ok' : parsingStatus,
  });

};

/**
 * Combine several paths into the compound path
 * 
 */
function pathMerge(paths) {
  var result = null;
  paths.forEach(function(val, index, array) {
    if (val && typeof val == 'string') {
      if (!result)
        result = val;
      else
        result = result + ' ' + val;
    }
  });
  return result;
}

/**
 * Parse SVG document node list and return result path
 * 
 */
function parseNodeList(nodeList) {
  var path = [];
  for (var i = 0; nodeList && (i < nodeList.length); i++) {
    if (typeof nodeList[i].tagName != 'string'
        || allowedTags.indexOf(nodeList[i].tagName) < 0)
      continue;
    path[i] = parseNode(nodeList[i]);
  }
  return pathMerge(path);
}

/**
 * Parse SVG node and return result path
 * 
 */
function parseNode(node) {
  var transform = null;
  var path = null;

  // Attributes parsing
  if (node.attributes) {
    for (var i = 0; i < node.attributes.length; i++) {
      var attr = node.attributes[i];
      if (allowedAttrs.indexOf(attr.name) < 0)
        continue;
      switch (attr.name) {
      case 'transform':
        transform = attr.value;
        break;
      case 'd':
        path = attr.value;
        break;
      default:
        if (missedAttrs.indexOf(attr.name) < 0)
          missedAttrs.push(attr.name);
      }
    }
  }

  // Tags parsing
  switch (node.tagName) {
  case 'g':
    if (node.childNodes.length > 0)
      path = parseNodeList(node.childNodes);
    else
      path = null;
    break;
  case 'path':
    break;
  default:
    if (missedTags.indexOf(node.tagName) < 0)
      missedTags.push(node.tagName);
  }

  if (path && transform) {
    path = transformPath(path, transform);
  }

  return path;

}

/**
 * Execute transform operation on the given path and return result path
 * 
 */
function transformPath(path, transform) {
  return (new SvgPath(path)).transform(transform).toString();
}

module.exports = parseSvg;
