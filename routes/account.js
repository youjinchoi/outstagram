var https = require("https");
const axios = require('axios');
var htmlparser = require("htmlparser2");



/*
 * GET home page.
 */

exports.search = function(req, res){
	var account = {};
	var htmlparser = require("htmlparser2");
	var parser = new htmlparser.Parser({
	    onopentag: function(name, attribs){
	        if(name === "meta"){
				const property = attribs.property;
				const content = attribs.content;
				if (property === "og:image") {
					account.image = content;
				} else if (property === "og:title") {
					account.title = content;
				} else if (property === "og:description") {
					account.description = content;
				} else if (property === "og:url") {
					account.url = content;
				}
	        }
		},
		ontext: function(text){
	    	if (text.indexOf("window._sharedData") == 0) {
				const data = JSON.parse(text.replace("window._sharedData = ","").replace(";",""));
				account.isPrivate = data.entry_data.ProfilePage[0].user.is_private;
	    	}
	    }
	}, {decodeEntities: true});
	axios.get('https://www.instagram.com/' + req.query.id)
	  .then(response => {
		parser.write(response.data);
		parser.end();
		res.json({
			account: account
		});
	  })
	  .catch(error => {
		if (error.response.status) {
			const status = error.response.status;
			console.log(status);
			if (status == 404) {
				res.json({
					account: null
				});
				return;
			}
		}
		res.status(401).json({
			status: "ERROR"
		});
	  });
};