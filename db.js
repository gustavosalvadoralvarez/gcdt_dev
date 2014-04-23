var execFile = require('child_process').execFile,
	dbStart;
var sys = require('sys');
var mongo = require('mongodb'),
    Server = mongo.Server,
    Db = mongo.Db;
var mongoose = require('mongoose');

function startDB (db_server_path, data_path) {
	var serverPath = !db_server_path ? 'C:\\Users\\Gustavo\\Documents\\GitHub\\node\\MongoDB\\bin\\mongod' : db_server_path,
		dataPath = !data_path ? 'C:\\Users\\Gustavo\\Documents\\GitHub\\node\\GCDT\\express_exp0\\new\\data' : data_path;
	console.log('Starting db server @: '+serverPath);
	//Execute db server startup command
	execFile(serverPath, ['--dbpath', dataPath],
		function (error, stdout, stderr) {
			console.log('stdout: ' + stdout);
			console.log('stderr: ' + stderr);
			console.log('db server started');
			sys.print('stdout: ' + stdout);
			sys.print('stderr: ' + stderr);

			if (error != null ){
				throw new Error("could not excecute db server init command")
				console.log("ERROR!: " + error );
				return
			}
		}
	);

	mongoose.connect('mongodb://localhost/gcdt_data');

	var db = mongoose.connection;

	function initSchemas () {
		var contentSchema = mongoose.Schema(
				{
				copy: String,
				source: String,
				date: String,
				author: String,
				media: Array,
				title: String,
				}
			),
			Content = mongoose.model('Media', contentSchema);
		
		
	};

	db.on('error', console.error.bind(console, 'connection error:'));

	db.once('open', 
		function () {
  			console.log("database connection established");
  			initSchemas();
		}
	);

	return db; 
}


exports.db = startDB();