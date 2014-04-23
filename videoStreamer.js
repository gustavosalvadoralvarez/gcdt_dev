var fs = require('fs');

exports.streamVid = function (req, res) {
	console.log('Initiated VideoStreamer instance for ' + req.params.filename);
	
	var vidName = req.params.filename,
		path = 'public/videos/' + vidName,
		vidSize = fs.statSync(path).size;
		
	if (req.headers['range']){

		var rangeArray = req.headers.range.replace('bytes=', '').split('-'),
			startInt = parseInt(rangeArray[0], 10),
			endInt = rangeArray[1] ? parseInt(rangeArray[1], 10) : vidSize - 1,
			chunkSize = (endInt - startInt) + 1;
		
		console.log("Range requested: "+startInt+'/'+endInt+'\n'+"Chunk size: "+chunkSize);
		var fileStream = fs.createReadStream(path, {start : startInt, end : endInt});
		console.log(fileStream.start);
		
		res.writeHead(206, 
			{   
			'Content-Range': 'bytes ' + startInt + '-' + endInt + '/' + vidSize, 
			'Accept-Ranges': 'bytes', 
			'Content-Length': chunkSize, 
			'Content-Type': 'video/mp4' 
			}
		);

		fileStream.pipe(res);
	} else {
		console.log('No range requested' + '\n' + 'File Size: ' + vidSize);
		
		res.writeHead(200, { 'Content-Length': vidSize, 'Content-Type': 'video/mp4' });
    	fs.createReadStream(path).pipe(res);
	}
}

