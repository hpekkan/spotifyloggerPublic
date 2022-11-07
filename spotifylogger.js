

const buddyList = require('./')
const  mysql = require('mysql2');
const { exit } = require('process');
const { getSystemErrorName } = require('util');
var con;
var first=true;
async function main () {
    

    if(first){ con = await connectDB(); first=false}
    
   
    const spDcCookie = 'YOUR-COOKIE-HERE'
    const { accessToken } = await buddyList.getWebAccessToken(spDcCookie)
    var friendActivity = await buddyList.getFriendActivity(accessToken)
  
    var text = JSON.stringify(friendActivity,null,2);
    var obj = JSON.parse(text)
    
    var create_user = "INSERT IGNORE INTO users (USER_ID,USER_URI, USER_NAME) VALUES (2,'fakehesap','fake')";
    con.query(create_user, function (err, result) {
      if (err) throw err;
    });
    var count=0;
    var last;
    process.stdout.write('\x1Bc'); 
    var myinter = setInterval(async function(){ 
      count++;
      try {
        friendActivity = await buddyList.getFriendActivity(accessToken)
        text = JSON.stringify(friendActivity,null,2);
        obj = JSON.parse(text)
        
        if(obj!=undefined || obj!=null){
          console.log(obj.friends.length);
          for (let index = 0; index < obj.friends.length; index++) {
            var friend = obj.friends[index];
            var listen_Date = new Date(friend.timestamp).addHours(3).toISOString().slice(0, 19).replace('T', ' ');
            var insert_friend_act = "INSERT IGNORE INTO friendlog (FRIEND_URI,FRIEND_NAME,LISTEN_DATE,SONG_URI,SONG_NAME,IMAGE_URL,ALBUM_NAME,ARTIST_NAME) VALUES ('"+replaceAll(friend.user.uri,'\'',' ')+"','"+replaceAll(friend.user.name,'\'',' ')+"','"+listen_Date+"','"+replaceAll(friend.track.uri,'\'',' ')+"','"+replaceAll(friend.track.name,'\'',' ')+"','"+replaceAll(friend.track.imageUrl,'\'',' ')+"','"+replaceAll(friend.track.album.name,'\'',' ')+"','"+replaceAll(friend.track.artist.name,'\'',' ')+"')";
            con.query(insert_friend_act, function (err, result) {
              if (err) throw err;
              if(result.affectedRows>0) console.log(obj.friends[index].user.name+" listened a new song");
            });
            con.query("INSERT IGNORE INTO relations (USER_ID,FRIEND_URI) VALUES ('"+2+"','"+replaceAll(friend.user.uri,'\'',' ')+"')", function (err, result) {
              if (err) throw err;
            });
          }
          con.query("select FRIEND_URI, FRIEND_NAME, LISTEN_DATE,SONG_NAME,ARTIST_NAME,ALBUM_NAME from friendlog ORDER BY LISTEN_DATE DESC LIMIT 1;", function (err, result) {
            if (err) throw err;
            Object.keys(result).forEach(function(key) {
              var row = result[key];
              if(last!==(row.FRIEND_NAME+", "+row.LISTEN_DATE+", "+row.SONG_NAME+", "+row.ARTIST_NAME+", "+row.ALBUM_NAME)){
                last = row.FRIEND_NAME+", "+row.LISTEN_DATE+", "+row.SONG_NAME+", "+row.ARTIST_NAME+", "+row.ALBUM_NAME;
                console.log("last listened: "+row.FRIEND_NAME+", "+row.LISTEN_DATE+", "+row.SONG_NAME+", "+row.ARTIST_NAME+", "+row.ALBUM_NAME)
                
              }
            });
            
          });
        }else console.log("obj undefined")
      }catch(err) {
        const fs = require('fs');

        fs.appendFile('errors.txt', console.log(err), function (error) {
          if (error) throw error;
          console.log('error Saved!');
        });
      }
    
    },1000);
    var tmp =setInterval(() => {
      if (count>35){
        clearInterval(myinter);
        clearInterval(tmp);
      }
    }, 1000);
  
  
  
  
   
  
  
  
}

async function connectDB(){
  var con = mysql.createConnection({
    host: "localhost",
    user: "user",
    password: "password",
    database:"SPOTIFYLOGS"
  });
  
  con.connect(function(err) {
    if (err) throw err;
    process.stdout.write('\x1Bc'); 
    console.log("Connected!");
  });
  con.on('error', function() { 
      const fs = require('fs');

    fs.appendFile('errors.txt', console.log(err), function (error) {
      if (error) throw error;
      console.log('error Saved!');
    });
  });
  return con;
}
setIntervalImmediately(main, 40000);


Date.prototype.addHours= function(h){
  this.setHours(this.getHours()+h);
  return this;
}
function replaceAll(str, find, replace) {
  return str.replace(new RegExp(find, 'g'), replace);
}

function setIntervalImmediately(func, interval) {
  func();
  return setInterval(func, interval);
}
