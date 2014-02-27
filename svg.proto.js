/**
 *  Function to convert svg document to the compound path
 *  
 *  IN: string
 *      SVG document 
 *
 *  OUT: object
 *  {
 *      path,
 *      x,
 *      y,
 *      width,
 *      height,
 *      missedTags[],
 *      missedAttrs[],
 *      ok (boolean) - true if svg converted without distortion
 *  }
 * 
 */

var XMLDOMParser = require('xmldom').DOMParser;

var missedTags;
var missedAttrs;
var path;
var fileIOError = false;
var pathChanged = false;

/**
 * Main function
 * 
 * @param string svgData
 * 
 * @return object
 * 	{
 *      path,
 *      x,
 *      y,
 *      width,
 *      height,
 *      missedTags[],
 *      missedAttrs[],
 *      ok (boolean) - true if svg converted without distortion
 *  }
 * 
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
 * Execute selected transform operation on the given path
 * 
 * @param string operation [ 'translate' | 'scale' | 'rotate' | 'skewX' | 'skewY' ]
 * @param array params of operation
 * @param string path to transform
 * 
 * @return string result path
 */
function transformPath( operation, params, path){}



module.exports = parseSvg; 
