var https = require("https");
const axios = require('axios');
var htmlparser = require("htmlparser2");



/*
 * GET home page.
 */

exports.index = function(req, res){
	var htmlparser = require("htmlparser2");
	var parser = new htmlparser.Parser({
	    onopentag: function(name, attribs){
	        if(name === "script" && attribs.type === "text/javascript"){
	            //console.log("JS! Hooray!");
	        }
	    },
	    ontext: function(text){
	    	if (text.indexOf("window._sharedData") == 0) {
	    		var obj = JSON.parse(text.replace("window._sharedData = ","").replace(";",""));
	    		console.log(obj.entry_data.ProfilePage[0].user.media.nodes);
	    	}
	    },
	    onclosetag: function(tagname){
	        if(tagname === "script"){
	            //console.log("That's it?!");
	        }
	    }
	}, {decodeEntities: true});
	axios.get('https://www.instagram.com/min4rin')
	  .then(response => {
		parser.write(response.data);
		parser.end();
		res.end();
	  })
	  .catch(error => {
	    console.log(error);
		res.end();
	  });
};