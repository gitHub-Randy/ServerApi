var express = require('express');        
var app = express();                 
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
var cors = require('cors');
var exec = require('child_process').exec;
var sudo = require('sudo-js');
var port = process.env.PORT || 8080;  
const router = express.Router();

router.use(function(req, res, next) {
	    console.log(`We've got something.`);
	    next() //calls next middleware in the application.
	 });
 
// starts nginx webserver with sudo password
router.route('/nginx/start').get((req,res) => {
exec('sudo systemctl start nginx', function(err,pid,result){
		
	
		if(err){
			res.json({nginxStart: false})
			console.log(err);
		}else{
			let fRunning = exec('ps -A | grep nginx');
			
			if(fRunning == null){
			res.json({nginxStart: false});
			exec('sudo systemctl start nginx');
			}
			res.json({nginxStart: true})
			console.log("starting nginx");
		}
	});
	
});

// kills  nginx webserver with sudo password
router.route('/nginx/stop').get((req,res) => {
	console.log("stopping nginx");
	var command = ['systemctl nginx stop'];
	exec('sudo systemctl stop nginx', function(err,pid,result){
		if(err){
			res.json({nginxStop: false});
		}else{
			res.json({nginxStop: true})
		}
	});
});

// starts ffmpeg stream command


router.route('/ffmpeg/start').get((req,res) => {
	console.log("starting ffmpeg");
	console.log(__filename);
	let fRunning = exec('ps -A | grep nginx');
	if(fRunning == null){
		res.json({FFMPEG: false});
		return;
	}else{
		
	exec('sudo ffmpeg -f concat -safe 0 -stream_loop -1 -i /home/randy/root.txt -preset ultrafast -vcodec libx264 -b:v 3000k  -f flv rtmp://10.249.154.18:1935/hls/test', function(err, result){
		if(err){
		res.json({FFMPEG: err});
			console.log(err);
			return;
	}	


	
})
		res.json({FFMPEG: true}); 
		;}
});

 router.route('/process/:process').get((req, res) => {
	      exec(`pgrep ${req.params.process}`, function(err,stdout, stderr){
		               if(err){
				                   res.json({result: false})

				                }else{ 
							if(exec('pgrep nginx')){

							            res.json({result: true})
							         }}
		           })
	 	console.log("checking status");
	  });

 app.use(cors());
app.use('/api', router);
app.listen(port);
console.log('Listening on port ' + port);




































