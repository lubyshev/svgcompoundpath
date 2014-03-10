'use strict';

var XMLDOMParser = require('xmldom').DOMParser;
var _ = require('lodash');
var SvgPath = require('svgpath');

var allowedTags = {
  desc: true,
  title: true
};

var allowedAttrs = {};
[ 'alignment-baseline', 'baseline-shift', 'class', 'clip', 'clip-path', 'clip-rule',
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
].forEach(function(val){
  allowedAttrs[val] = true;
});

/**
 * Parse SVG node and return result path
 * 
 */
function parseNode(node, state) {
  var transform;
  var path;

  // Node is not a comment
  if(node.tagName){
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
          if (state.ignoredAttrs.indexOf(attr.name) < 0){
            state.ignoredAttrs.push(attr.name);
          }
        }
      }
    }
  
    // Tags parsing
    switch (node.tagName) {
    case 'g':
      if (node.childNodes.length > 0){
        path = parseNodeList(node.childNodes, state);
      } else {
        path = null;
      }
      break;
    case 'path':
      break;
    default:
      if (state.ignoredTags.indexOf(node.tagName) < 0){
        state.ignoredTags.push(node.tagName);
      }
    }
  }

  if (path && transform) {
    path = (new SvgPath(path)).transform(transform).toString();
  }

  return path;

}

/**
 * Parse SVG document node list and return result path
 * 
 */
function parseNodeList(nodeList, state) {
  var path = [];
  for (var i = 0; i < nodeList.length; i++) {
    if ( allowedTags[ nodeList[i].tagName ] === true){
      continue;
    }
    path[i] = parseNode(nodeList[i], state);
  }
  state.ok = path.length > 0 ?
    path.length > 1 ? false : true
    : false;
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
 *    x,
 *    y,
 *    width,
 *    height,
 *    ignoredTags[],
 *    ignoredAttributes[],
 *    ok,
 * }
 * 
 */

function parseSvg(svgData) {
  var state = {
    ignoredTags: [],
    ignoredAttrs:[],
    ok: false,
  };

  var path = null;
  var x = 0;
  var y = 0;
  var width = 0;
  var height = 0;

  var doc = (new XMLDOMParser()).parseFromString(svgData, 'application/xml');
  var svgTag = null;

  if (doc){
    svgTag = doc.getElementsByTagName('svg')[0];
  }

  if (svgTag) {

    var viewBox = _.map(
      (svgTag.getAttribute('viewBox') || '').replace(/\,/,' ').replace(/s{2,}/,' ').split(' '),
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
    
    // TODO: Calculate the bounding box and set correct width and height
    if(width > 0 && height > 0){
      path = parseNodeList(svgTag.childNodes, state);
    }
  }

  return {
    path : path ? path : '',
    x : x,
    y : y,
    width : width,
    height : height,
    ignoredTags : state.ignoredTags.length > 0 ? state.ignoredTags : null,
    ignoredAttributes : state.ignoredAttrs.length > 0 ? state.ignoredAttrs : null,
    ok : state.ok,
  };

}

module.exports = parseSvg;
