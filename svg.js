var XMLDOMParser = require('xmldom').DOMParser;

var tags;
var attr;
var path;

module.exports = function( svgData){
	
	tags = [];
	attr = [];
	path = null;
	
	path = parseNodeList( nodeList, cbParse);
	
    var doc = (new XMLDOMParser()).parseFromString( svgData, 'application/xml');
    for ( var i=0; doc.childNodes && ( i<doc.childNodes.length); i++ ){
    	var node = doc.childNodes[i];
    	switch (node.tagName) {
		case 'g':
			parseGroup
			break;
		case 'path':
			
			break;
		default:
			if( tags.indexOf(node.tagName) >= 0)
				tags.push(node.tagName);
			break;
		} 
    }
	return {
		'tags': tags.length > 0 ? tags : false, 
		'attr': attr.length > 0 ? attr : false,
		'path' : path,
	};
    
};

function cbParse( err, tag, attr ){
	if( tags.indexOf(node.tagName) >= 0)
		tags.push(node.tagName);
	break;
	
}

function parseNodeList( nodeList, callback){
	var res = ''; 
	
    for ( var i=0; nodeList && ( i < nodeList.length); i++ ){
    	var node = doc.childNodes[i];
    	switch (node.tagName) {
		case 'g':
			res = res + parseGroup( node.nodeList, callback);
			break;
		case 'path':
			res = res + parseGroup();
			break;
		default:
			callback( 1, node.tagName);
		} 
    }
}

function parseGroup( nodeList, callback){
	
}

function parsePath( node, callback){
	
}

function parseAttributes( node, callback){
	
}
