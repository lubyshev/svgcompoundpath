var XMLDOMParser = require('xmldom').DOMParser;

var tags;
var attr;
var path;

/**
 * Main function
 * 
 * @param string svgData
 * @return array 
	{ 'tags', 'attr', 'path', };
 */
function parseSvg( svgData){};

/**
 * Callback to trace tags and attributes that were missed 
 * 
 * @param integer err Error code or 0 if all is right
 * @param string tag parsed tag
 * @param string attr parsed attribute
 * 
 * @return void 
 */
function errorCallBack( err, tag, attr ){}

/**
 * Loop for XMLNodeList collection
 * 
 * @param array Array of XMLNode`s
 * @param callback Callback function ( error, tagName, attrName)
 * 
 * @return string result path
 */
function parseNodeList( nodeList, callback){}

/**
 * Parse the `g` tag
 * 
 * @param array Array of XMLNode`s
 * @param callback Callback function ( error, tagName, attrName)
 * 
 * @return string result path
 */
function parseGroup( nodeList, callback){}

/**
 * Parse `path` tag
 * 
 * @param XMLNode Node
 * @param callback Callback function ( error, tagName, attrName)
 * 
 * @return string result path
 */
function parsePath( node, callback){}

/**
 * Parse XMLNode attributes
 * 
 * @param XMLNode Node
 * @param callback Callback function ( error, tagName, attrName)
 * 
 * @return string result path
 */
function parseAttributes( node, callback){}

module.exports = parseSvg; 
