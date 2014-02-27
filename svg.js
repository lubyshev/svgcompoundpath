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
var _ = require('lodash');

var path;
var x;
var y;
var width;
var height;

var missedTags;
var missedAttrs;
var parsingStatus;

/**
 * Main function
 * 
 * @param string svgData
 * 
 * @return object
 * 	{ array missedTags, array missedAttrs, boolean pathChanged, boolean fileIOError, string path, };
 * 
 */
function parseSvg( svgData){
	
	missedTags = [];
	missedAttrs = [];
    path = null;
    parsingStatus = false;
    
    var doc = (new XMLDOMParser()).parseFromString( svgData, 'application/xml');
    
    if (typeof doc != 'undefined') {
		var svgTag = doc.getElementsByTagName('svg')[0];
		

/*		var viewBox = _.map((svgTag.getAttribute('viewBox') || '').split(' '),
				function(val) {
					return parseInt(val, 10);
				});

		// getting base parameters

		var attr = {};

		_.forEach([ 'x', 'y', 'width', 'height' ], function(key) {
			attr[key] = parseInt(svgTag.getAttribute(key), 10);
		});

		var x = viewBox[0] || attr.x || 0;
		var y = viewBox[1] || attr.y || 0;
		var width = viewBox[2] || attr.width;
		var height = viewBox[3] || attr.height;
*/
		if ( path = parseNodeList( svgTag.childNodes, errorCallBack) )
			parsingStatus = true;
		//console.log(path);
    }
    return new Object({
        'path' : path ? path : null, 
    	'x' : x,
    	'y' : y,
    	'width' : width,
    	'height' : height,    
        'tags': missedTags.length > 0 ? missedTags : null, 
        'attr': missedAttrs.length > 0 ? missedAttrs : null,
        'ok': parsingStatus,
    });	
	
};



/**
 * Callback to trace tags and attributes that were missed 
 * 
 * @param integer err Error code or 0 if all is right
 * @param string tag parsed tag
 * @param string attr parsed attribute
 * 
 * @return void 
 */
function errorCallBack( err, tag, attr ){
	if(err){
		if( tag &&
			missedTags.indexOf( tag) < 0)
			missedTags.push( tag);
		if( attr &&
			missedAttrs.indexOf( attr) < 0)
			missedAttrs.push( attr);
	}
	
}


/**
 * Combine several paths into the compaund path
 * 
 * @param string path1
 * @param string path2
 * @param ...
 * 
 * @returns {String} The result
 */
function pathMerge( paths){
	var result = null;
	Array.prototype.slice.call(arguments).forEach(function (val, index, array) {
	  if( val && typeof val == 'string'){
		  if( ! result ) result = val;
		  else result = result + ' ' + val;
	  }
	});
	return result;
}

/**
 * Loop for XMLNodeList collection
 * 
 * @param array Array of XMLNode`s
 * @param callback Callback function ( error, tagName, attrName)
 * 
 * @return string result path
 */
function parseNodeList( nodeList, callback){
	var transform = null;
	if( nodeList.tagName == 'g'){
		if( nodeList.attributes ){
		    for ( var i=0; i< nodeList.attributes.length; i++ ){
		    	switch( nodeList.attributes[i].name ){
		        case 'transform':
		        	transform = nodeList.attributes[i].value;
		            break;
		        default:
		    		callback(1, null, nodeList.attributes[i].name);
		    	}
		    }
		} 
		nodeList = nodeList.childNodes;
	} 
	var path = null;
    for ( var i=0; nodeList && ( i< nodeList.length); i++ ){
    	var node = nodeList[i];
        switch( node.tagName) {
        case 'g':
        	path = pathMerge( path,  parseNodeList( node, callback) );
            break;
        case 'path':
        	path = pathMerge( path,  parsePath( node, callback) );
            break;
        default:
        	callback(1, node.tagName, null);
            break;
        } 
    }
    if( path && transform){
    	path = transformPath( transform, {}, path);
    	//console.log(transform);
    }
    return path; 
}

/**
 * Parse `path` tag
 * 
 * @param XMLNode Node
 * @param callback Callback function ( error, tagName, attrName)
 * 
 * @return string result path
 */
function parsePath( node, callback){
	return node.getAttribute('d');
}



/**
 * Execute selected transform operation on the given path
 * 
 * @param string operation [ 'translate' | 'scale' | 'rotate' | 'skewX' | 'skewY' ]
 * @param array params of operation
 * @param string path to transform
 * 
 * @return string result path
 */
function transformPath( operation, params, path){
	return path;
}



module.exports = parseSvg; 
