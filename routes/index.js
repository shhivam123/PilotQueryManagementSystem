var express = require('express');
var router = express.Router();
const youtubedl = require('youtube-dl')

/* GET home page. */
router.get('/watch', async (req, res)=> {
  try {
 // res.render('index', { data: 'Express' });
 var q= req.sanitize('v').escape().trim();
 console.log(q)
 q=q.split("=")
 if(q.length==2)
 q=q[1]
 console.log(q)
 var video_id = q
var ampersandPosition = video_id.indexOf('&');
if(ampersandPosition != -1) {
  video_id = video_id.substring(0, ampersandPosition);
}
 console.log("Q"+video_id);
  //var object=  JSON.parse(JSON.stringify(req.query));
  var url= 'https://www.youtube.com/watch?v='+video_id;//'https://www.youtube.com/watch?v=v9QpKYed3f4';//object;
  //var uri='https://www.youtube.com/watch?v';
  //url= uri+"="+url['https://www.youtube.com/watch?v'];
 youtubedl.getInfo(url, function(err, info) {
     if (err) throw err  
     var object=  JSON.parse(JSON.stringify(info));
     titles=object['title'];
     duration_hms=object['_duration_hms'];
     var formats =JSON.parse(JSON.stringify(object['formats']));
     var th=  JSON.parse(JSON.stringify(object['thumbnails']));
     this.imageBlobUrl=th[0]["url"];
     var aud='tiny';
     var v=true;
     var audioURL='';
     var map = new Map();
     var URL_=[]
     var FORMATE_=[]
     for(var i=0;i<formats.length;i++)
        {
            var o=  formats[i];
            // if(o['asr']!=null)
            // {
              if( (o['format'].indexOf(aud))!=-1 && v )
              {
                  audioURL=o['url'];
                  console.log("AUdio"+ audioURL);
                  v=false;
              }
               else
              {
                URL_.push(o['url']);
                FORMATE_.push(o['format_note'])
                map.set(o['format_note'],o['url']);
              }
              //console.log(this.map);
            }
                          console.log(map);

     res.render('index',{imageBlobUrl : imageBlobUrl,audioURL : audioURL,flag:"aaaaaaa",titles : titles,duration_hms : duration_hms,URL_ : URL_,FORMATE_ : FORMATE_});
 });
}
catch(error) {
  res.status(error.response.status)
  return res.render(error.message);
}
});
router.get("/", function(req, res) {
  res.render('index', { flag: 'fa' });
});
 
module.exports = router;
