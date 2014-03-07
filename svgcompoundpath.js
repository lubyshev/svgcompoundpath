'use strict';

var XMLDOMParser = require('xmldom').DOMParser;
var _ = require('lodash');
var SvgPath = require('svgpath');

var allowedTags = {
  desc: true,
  title: true
};

var allowedAttrs = _.mapValues(
  _.zipObject([
    'alignment-baseline', 'baseline-shift', 'class', 'clip', 'clip-path', 'clip-rule',
    'color', 'color-interpolation', 'color-interpolation-filters', 'color-profile',
    'color-rendering', 'cursor', 'd', 'direction', 'display', 'dominant-baseline',
    'enable-background', 'externalResourcesRequired', 'fill', 'fill-opacity', 'fill-rule',
    'filter', 'flood-color', 'flood-opacity', 'font-family', 'font-size', 'font-size-adjust',
    'font-stretch', 'font-style', 'font-variant', 'font-weight', 'glyph-orientation-horizontal',
    'glyph-orientation-vertical', 'image-rendering', 'kerning', 'letter-spacing',
    'lighting-color', 'marker-end', 'marker-mid', 'marker-start', 'mask', 'opacity',
    'overflow', 'pathLength', 'pointer-events', 'requiredFeatures', 'requiredExtensions',
    'shape-rendering', 'stop-color', 'stop-opacity', 'stroke', 'stroke-dasharray',
    'stroke-dashoffset', 'stroke-linecap', 'stroke-linejoin', 'stroke-miterlimit',
    'stroke-opacity', 'stroke-width', 'style', 'text-anchor', 'text-decoration',
    'text-rendering', 'transform', 'unicode-bidi', 'visibility', 'word-spacing',
    'writing-mode'
  ]),
  function() { return true; }
);

var parsingStatus;

/**
 * Execute transform operation on the given path and return result path
 * 
 */
function transformPath(path, transform) {
  return (new SvgPath(path)).transform(transform).toString();
}


/**
 * Parse SVG node and return result path
 * 
 */
function parseNode(node, ignored) {
  var transform = null;
  var path = null;

  // Attributes parsing
  if (node.attributes) {
    var attrLen = node.attributes.length;
    for (var i = 0; i < attrLen; i++) {
      var attr = node.attributes[i];
      if (allowedAttrs[ attr.name ] !== true ){
        continue;
      }
      switch (attr.name) {
      case 'transform':
        transform = attr.value;
        break;
      case 'd':
        path = attr.value;
        break;
      default:
        if (ignored.attrs.indexOf(attr.name) < 0){
          ignored.attrs.push(attr.name);
        }
      }
    }
  }

  // Tags parsing
  switch (node.tagName) {
  case 'g':
    if (node.childNodes.length > 0){
      path = parseNodeList(node.childNodes, ignored);
    } else {
      path = null;
    }
    break;
  case 'path':
    break;
  default:
    if (ignored.tags.indexOf(node.tagName) < 0){
      ignored.tags.push(node.tagName);
    }
  }

  if (path && transform) {
    path = transformPath(path, transform);
  }

  return path;

}

/**
 * Parse SVG document node list and return result path
 * 
 */
function parseNodeList(nodeList, ignored) {
  var path = [];
  for (var i = 0; i < nodeList.length; i++) {
    if ( allowedTags[ nodeList[i].tagName ] === true){
      continue;
    }
    path[i] = parseNode(nodeList[i], ignored);
  }
  return path.join(' ');
}

/**
 * Main function.
 * Convert svg document with different tags to the compound path document
 * 
 * @param string svgData SVG document
 * 
 * @return {
 *    path,
 *    x, y, width, height,
 *    ignoredTags[],
 *    ignoredAttrs[],
 *    ok,
 * }
 * 
 */

function parseSvg(svgData) {
  var ignored = {
    tags: [],
    attrs:[],
  };

  parsingStatus = false;

  var path = null;
  var x = 0;
  var y = 0;
  var width = '100%';
  var height = '100%';

  var doc = (new XMLDOMParser()).parseFromString(svgData, 'application/xml');
  //var doc = (new XMLDOMParser()).parseFromString('asdfsdfas', 'application/xml');
  var svgTag = null;

  if (doc){
    svgTag = doc.getElementsByTagName('svg')[0];
  }

  if (svgTag) {

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

    path = parseNodeList(svgTag.childNodes, ignored);
    if (path){
      parsingStatus = true;
    }
  }

  return {
    'path' : path ? path : null,
    'x' : x,
    'y' : y,
    'width' : width,
    'height' : height,
    'ignoredTags' : ignored.tags.length > 0 ? ignored.tags : null,
    'ignoredAttributes' : ignored.attrs.length > 0 ? ignored.attrs : null,
    'ok' : parsingStatus,
  };

}

module.exports = parseSvg;
