var express = require('express');
var bodyparser =require('body-parser');
var router = express.Router();
var https = require('https');
var http = require('http');
var path = require('path');
var xml2js = require('xml2js');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.sendFile(path.join(__dirname, '../', 'views', 'Home.html'));
  
  
});



router.get('/lookup', function(req, res, next) {
  console.log(req.query);
  http.get('http://dev.markitondemand.com/MODApis/Api/v2/Lookup/json?input='+req.query.stock, (resp) => {
    let data = '';
   
    // A chunk of data has been recieved.
    resp.on('data', (chunk) => {
      data += chunk;
    //console.log(data);
    });
   
    // The whole response has been received. Print out the result.
    resp.on('end', () => {
     res.send(data);
      //res.send(JSON.parse(data).explanation);
    });
   
  }).on("error", (err) => {
    console.log("Error: " + err.message);
  });
  });

router.get('/timeseriesdaily', function(req, res, next) {
  console.log(req.query.stock);
https.get('https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&outputsize=full&symbol='+req.query.stock+'&interval=daily&apikey=PutYourAPIKey', (resp) => {
  let data = '';
 
  // A chunk of data has been recieved.
  resp.on('data', (chunk) => {
    data += chunk;
	//console.log(data);
  });
 
  // The whole response has been received. Print out the result.
  resp.on('end', () => {
    //console.log(data);
    if(!data.includes("<!DOCTYPE html>")){
   res.json(JSON.parse(data));
    }else{
      res.json(null);
    }
	 //console.log(JSON.parse(data));
    //res.send(JSON.parse(data).explanation);
  });
 
}).on("error", (err) => {
  console.log("Error: " + err.message);
});
});

router.get('/timeseriesdailycompact', function(req, res, next) {
  console.log(req.query.stock);
https.get('https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol='+req.query.stock+'&interval=daily&apikey=PutYourAPIKey', (resp) => {
  let data = '';
 
  // A chunk of data has been recieved.
  resp.on('data', (chunk) => {
    data += chunk;
	//console.log(data);
  });
 
  // The whole response has been received. Print out the result.
  resp.on('end', () => {
    //console.log(data);
    if(!data.includes("<!DOCTYPE html>")){
   res.json(JSON.parse(data));
    }else{
      res.json(null);
    }
	 //console.log(JSON.parse(data));
    //res.send(JSON.parse(data).explanation);
  });
 
}).on("error", (err) => {
  console.log("Error: " + err.message);
});
});

router.get('/newsdata', function(req, res, next) {
  https.get('https://seekingalpha.com/api/sa/combined/'+req.query.stock+'.xml', (resp) => {
    let data = '';
   
    // A chunk of data has been recieved.
    resp.on('data', (chunk) => {
      data += chunk;
    //console.log(data);
    });
   
    // The whole response has been received. Print out the result.
    resp.on('end', () => {
     //res.json(JSON.parse(data));
     var parser = new xml2js.Parser();
     parser.parseString(data, function (err, result) {
      res.json(result.rss.channel[0].item);
      console.log('Done');
      });
     //console.log(data);
      //res.send(JSON.parse(data).explanation);
    });
   
  }).on("error", (err) => {
    console.log("Error: " + err.message);
  });
  });

router.get('/graphSMA', function(req, res, next) {
  https.get('https://www.alphavantage.co/query?function=SMA&symbol='+req.query.stock+'&interval=daily&time_period=10&series_type=close&apikey=PutYourAPIKey', (resp) => {
    let data = '';
   
    // A chunk of data has been recieved.
    resp.on('data', (chunk) => {
      data += chunk;
    });
   
    // The whole response has been received. Print out the result.
    resp.on('end', () => {
      if(!data.includes("<!DOCTYPE html>")){
      var myObj = JSON.parse(data);
      var x =[]
      var dataOfSymbol=[]
      var i=0;
      var mon=""
      var numMonths=0
      for(var a in myObj["Technical Analysis: SMA"]){
        var d=String(a).split('-')
        if(i==0) mon=d[1]
        if(numMonths<6){
          if(mon!=d[1]){
            numMonths=numMonths+1
            mon=d[1]
          }
        }else{
          break;
        }
        x[i]=d[1]+"/"+d[2]
        dataOfSymbol[i]=parseFloat(myObj["Technical Analysis: SMA"][a]["SMA"])
        i=i+1
      }
      x.reverse()
      dataOfSymbol.reverse()
      var result={};
      result.x=x;
      result.dataOfSymbol=dataOfSymbol
     res.send(result);
    }else{
      res.send(null);
    }
    });
   
  }).on("error", (err) => {
    console.log("Error: " + err.message);
  });
  });

  router.get('/graphCCI', function(req, res, next) {
    https.get('https://www.alphavantage.co/query?function=CCI&symbol='+req.query.stock+'&interval=daily&time_period=10&series_type=close&apikey=PutYourAPIKey', (resp) => {
      let data = '';
     
      // A chunk of data has been recieved.
      resp.on('data', (chunk) => {
        data += chunk;
      });
     
      // The whole response has been received. Print out the result.
      resp.on('end', () => {
        if(!data.includes("<!DOCTYPE html>")){
        var myObj = JSON.parse(data);
        var x =[]
        var dataOfSymbol=[]
        var i=0;
        var mon=""
        var numMonths=0
        for(var a in myObj["Technical Analysis: CCI"]){
          var d=String(a).split('-')
          if(i==0) mon=d[1]
          if(numMonths<6){
            if(mon!=d[1]){
              numMonths=numMonths+1
              mon=d[1]
            }
          }else{
            break;
          }
          x[i]=d[1]+"/"+d[2]
          dataOfSymbol[i]=parseFloat(myObj["Technical Analysis: CCI"][a]["CCI"])
          i=i+1
        }
        x.reverse()
        dataOfSymbol.reverse()
        var result={};
        result.x=x;
        result.dataOfSymbol=dataOfSymbol
       res.send(result);
      }else{
        res.send(null);
      }
      });
     
    }).on("error", (err) => {
      console.log("Error: " + err.message);
    });
    });

    router.get('/graphADX', function(req, res, next) {
      https.get('https://www.alphavantage.co/query?function=ADX&symbol='+req.query.stock+'&interval=daily&time_period=10&series_type=close&apikey=PutYourAPIKey', (resp) => {
        let data = '';
       
        // A chunk of data has been recieved.
        resp.on('data', (chunk) => {
          data += chunk;
        });
       
        // The whole response has been received. Print out the result.
        resp.on('end', () => {
          if(!data.includes("<!DOCTYPE html>")){
          var myObj = JSON.parse(data);
          var x =[]
          var dataOfSymbol=[]
          var i=0;
          var mon=""
          var numMonths=0
          for(var a in myObj["Technical Analysis: ADX"]){
            var d=String(a).split('-')
            if(i==0) mon=d[1]
            if(numMonths<6){
              if(mon!=d[1]){
                numMonths=numMonths+1
                mon=d[1]
              }
            }else{
              break;
            }
            x[i]=d[1]+"/"+d[2]
            dataOfSymbol[i]=parseFloat(myObj["Technical Analysis: ADX"][a]["ADX"])
            i=i+1
          }
          x.reverse()
          dataOfSymbol.reverse()
          var result={};
          result.x=x;
          result.dataOfSymbol=dataOfSymbol
         res.send(result);
        }else{
          res.send(null);
        }
        });
       
      }).on("error", (err) => {
        console.log("Error: " + err.message);
      });
      });

      router.get('/graphEMA', function(req, res, next) {
        https.get('https://www.alphavantage.co/query?function=EMA&symbol='+req.query.stock+'&interval=daily&time_period=10&series_type=close&apikey=PutYourAPIKey', (resp) => {
          let data = '';
         
          // A chunk of data has been recieved.
          resp.on('data', (chunk) => {
            data += chunk;
          });
         
          // The whole response has been received. Print out the result.
          resp.on('end', () => {
            if(!data.includes("<!DOCTYPE html>")){
            var myObj = JSON.parse(data);
            var x =[]
            var dataOfSymbol=[]
            var i=0;
            var mon=""
            var numMonths=0
            for(var a in myObj["Technical Analysis: EMA"]){
              var d=String(a).split('-')
              if(i==0) mon=d[1]
              if(numMonths<6){
                if(mon!=d[1]){
                  numMonths=numMonths+1
                  mon=d[1]
                }
              }else{
                break;
              }
              x[i]=d[1]+"/"+d[2]
              dataOfSymbol[i]=parseFloat(myObj["Technical Analysis: EMA"][a]["EMA"])
              i=i+1
            }
            x.reverse()
            dataOfSymbol.reverse()
            var result={};
            result.x=x;
            result.dataOfSymbol=dataOfSymbol
           res.send(result);
          }else{
            res.send(null);
          }
          });
         
        }).on("error", (err) => {
          console.log("Error: " + err.message);
        });
        });

        router.get('/graphRSI', function(req, res, next) {
          https.get('https://www.alphavantage.co/query?function=RSI&symbol='+req.query.stock+'&interval=daily&time_period=10&series_type=close&apikey=PutYourAPIKey', (resp) => {
            let data = '';
           
            // A chunk of data has been recieved.
            resp.on('data', (chunk) => {
              data += chunk;
            });
           
            // The whole response has been received. Print out the result.
            resp.on('end', () => {
              if(!data.includes("<!DOCTYPE html>")){
              var myObj = JSON.parse(data);
              var x =[]
              var dataOfSymbol=[]
              var i=0;
              var mon=""
              var numMonths=0
              for(var a in myObj["Technical Analysis: RSI"]){
                var d=String(a).split('-')
                if(i==0) mon=d[1]
                if(numMonths<6){
                  if(mon!=d[1]){
                    numMonths=numMonths+1
                    mon=d[1]
                  }
                }else{
                  break;
                }
                x[i]=d[1]+"/"+d[2]
                dataOfSymbol[i]=parseFloat(myObj["Technical Analysis: RSI"][a]["RSI"])
                i=i+1
              }
              x.reverse()
              dataOfSymbol.reverse()
              var result={};
              result.x=x;
              result.dataOfSymbol=dataOfSymbol
             res.send(result);
            }else{
              res.send(null);
            }
            });
           
          }).on("error", (err) => {
            console.log("Error: " + err.message);
          });
          });

        router.get('/graphBBANDS', function(req, res, next) {
          https.get('https://www.alphavantage.co/query?function=BBANDS&symbol='+req.query.stock+'&interval=daily&time_period=10&series_type=close&apikey=PutYourAPIKey', (resp) => {
            let data = '';
           
            // A chunk of data has been recieved.
            resp.on('data', (chunk) => {
              data += chunk;
            });
           
            // The whole response has been received. Print out the result.
            resp.on('end', () => {
              if(!data.includes("<!DOCTYPE html>")){
              var myObj = JSON.parse(data);
              var x =[]
              var RUB=[]
              var RLB=[]
              var RMB=[]
              var i=0;
              var mon=""
              var numMonths=0
              for(var a in myObj["Technical Analysis: BBANDS"]){
                var d=String(a).split('-')
                if(i==0) mon=d[1]
                if(numMonths<6){
                  if(mon!=d[1]){
                    numMonths=numMonths+1
                    mon=d[1]
                  }
                }else{
                  break;
                }
                x[i]=d[1]+"/"+d[2]
                RUB[i]=parseFloat(myObj["Technical Analysis: BBANDS"][a]["Real Upper Band"])
                RLB[i]=parseFloat(myObj["Technical Analysis: BBANDS"][a]["Real Lower Band"])
                RMB[i]=parseFloat(myObj["Technical Analysis: BBANDS"][a]["Real Middle Band"])
                i=i+1
              }
              x.reverse()
              RUB.reverse()
              RLB.reverse()
              RMB.reverse()
              var result={};
              result.x=x;
              result.RUB=RUB;
              result.RLB=RLB;
              result.RMB=RMB;
             res.send(result);
            }else{
              res.send(null);
            }
            });
           
          }).on("error", (err) => {
            console.log("Error: " + err.message);
          });
          });

        router.get('/graphMACD', function(req, res, next) {
          https.get('https://www.alphavantage.co/query?function=MACD&symbol='+req.query.stock+'&interval=daily&time_period=10&series_type=close&apikey=PutYourAPIKey', (resp) => {
            let data = '';
           
            // A chunk of data has been recieved.
            resp.on('data', (chunk) => {
              data += chunk;
            });
           
            // The whole response has been received. Print out the result.
            resp.on('end', () => {
              if(!data.includes("<!DOCTYPE html>")){
              var myObj = JSON.parse(data);
              var x =[]
              var MACD_Signal=[]
              var MACD_Hist=[]
              var MACD=[]
              var i=0;
              var mon=""
              var numMonths=0
              for(var a in myObj["Technical Analysis: MACD"]){
                var d=String(a).split('-')
                if(i==0) mon=d[1]
                if(numMonths<6){
                  if(mon!=d[1]){
                    numMonths=numMonths+1
                    mon=d[1]
                  }
                }else{
                  break;
                }
                x[i]=d[1]+"/"+d[2]
                MACD_Signal[i]=parseFloat(myObj["Technical Analysis: MACD"][a]["MACD_Signal"])
                MACD_Hist[i]=parseFloat(myObj["Technical Analysis: MACD"][a]["MACD_Hist"])
                MACD[i]=parseFloat(myObj["Technical Analysis: MACD"][a]["MACD"])
                i=i+1
              }
              x.reverse()
              MACD_Signal.reverse()
              MACD_Hist.reverse()
              MACD.reverse()
              var result={};
              result.x=x;
              result.MACD_Signal=MACD_Signal;
              result.MACD_Hist=MACD_Hist;
              result.MACD=MACD;
             res.send(result);
            }else{
              res.send(null);
            }
            });
           
          }).on("error", (err) => {
            console.log("Error: " + err.message);
          });
          });

          router.get('/graphSTOCH', function(req, res, next) {
          https.get('https://www.alphavantage.co/query?function=STOCH&symbol='+req.query.stock+'&interval=daily&time_period=10&series_type=close&apikey=PutYourAPIKey', (resp) => {
            let data = '';
           
            // A chunk of data has been recieved.
            resp.on('data', (chunk) => {
              data += chunk;
            });
           
            // The whole response has been received. Print out the result.
            resp.on('end', () => {
              if(!data.includes("<!DOCTYPE html>")){
                var myObj = JSON.parse(data);
                var x =[]
                var dataOfSymbolSlowK=[]
                var dataOfSymbolSlowD=[]
                var i=0;
                var mon=""
                var numMonths=0
                for(var a in myObj["Technical Analysis: STOCH"]){
                  var d=String(a).split('-')
                  if(i==0) mon=d[1]
                  if(numMonths<6){
                    if(mon!=d[1]){
                      numMonths=numMonths+1
                      mon=d[1]
                    }
                  }else{
                    break;
                  }
                  x[i]=d[1]+"/"+d[2]
                  dataOfSymbolSlowK[i]=parseFloat(myObj["Technical Analysis: STOCH"][a]["SlowK"])
                  dataOfSymbolSlowD[i]=parseFloat(myObj["Technical Analysis: STOCH"][a]["SlowD"])
                  i=i+1
                }
                x.reverse()
                dataOfSymbolSlowK.reverse()
                dataOfSymbolSlowD.reverse()
                var result={};
                result.x=x;
                result.dataOfSymbolSlowK=dataOfSymbolSlowK;
                result.dataOfSymbolSlowD=dataOfSymbolSlowD;
               res.send(result);
              } else{
                res.send(null);
              }
              
            });
           
          }).on("error", (err) => {
            console.log("Error: " + err.message);
          });
          });
module.exports = router;
