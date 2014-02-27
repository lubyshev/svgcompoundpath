/**
 *  Function to convert svg document to the compound path
 *  
 *  IN: string
 *      SVG document 
 *
 *  OUT: object
 *  {
 *      path:
 *          The result path
 *
 *      x:
 *          X-coordinate of the result path
 *
 *      y:
 *          Y-coordinate of the result path
 *
 *      width:
 *          Width of the result path
 *
 *      height:
 *          Height of the result path
 *
 *      missedTags[]:
 *          List of tags that were missed while parsing
 * 
 *      missedAttrs[]:
 *          List of attributes that were missed while parsing
 *
 *      OK:
 *      	Indicates the presence of an error during the file open or document processing.
 *
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
 * 	{ array missedTags, array missedAttrs, boolean pathChanged, boolean fileIOError, string path, };<br /><br />
 * 
 * 1. { null, null, false, true, null} - Invalid file format.<br /><br />
 * 
 * 2. { null, null, false, false, null} - File contains no image data.<br /><br />
 * 
 * 3. { array,  null, true, false, string } | { null,  array, true, false, string } | { array, array, true, false, string } -<br />
 *        If a result is not the same as need - convert the picture to the compound path with an editor.<br />
 *        Left out tags: [tags list].<br />
 *        Left out attributes: [attr list].<br /><br />
 *
 * 4. { null, null, true, false, null} -<br />
 *        Image import failed. Try to convert the picture to the compound path with an editor.<br />
 *        Left out tags: [tags list].<br />
 *        Left out attributes: [attr list].<br /><br />
 * 
 * 5. { null, null, true, false, string} -<br />
 *        If a result is not the same as need - convert the picture to the compound path with an editor.<br /><br />
 * 
 * 6. { null, null, false, false, string} - That`s all right
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
