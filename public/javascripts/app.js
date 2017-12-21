var app = angular.module('stockApp', ['ngRoute','ngMaterial','ngAnimate', 'ngSanitize', 'ui.bootstrap','ngMessages']);



app.controller('searchControl', function($scope, $http, $interval, testservice, timeSeries, graphs, newsfeed) {
        $scope.enterStockText="Please enter a stock ticker symbol."
        $scope.searched=true;
        $scope.checked=false;
        
        $scope.validate= function(value){
            if(($scope.form.stock_name.$touched && $scope.form.stock_name.$invalid)|| value==undefined || value.trim()==''){
                document.getElementById("getquotebtn").disabled=true;
            }else{
                document.getElementById("getquotebtn").disabled=false;
            }
        }
        document.getElementById("oby").disabled=true;
        $scope.selector= function(){
            if($scope.sorting==''){
                document.getElementById("oby").disabled=true;
            }else{
                document.getElementById("oby").disabled=false;
            }
        }
        
        $scope.test=function(){
            if($scope.checked==false){
                $scope.checked=true;
                document.getElementById("progrestable").style.display="none"
                document.getElementById("progresprice").style.display="none"
                document.getElementById("progressma").style.display="none"
                document.getElementById("progresema").style.display="none"
                document.getElementById("progresstoch").style.display="none"
                document.getElementById("progresrsi").style.display="none"
                document.getElementById("progresadx").style.display="none"
                document.getElementById("progrescci").style.display="none"
                document.getElementById("progresbbands").style.display="none"
                document.getElementById("progresmacd").style.display="none"
                document.getElementById("progreshist").style.display="none"
                document.getElementById("progresnewsfeed").style.display="none"
            }else{
                $scope.checked=false;
            }
        }

        
        $('#right').prop("disabled",true).change();
        var myInterval = null;
        $scope.check = true;
        $('#autorefresh').click(function(){
             if (myInterval !== null) {
                 $interval.cancel(myInterval);
             }else{
                myInterval = $interval(function() {
                    for(var i in $scope.localdata){
                        requestfordata($scope.localdata[i].s, $scope,$http);
                    }
                }, 5000);
             }
        });

        if(localStorage!==undefined){
            $scope.localdata=[]
            if(localStorage.getItem("stocks")){
                var obj_stocks=JSON.parse(localStorage.getItem("stocks"))
                if(obj_stocks!==undefined){
                    for(var i in obj_stocks){
                        for(var k in JSON.parse(obj_stocks[i])){
                            $scope.localdata.push(JSON.parse(obj_stocks[i])[k])
                        }
                    }
                }
            }
        }
    
        $scope.delete= function(val){
            var obj_stocks=JSON.parse(localStorage.getItem("stocks"))
            if(obj_stocks!==undefined){
                for(var i in obj_stocks)
                if (obj_stocks[i]!=null&&JSON.parse(obj_stocks[i])[val]!==undefined) {
                    obj_stocks.splice(i,1);
                    localStorage.setItem("stocks",JSON.stringify(obj_stocks));
                    $scope.localdata=obj_stocks;
                }
            }
        }

    

        $scope.search= function(val){
            var temp;
            if(val==undefined){
                temp=String($scope.form.$$success.parse[0].$viewValue);
            }else{
                temp=val;
            }

            var sym=temp.split('-')[0];
            $scope.checked=true;
            testservice.getHistoricalChart($scope,$http,sym);
            timeSeries.getTable($scope,$http,sym);
            graphs.getGraphs($scope,$http,sym);
            newsfeed.getFeed($scope,$http,sym);
            $scope.searched=false;
            $('#right').prop("disabled",false).change();
            
            document.getElementById("stocktable").style.display="none"
            document.getElementById("conPrice").style.display="none"
            document.getElementById("conSMA").style.display="none"
            document.getElementById("conEMA").style.display="none"
            document.getElementById("conSTOCH").style.display="none"
            document.getElementById("conRSI").style.display="none"
            document.getElementById("conADX").style.display="none"
            document.getElementById("conCCI").style.display="none"
            document.getElementById("conBBANDS").style.display="none"
            document.getElementById("conMACD").style.display="none"
            document.getElementById("chart").style.display="none"
            document.getElementById("feeds").style.display="none"

            document.getElementById("progrestable").style.display=""
            document.getElementById("progresprice").style.display=""
            document.getElementById("progressma").style.display=""
            document.getElementById("progresema").style.display=""
            document.getElementById("progresstoch").style.display=""
            document.getElementById("progresrsi").style.display=""
            document.getElementById("progresadx").style.display=""
            document.getElementById("progrescci").style.display=""
            document.getElementById("progresbbands").style.display=""
            document.getElementById("progresmacd").style.display=""
            document.getElementById("progreshist").style.display=""
            document.getElementById("progresnewsfeed").style.display=""

             document.getElementById("errortable").style.display="none"
             document.getElementById("errorprice").style.display="none";
             document.getElementById("errorsma").style.display="none";
             document.getElementById("errorema").style.display="none";
             document.getElementById("errorstoch").style.display="none";
             document.getElementById("errorrsi").style.display="none";
             document.getElementById("erroradx").style.display="none";
             document.getElementById("errorcci").style.display="none";
             document.getElementById("errorbbands").style.display="none";
             document.getElementById("errormacd").style.display="none";
             document.getElementById("errorhist").style.display="none";
             document.getElementById("errornews").style.display="none";
             document.getElementById("shareBtn").disabled = true;
            
            
        };

        $scope.clearAll= function(){
            $http.checked=false;
            //localStorage.removeItem("stocks");
            $scope.localdata=[];
            $scope.checked=false;
            document.getElementById('form').reset();
        };
        
        window.fbAsyncInit = function() {
            FB.init({
              appId      : '658203447903167',
              xfbml      : true,
              version    : 'v2.5'
            });
      
            
          };
      
          (function(d, s, id){
            var js, fjs = d.getElementsByTagName(s)[0];
            if (d.getElementById(id)) {return;}
            js = d.createElement(s); js.id = id;
            js.src = "//connect.facebook.net/en_US/sdk.js";
            fjs.parentNode.insertBefore(js, fjs);
          }(document, 'script', 'facebook-jssdk'));

        $scope.share= function(){
            var chart=$('#con'+$('.nav-tabs .active').text().trim()).highcharts();
            var obj = {};
            obj.svg = chart.getSVG();
            obj.type = 'image/png';
            obj.width =$('#con'+$('.nav-tabs .active').text().trim()).highcharts().chartWidth;
            obj.height=$('#con'+$('.nav-tabs .active').text().trim()).highcharts().chartHeight; 
            obj.async = true;
            $.ajax({
                type: 'post',
                url: chart.options.exporting.url,        
                data: obj, 
                success: function (data) {            
                    var exportUrl = this.url;
                    FB.ui({
                        method: 'feed',
                        display: 'popup',
                        link: 'https://export.highcharts.com/'+data,
                      }, function(response){
                        if(response&&!response.error_message){
                            alert("Successfully posted");
                        }else{
                            alert("Error in posting it on Facebook");
                        }

                      });
                }        
            });
        };

        $scope.fav= function(){
           var symbol_str= String($scope.symbol);
           var obj={};
           obj[symbol_str]= {"s":$scope.symbol,"p":$scope.price,"c":$scope.change,"cp":$scope.changepercent,"v":$scope.d1volume}
            if(localStorage!==undefined){
                if(localStorage.getItem("stocks")){
                    var obj_stocks=JSON.parse(localStorage.getItem("stocks"))
                    
                    if(obj_stocks!==undefined){
                        var found=false;
                        for(var i in obj_stocks)
                        if (obj_stocks[i]!=null&&JSON.parse(obj_stocks[i])[symbol_str]!==undefined) {
                            obj_stocks.splice(i,1);
                            found=true;
                            document.getElementById('fav').style.color="white";
                        }
                    }
                    if(found==false){
                        obj_stocks.push(JSON.stringify(obj));
                        document.getElementById('fav').style.color="yellow"
                    }
                    localStorage.setItem("stocks",JSON.stringify(obj_stocks));
                    $scope.localdata=[];
                    for(var i in obj_stocks){
                        for(var k in JSON.parse(obj_stocks[i])){
                            $scope.localdata.push(JSON.parse(obj_stocks[i])[k])
                        }
                    }
                    }else{
                    var obj_stocks=localStorage.getItem("stocks")
                    if(obj_stocks===null){
                        obj_stocks=[];
                    }
                    obj_stocks.push(JSON.stringify(obj));
                    localStorage.setItem("stocks",JSON.stringify(obj_stocks));
                    $scope.localdata=[];
                    for(var i in obj_stocks){
                        for(var k in JSON.parse(obj_stocks[i])){
                            $scope.localdata.push(JSON.parse(obj_stocks[i])[k])
                        }
                    }
                    document.getElementById('fav').style.color="yellow"
                }
            }

        };

        $scope.refresh1=function(){
            var b;
            console.log($scope.localdata);
              for(var i in $scope.localdata){
                requestfordata($scope.localdata[i].s,$scope,$http);
              }
        };

        requestfordata= function(sym,$scope,$http){
            var payload={"stock": sym};
            var data;
            $http({
                url:'/timeseriesdailycompact',
                method: "GET",
                time:10000,
                params: payload}).then(function mySuccess(response) {
                    data = response.data;
                    changedata(data,sym,$scope);
                });
            
        };

        requestfordatawithoutvolume= function(sym,$scope,$http){
            var payload={"stock": sym};
            var data;
            $http({
                url:'/timeseriesdailycompact',
                method: "GET",
                time:10000,
                params: payload}).then(function mySuccess(response) {
                    data = response.data;
                    changedatawithoutvolume(data,sym,$scope);
                });
            
        };

        changedata=function(data,sym,$scope){
            for(var i in $scope.localdata){
                if($scope.localdata[i].s==sym){
                    var j=0,day1c,day2c, d1close,d2close, d1volume;
                    angular.forEach(data["Time Series (Daily)"], function(value, key) {
                        if(j==0){
                            d1close=parseFloat(data["Time Series (Daily)"][key]["4. close"]);
                            d1volume=parseFloat(data["Time Series (Daily)"][key]["5. volume"]);
                           
                            j=j+1;
                        }
                        else if(j==1){
                            d2close=parseFloat(data["Time Series (Daily)"][key]["4. close"]);
                            j=j+1;
                        }
                      });
                      $scope.localdata[i].p=d1close;
                      $scope.localdata[i].v=d1volume;
                      $scope.localdata[i].c=parseFloat(d1close-d2close);
                      $scope.localdata[i].cp=(parseFloat(d1close-d2close)/parseFloat(d2close))*100;
                }
            }
        };

        changedatawithoutvolume=function(data,sym,$scope){
            for(var i in $scope.localdata){
                if($scope.localdata[i].s==sym){
                    var j=0,day1c,day2c, d1close,d2close, d1volume;
                    angular.forEach(data["Time Series (Daily)"], function(value, key) {
                        if(j==0){
                            d1close=parseFloat(data["Time Series (Daily)"][key]["4. close"]);
                            d1volume=parseFloat(data["Time Series (Daily)"][key]["5. volume"]);
                           
                            j=j+1;
                        }
                        else if(j==1){
                            d2close=parseFloat(data["Time Series (Daily)"][key]["4. close"]);
                            j=j+1;
                        }
                      });
                      $scope.localdata[i].p=d1close;
                      $scope.localdata[i].c=parseFloat(d1close-d2close);
                      $scope.localdata[i].cp=(parseFloat(d1close-d2close)/parseFloat(d2close))*100;
                }
            }
        };

        $scope.tab= function(graph){
             
            
            if(document.getElementById("con"+graph.toUpperCase()).style.display==''){    
                document.getElementById("shareBtn").disabled = false;
            }else{
                document.getElementById("shareBtn").disabled = true;
            }
            
        }
    
});

app.filter('display',function(){
    return function(stock,char){
        return stock.split('-')[0];
    }
});

app.service('testservice', function() {
    var list_name="ns";
    return {
        
            getHistoricalChart: function($scope,$http,sym) {
                var payload={"stock": sym};
                $scope.data = [];
                $scope.graphdata=[];
                $http({
                    url:'/timeseriesdaily',
                    method: "GET",
                    time:10000,
                    params: payload}).then(function mySuccess(response) {
                        var xhist = response.data;
                        
                        
                $scope.data = response.data;
                angular.forEach($scope.data["Time Series (Daily)"], function(value, key) {
                    $scope.graphdata.push([Date.parse(key),parseFloat($scope.data["Time Series (Daily)"][key]["4. close"])])
                });
                if( $scope.graphdata.length==0){
                    document.getElementById("progreshist").style.display="none";
                    document.getElementById("errorhist").style.display="";
                    document.getElementById("chart").style.display="none";
                    return;     
                }else {
                    document.getElementById("progreshist").style.display="none"
                    document.getElementById("chart").style.display=""
                    document.getElementById("errorhist").style.display="none";
                }
                $scope.graphdata.reverse();
                document.getElementById("chart").style.display=""
                document.getElementById("progreshist").style.display="none"
                Highcharts.stockChart('chart', {
                    
                    
                            rangeSelector: {
                                buttons:[{
                                    type:'week',
                                    count:1,
                                    text:'1w'
                                },{
                                    type:'month',
                                    count:1,
                                    text:'1m'
                                },{
                                    type:'month',
                                    count:3,
                                    text:'3m'
                                },{
                                    type:'month',
                                    count:6,
                                    text:'6m'
                                },{
                                    type:'ytd',
                                    count:1,
                                    text:'YTD'
                                },{
                                    type:'year',
                                    count:1,
                                    text:'1y'
                                },{
                                    type:'all',
                                    text:'ALL'
                                }
                                ],
                                selected: 0
                            },
                    
                            title: {
                                text:  sym +' Stock Price',
                            },
                            yAxis:{
                                title:{
                                    text: 'Stock value'
                                }
                            },
                            tooltip: {
                                split: false
                            },
                            subtitle: {
                                useHTML: true,
                                text: '<a  target="_blank" style="color: rgb(0, 0, 255); cursor: pointer; text-decoration: none;" href="https://www.alphavantage.co/">Source: Alpha Vantage</a>'
                            },
                            series: [{
                                name: sym,
                                data: $scope.graphdata,
                                type:'area',
                                tooltip: {
                                    valueDecimals: 2
                                }
                            }]
                        });
                },
                 function myError(response) {
                    $scope.myWelcome = response.statusText;
                    
                    document.getElementById("progreshist").style.display="none";
                    document.getElementById("errorhist").style.display="";
                    document.getElementById("chart").style.display="none";
                    
                    });
                  return list_name;
              },
              setListName: function(name) {
                  list_name = name;
              }
    };
});

app.config(['$httpProvider', function($httpProvider) {
    
            $httpProvider.defaults.useXDomain = true;
    
            delete $httpProvider.defaults.headers.common['X-Requested-With'];
    
        }
    
    ]);


app.controller('TypeaheadCtrl', function($scope, $http) {
    $scope.getLocation = function(val) {
        var payload={"stock": val};
        return $http({
            url:'/lookup',
            method: "GET",
            params: payload}).then(function mySuccess(response) {
            var res_arr=[];
            return response.data.map(function(res){
                
                return  res["Symbol"]+"-"+res["Name"]+"("+res["Exchange"]+")";
            });
        });
      };
});


app.service('graphs', function() {
    return {
        
    getGraphs: function($scope,$http,sym) { 
        $scope.data = [];
        var payload={"stock": sym};
        $http({
            url:'/timeseriesdaily',
            method: "GET",
            time:10000,
            params: payload}).then(function mySuccess(response) {
            var data=response.data;
            var x =[]
            var price=[]
            var volume=[]
            var i=0;
            var mon=""
            var numMonths=0
            angular.forEach(data["Time Series (Daily)"], function(value, key) {
                var d=String(key).split('-')
                if(i==0) mon=d[1]
                if(numMonths<6){
                  if(mon!=d[1]){
                    numMonths=numMonths+1
                    mon=d[1]
                  }
                  x[i]=d[1]+"/"+d[2]
                  price.push(parseFloat(data["Time Series (Daily)"][key]["4. close"]))
                  volume.push(parseFloat(data["Time Series (Daily)"][key]["5. volume"]))
                }
                i=i+1;
                
            });
            price.reverse();
            volume.reverse();
            x.reverse();
            var xStock = response.data;
            
            if(price.length==0){
                document.getElementById("progresprice").style.display="none";
                document.getElementById("errorprice").style.display="";
                document.getElementById("conPrice").style.display="none";
                return;
            }else {
                document.getElementById("progresprice").style.display="none"
                document.getElementById("conPrice").style.display=""
                document.getElementById("errorprice").style.display="none";
                if($('.nav-tabs .active').text().trim()=="Price"){
                    document.getElementById("shareBtn").disabled= false;
                }
            }
            Highcharts.chart('conPrice', {
                chart: {
                    zoomType: 'xy'
                },
                title: {
                    text: sym+' Stock Price and Volume'
                },
                subtitle: {
                    useHTML: true,
                    text: '<a target=\"_blank\" style=\"color: rgb(0, 0, 255); cursor: pointer; text-decoration: none;\" href=\"https://www.alphavantage.co/\">Source: Alpha Vantage</a>'
                },
                xAxis: [{
                    categories: x,
                    showLastLabel: true,
                    startOnTick: true,
                    labels:{
                        step: 1,
                        align: 'right',
                        rotation: -45
                    },
                    tickInterval: 5
                }],
                yAxis: [{ // Primary yAxis
                    labels: {
                        style: {
                            color: Highcharts.getOptions().colors[1]
                        }
                    },
                    title: {
                        text: 'Stock Price',
                        style: {
                            color: Highcharts.getOptions().colors[1]
                        }
                    }
                }, { // Secondary yAxis
                    title: {
                        text: 'Volume',
                        style: {
                            color: Highcharts.getOptions().colors[1]
                        }
                    },
                    labels: {
            formatter: function () {
                var label = this.axis.defaultLabelFormatter.call(this);
                // Use thousands separator for four-digit numbers too
                if (/^[0-9]{4}$/.test(label)) {
                    return Highcharts.numberFormat(this.value, 0);
                }
                return label;
            }
        },
                    opposite: true
                }],
                tooltip: {
                    shared: true
                },plotOptions: {
                    series: {
                        marker: {
                            enabled: false
                        }
                    }
                },
                legend: {
                    layout: 'vertical',
                    align: 'center',
                    verticalAlign: 'bottom',
                    
                    backgroundColor: (Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'
                },
                navigation: {
                    buttonOptions: {
                        enabled: true
                    }
                },
                exporting: {
                    url: 'http://export.highcharts.com/',
                    enabled: false
                },
                series: [{
                    name: "price",
                    type: 'area',
                    data: price,
                    color: '#236ab9'
                    
                },{
                    name: 'Volume',
                    type: 'column',
                    yAxis: 1,
                    color: 'red',
                    data: volume,
                    tooltip: {
                        valueSuffix: 'M'
                    }
            
                }]
            });
        
        
        }, function myError(response) {
        $scope.myWelcome = response.statusText;
        document.getElementById("progresprice").style.display="none";
        document.getElementById("errorprice").style.display="";
        document.getElementById("conPrice").style.display="none";
        });

        $http({
            url:'/graphSMA',
            method: "GET",
            time:10000,
            params: payload}).then(function mySuccess(response) {
        var xSMA = response.data.x;
        
        if(xSMA.length==0){
            document.getElementById("progressma").style.display="none";
            document.getElementById("errorsma").style.display="";
            document.getElementById("conSMA").style.display="none";
            return;
        }
        else {
            if($('.nav-tabs .active').text().trim()=="SMA"){
                document.getElementById("shareBtn").disabled= false;
            }
            document.getElementById("progressma").style.display="none"
            document.getElementById("conSMA").style.display=""
             document.getElementById("errorsma").style.display="none";
         }
         
        var dataSMA=response.data.dataOfSymbol;
        
        Highcharts.chart('conSMA', {
            chart: {
                type: 'line',
                zoomType: 'x'
            },
            title: {
                text: "Simple Moving Average (SMA)"
            },
            subtitle: {
                useHTML: true,
                text: '<a target="_blank" style="color: rgb(0, 0, 255); cursor: pointer; text-decoration: none;" href="https://www.alphavantage.co/">Source: Alpha Vantage</a>'
            },
            navigation: {
                enabled: true,
                buttonOptions: {
                    enabled: true
                }
            },
            xAxis: {
                categories: xSMA,
                showLastLabel: true,
                startOnTick: true,
                labels:{
                    step: 1,
                    align: 'right',
                    rotation: -45
                },
                tickInterval: 5
            },
            yAxis: {
                title: {
                    text: "SMA"
                }
            },
            plotOptions: {
                line: {
                    enableMouseTracking: true
                }
            },
            legend: {
                            layout: 'vertical',
                            align: 'center',
                            verticalAlign: 'bottom',
                            
                            backgroundColor: (Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'
                        },
            exporting: {
                url: 'http://export.highcharts.com/',
                enabled: false
            },
            series: [{
                name: sym,
                data: dataSMA
            }]
        });
        
        
        }, function myError(response) {
        $scope.myWelcome = response.statusText;
         
        document.getElementById("progressma").style.display="none";
        document.getElementById("errorsma").style.display="";
        document.getElementById("conSMA").style.display="none";
         
        });

        $http({
            url:'/graphCCI',
            method: "GET",
            time:10000,
            params: payload}).then(function mySuccess(response) {
        var xCCI = response.data.x;
        var dataCCI=response.data.dataOfSymbol;
        if(xCCI.length==0){
            document.getElementById("progrescci").style.display="none";
            document.getElementById("errorcci").style.display="";
            document.getElementById("conCCI").style.display="none";
            return;
        }
         else {
            if($('.nav-tabs .active').text().trim()=="CCI"){
                document.getElementById("shareBtn").disabled= false;
            }
             document.getElementById("progrescci").style.display="none"
             document.getElementById("conCCI").style.display=""
             document.getElementById("errorcci").style.display="none";
         }
        Highcharts.chart('conCCI', {
            chart: {
                type: 'line',
                zoomType: 'x'
                
            },
            title: {
                text: "Commodity Channel Index (CCI)"
            },
            subtitle: {
                useHTML: true,
                text: '<a target="_blank" style="color: rgb(0, 0, 255); cursor: pointer; text-decoration: none;" href="https://www.alphavantage.co/">Source: Alpha Vantage</a>'
            },
            navigation: {
                enabled: true,
                buttonOptions: {
                    enabled: true
                }
            },
            xAxis: {
                categories: xCCI,
                showLastLabel: true,
                startOnTick: true,
                labels:{
                    step: 1,
                    align: 'right',
                    rotation: -45
                },
                tickInterval: 5
            },
            yAxis: {
                title: {
                    text: "CCI"
                }
            },
            plotOptions: {
                line: {
                    enableMouseTracking: true
                }
            },
            legend: {
                            layout: 'vertical',
                            align: 'center',
                            verticalAlign: 'bottom',
                            
                            backgroundColor: (Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'
                        },
            series: [{
                name: sym,
                data: dataCCI
            }]
        });
        
        
        }, function myError(response) {
        $scope.myWelcome = response.statusText;
        });

        $http({
            url:'/graphADX',
            method: "GET",
            time:10000,
            params: payload}).then(function mySuccess(response) {
        var xADX = response.data.x;
        var dataADX=response.data.dataOfSymbol;
        if(xADX.length==0){
            document.getElementById("progresadx").style.display="none";
            document.getElementById("erroradx").style.display="";
            document.getElementById("conADX").style.display="none";
            return;
        }
         else {
            if($('.nav-tabs .active').text().trim()=="ADX"){
                document.getElementById("shareBtn").disabled= false;
            }
             document.getElementById("progresadx").style.display="none"
             document.getElementById("conADX").style.display=""
             document.getElementById("erroradx").style.display="none";
         }
        Highcharts.chart('conADX', {
            chart: {
                type: 'line',
                zoomType: 'x'
            },
            title: {
                text: "Average Directional movement indeX (ADX)"
            },
            subtitle: {
                useHTML: true,
                text: '<a target="_blank" style="color: rgb(0, 0, 255); cursor: pointer; text-decoration: none;" href="https://www.alphavantage.co/">Source: Alpha Vantage</a>'
            },
            navigation: {
                enabled: true,
                buttonOptions: {
                    enabled: true
                }
            },
            xAxis: {
                categories: xADX,
                showLastLabel: true,
                startOnTick: true,
                labels:{
                    step: 1,
                    align: 'right',
                    rotation: -45
                },
                tickInterval: 5
            },
            yAxis: {
                title: {
                    text: "ADX"
                }
            },
            plotOptions: {
                line: {
                    enableMouseTracking: true
                }
            },
            legend: {
                            layout: 'vertical',
                            align: 'center',
                            verticalAlign: 'bottom',
                            
                            backgroundColor: (Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'
                        },
            series: [{
                name: sym,
                data: dataADX
            }]
        });
        
        
        }, function myError(response) {
            document.getElementById("progresadx").style.display="none";
            document.getElementById("erroradx").style.display="";
            document.getElementById("conADX").style.display="none";
            $scope.myWelcome = response.statusText;
        });

        $http({
            url:'/graphEMA',
            method: "GET",
            time:10000,
            params: payload}).then(function mySuccess(response) {
        var xEMA = response.data.x;
        var dataEMA=response.data.dataOfSymbol;
        if(xEMA.length==0){
            document.getElementById("progresema").style.display="none";
            document.getElementById("errorema").style.display="";
            document.getElementById("conEMA").style.display="none";
            return;
        }else {
            if($('.nav-tabs .active').text().trim()=="EMA"){
                document.getElementById("shareBtn").disabled= false;
            }
            document.getElementById("progresema").style.display="none"
            document.getElementById("conEMA").style.display=""
            document.getElementById("errorema").style.display="none";
        }
        Highcharts.chart('conEMA', {
            chart: {
                type: 'line',
                zoomType: 'x'
            },
            title: {
                text: "Exponential Moving Average (EMA)"
            },
            subtitle: {
                useHTML: true,
                text: '<a target="_blank" style="color: rgb(0, 0, 255); cursor: pointer; text-decoration: none;" href="https://www.alphavantage.co/">Source: Alpha Vantage</a>'
            },
            navigation: {
                enabled: true,
                buttonOptions: {
                    enabled: true
                }
            },
            xAxis: {
                categories: xEMA,
                showLastLabel: true,
                startOnTick: true,
                labels:{
                    step: 1,
                    align: 'right',
                    rotation: -45
                },
                tickInterval: 5
            },
            yAxis: {
                title: {
                    text: "EMA"
                }
            },
            plotOptions: {
                line: {
                    enableMouseTracking: true
                }
            },
            legend: {
                            layout: 'vertical',
                            align: 'center',
                            verticalAlign: 'bottom',
                            
                            backgroundColor: (Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'
                        },
            series: [{
                name: sym,
                data: dataEMA
            }]
        });
        
        
        }, function myError(response) {
            document.getElementById("progresema").style.display="none";
            document.getElementById("errorema").style.display="";
            document.getElementById("conEMA").style.display="none";
            $scope.myWelcome = response.statusText;
        });

        $http({
            url:'/graphRSI',
            method: "GET",
            time:10000,
            params: payload}).then(function mySuccess(response) {
        var xRSI = response.data.x;
        var dataRSI=response.data.dataOfSymbol;
        if(xRSI.length==0){
            document.getElementById("progresrsi").style.display="none"
            document.getElementById("conRSI").style.display="none"
            document.getElementById("errorrsi").style.display=""
            return;
        }
         else{
            if($('.nav-tabs .active').text().trim()=="RSI"){
                document.getElementById("shareBtn").disabled= false;
            }
             document.getElementById("progresrsi").style.display="none"
             document.getElementById("conRSI").style.display=""
             document.getElementById("errorrsi").style.display="none"
         }
        
        Highcharts.chart('conRSI', {
            chart: {
                type: 'line',
                zoomType: 'x'
            },
            title: {
                text: "Relative Strength Index (RSI)"
            },
            subtitle: {
                useHTML: true,
                text: '<a target="_blank" style="color: rgb(0, 0, 255); cursor: pointer; text-decoration: none;" href="https://www.alphavantage.co/">Source: Alpha Vantage</a>'
            },
            navigation: {
                enabled: true,
                buttonOptions: {
                    enabled: true
                }
            },
            xAxis: {
                categories: xRSI,
                showLastLabel: true,
                startOnTick: true,
                labels:{
                    step: 1,
                    align: 'right',
                    rotation: -45
                },
                tickInterval: 5
            },
            yAxis: {
                title: {
                    text: "RSI"
                }
            },
            plotOptions: {
                line: {
                    enableMouseTracking: true
                }
            },
            legend: {
                            layout: 'vertical',
                            align: 'center',
                            verticalAlign: 'bottom',
                            
                            backgroundColor: (Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'
                        },
            series: [{
                name: sym,
                data: dataRSI
            }]
        });
        
        
        }, function myError(response) {
            document.getElementById("progresrsi").style.display="none"
            document.getElementById("conRSI").style.display="none"
            document.getElementById("errorrsi").style.display=""
            $scope.myWelcome = response.statusText;
        });

        $http({
            url:'/graphBBANDS',
            method: "GET",
            time:10000,
            params: payload}).then(function mySuccess(response) {
        var xBBANDS = response.data.x;
        var RMB=response.data.RMB;
        var RUB=response.data.RUB;
        var RLB=response.data.RLB;
        if(xBBANDS.length==0){
            document.getElementById("progresbbands").style.display="none"
            document.getElementById("conBBANDS").style.display="none"
            document.getElementById("errorbbands").style.display=""
            return;
        }
        else{
            if($('.nav-tabs .active').text().trim()=="BBANDS"){
                document.getElementById("shareBtn").disabled= false;
            }
             document.getElementById("progresbbands").style.display="none"
             document.getElementById("conBBANDS").style.display=""
             document.getElementById("errorbbands").style.display="none"
         }
        
        Highcharts.chart('conBBANDS', {
            chart: {
                type: 'line',
                zoomType: 'x'
            },
            title: {
                text: 'Bollinger Bands (BBANDS)'
            },
            subtitle: {
                useHTML: true,
                text: '<a target="_blank" style="color: rgb(0, 0, 255); cursor: pointer; text-decoration: none;" href="https://www.alphavantage.co/">Source: Alpha Vantage</a>'
            },
            xAxis: {
                categories: xBBANDS,
                showLastLabel: true,
                startOnTick: true,
                labels:{
                    step: 1,
                    align: 'right',
                    rotation: -45
                },
                tickInterval: 5
            },
            yAxis: {
                title: {
                    text: 'BBANDS'
                }
            },
            plotOptions: {
                line: {
                    enableMouseTracking: true
                }
            },
            legend: {
                            layout: 'vertical',
                            align: 'center',
                            verticalAlign: 'bottom',
                            
                            backgroundColor: (Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'
                        },
            series: [{
                name: sym+" Real Middle Band",
                data: RMB
            },{
                name: sym+" Real Upper Band",
                data: RUB
            },{
                name: sym+" Real Lower Band",
                data: RLB
            }]
        });
        
        
        }, function myError(response) {
            document.getElementById("progresbbands").style.display="none"
            document.getElementById("conBBANDS").style.display="none"
            document.getElementById("errorbbands").style.display=""
            $scope.myWelcome = response.statusText;
        });

        $http({
            url:'/graphMACD',
            method: "GET",
            time:10000,
            params: payload}).then(function mySuccess(response) {
        var xMACD = response.data.x;
        var MACD=response.data.MACD;
        var MACD_Hist=response.data.MACD_Hist;
        var MACD_Signal=response.data.MACD_Signal;
        if(xMACD.length==0){
            document.getElementById("progresmacd").style.display="none"
            document.getElementById("conMACD").style.display="none"
            document.getElementById("errormacd").style.display=""
            return;
        }
         else{
            if($('.nav-tabs .active').text().trim()=="MACD"){
                document.getElementById("shareBtn").disabled= false;
            }
             document.getElementById("progresmacd").style.display="none"
             document.getElementById("conMACD").style.display=""
             document.getElementById("errormacd").style.display="none"
         }
        Highcharts.chart('conMACD', {
            chart: {
                type: 'line',
                zoomType: 'x'
            },
            title: {
                text: 'Moving Average Covergence/Divergence (MACD)'
            },
            subtitle: {
                useHTML: true,
                text: '<a target="_blank" style="color: rgb(0, 0, 255); cursor: pointer; text-decoration: none;" href="https://www.alphavantage.co/">Source: Alpha Vantage</a>'
            },
            xAxis: {
                categories: xMACD,
                showLastLabel: true,
                startOnTick: true,
                labels:{
                    step: 1,
                    align: 'right',
                    rotation: -45
                },
                tickInterval: 5
            },
            yAxis: {
                title: {
                    text: 'MACD'
                }
            },
            plotOptions: {
                line: {
                    enableMouseTracking: true
                }
            },
            legend: {
                            layout: 'vertical',
                            align: 'center',
                            verticalAlign: 'bottom',
                            
                            backgroundColor: (Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'
                        },
            series: [{
                name: sym+" MACD",
                data: MACD
            },{
                name: sym+" MACD_Hist",
                data: MACD_Hist
            },{
                name: sym+" MACD_Signal",
                data: MACD_Signal
            }]
        });
        
        
        }, function myError(response) {
            document.getElementById("progresmacd").style.display="none"
            document.getElementById("conMACD").style.display="none"
            document.getElementById("errormacd").style.display=""
            $scope.myWelcome = response.statusText;
        });

        $http({
            url:'/graphSTOCH',
            method: "GET",
            time:10000,
            params: payload}).then(function mySuccess(response) {
                var xSTOCH = response.data.x;
                var dataOfSymbolSlowK=response.data.dataOfSymbolSlowK;
                var dataOfSymbolSlowD=response.data.dataOfSymbolSlowD;
                if(xSTOCH.length==0){
                    document.getElementById("progresstoch").style.display="none"
                    document.getElementById("conSTOCH").style.display="none"
                    document.getElementById("errorstoch").style.display=""
                    return;
                }
                 else{
                    if($('.nav-tabs .active').text().trim()=="STOCH"){
                        document.getElementById("shareBtn").disabled= false;
                    }
                     document.getElementById("progresstoch").style.display="none"
                     document.getElementById("conSTOCH").style.display=""
                     document.getElementById("errorstoch").style.display="none"
                 }
        Highcharts.chart('conSTOCH', {
    		chart: {
        		type: 'line',
                zoomType: 'x'
    		},
    		title: {
        		text: 'Stochastic Oscillator (STOCH)'
    		},
    		subtitle: {
				useHTML: true,
        		text: '<a  target="_blank" style="color: rgb(0, 0, 255); cursor: pointer; text-decoration: none;" href="https://www.alphavantage.co/">Source: Alpha Vantage</a>'
    		},
    		xAxis: {
        		categories: xSTOCH,
				showLastLabel: true,
				startOnTick: true,
				labels:{
					step: 1,
					align: 'right',
					rotation: -45
				},
				tickInterval: 5
    		},
    		yAxis: {
        		title: {
            		text: 'STOCH'
		        }
    		},
    		plotOptions: {
        		line: {
            		enableMouseTracking: true
        		}
    		},
			legend: {
					layout: 'vertical',
                    align: 'center',
                    verticalAlign: 'bottom',
					
					backgroundColor: (Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'
				},
    		series: [{
				name: sym+" SlowK",
        		data: dataOfSymbolSlowK
			},{
        		name: sym+" SlowD",
        		data: dataOfSymbolSlowD
    		}]
		});
        
        
        }, function myError(response) {
        $scope.myWelcome = response.statusText;
        document.getElementById("progresstoch").style.display="none"
        document.getElementById("conSTOCH").style.display="none"
        document.getElementById("errorstoch").style.display=""
        });
    
}
    }; 
  });

app.service('newsfeed', function() {
    return {
    getFeed: function($scope,$http,sym) {
        var payload={"stock": sym}; 
        $http({
            url:'/newsdata',
            method: "GET",
            time:10000,
            params: payload}).then(function mySuccess(response) {
                var xnews = response.data;
                if(xnews.length==0){
                    document.getElementById("progresnewsfeed").style.display="none"
                    document.getElementById("feeds").style.display="none"
                    document.getElementById("errornews").style.display=""
                    return;
                }
                 else{
                     document.getElementById("progresnewsfeed").style.display="none"
                     document.getElementById("feeds").style.display=""
                     document.getElementById("errornews").style.display="none"
                 }
                var news=[], count=0;
                for(var i in response.data)
                if(response.data[i].link[0].indexOf('article')>0&&count<5){
                    var date = response.data[i].pubDate[0].split('-')[0];
                    response.data[i].pubDate[0]= date+moment.tz(date,'America/New_York').zoneAbbr();
                    news.push(response.data[i])
                    count=count+1;
                }
                $scope.newsdata=news;
        }, function myError(response) {
            $scope.myWelcome = response.statusText;
            document.getElementById("progresnewsfeed").style.display="none"
            document.getElementById("feeds").style.display="none"
            document.getElementById("errornews").style.display=""
        });
    }
    };
});

app.controller('fav',function($scope){
    if(localStorage!==undefined){
        $scope.localdata=[]
        if(localStorage.getItem("stocks")){
            var obj_stocks=JSON.parse(localStorage.getItem("stocks"))
            if(obj_stocks!==undefined){
                for(var i in obj_stocks){
                    for(var k in JSON.parse(obj_stocks[i])){
                        $scope.localdata.push(JSON.parse(obj_stocks[i])[k])
                    }
                }
            }
        }
    }

    $scope.delete= function(val){
        var obj_stocks=JSON.parse(localStorage.getItem("stocks"))
        if(obj_stocks!==undefined){
            for(var i in obj_stocks)
            if (obj_stocks[i]!=null&&JSON.parse(obj_stocks[i])[val]!==undefined) {
                obj_stocks.splice(i,1);
                localStorage.setItem("stocks",JSON.stringify(obj_stocks));
                $scope.localdata=obj_stocks;
            }
        }
    }

});

function date_validation(stockdate){
    var verifyDate=moment().format('YYYY-MM-DD')
    var today=moment().format('YYYY-MM-DD HH:mm:ss');
    var current=moment(today, "YYYY-MM-DD hh:mm:ss");
    var starttime = moment(today.split(" ")[0]+" 09:30:00", "YYYY-MM-DD HH:mm:ss"); 
    var endTime = moment(today.split(" ")[0]+" 16:00:00","YYYY-MM-DD HH:mm:ss");
    var date= new Date();
    if(stockdate!=verifyDate){
        return stockdate+" "+"16:00:00"+" "+moment.tz(stockdate,'America/New_York').zoneAbbr();
    }
    else{
         if(current.isBetween(starttime,endTime)){
             return today+" "+moment.tz(current,'America/New_York').zoneAbbr();
         }
         else if(current.isAfter(endTime)){
             return stockdate+" "+"16:00:00"+" "+moment.tz(stockdate,'America/New_York').zoneAbbr();
         }
    } 
}

app.service('timeSeries', function() {
    return {
        
        getTable: function($scope,$http,sym) {
        var payload={"stock": sym};
        if(localStorage!==undefined){
            if(localStorage.getItem("stocks")){
                var obj_stocks=JSON.parse(localStorage.getItem("stocks"))
                if(obj_stocks!==undefined){
                    var found=false;
                    for(var i in obj_stocks){
                    if (obj_stocks[i]!=null&&JSON.parse(obj_stocks[i])[sym]!==undefined) {
                        document.getElementById('fav').style.color="yellow"
                        found=true;
                    }
                    }
                    if(found==false){
                        document.getElementById('fav').style.color="white"
                    }
                }else{
                    document.getElementById('fav').style.color="white"
                }
                
            }
        }
		$scope.data = [];
		$http({
            url:'/timeseriesdaily',
            method: "GET",
            time:10000,
            params: payload}).then(function mySuccess(response) {
                var xtable = response.data;
                
        
        $scope.data = response.data;
        $scope.symbol=$scope.data["Meta Data"]["2. Symbol"];
        if($scope.symbol.length==0){
            document.getElementById("progrestable").style.display="none"
            document.getElementById("stocktable").style.display="none"
            document.getElementById("errortable").style.display=""
        }
         else{
             document.getElementById("progrestable").style.display="none"
             document.getElementById("stocktable").style.display=""
            document.getElementById("errortable").style.display="none"
         }
        $scope.timestamp= date_validation($scope.data["Meta Data"]["3. Last Refreshed"]);
        var i=0,day1c,day2c;
        angular.forEach($scope.data["Time Series (Daily)"], function(value, key) {
            if(i==0){
                $scope.d1open=$scope.data["Time Series (Daily)"][key]["1. open"];
                $scope.d1close=parseFloat($scope.data["Time Series (Daily)"][key]["4. close"]);
                day1c=parseFloat($scope.data["Time Series (Daily)"][key]["4. close"]);
                $scope.d1low=$scope.data["Time Series (Daily)"][key]["3. low"];
                $scope.d1high=$scope.data["Time Series (Daily)"][key]["2. high"];
                $scope.d1volume=parseFloat($scope.data["Time Series (Daily)"][key]["5. volume"]);
                $scope.price=parseFloat($scope.data["Time Series (Daily)"][key]["4. close"]);
                i=i+1;
            }
            else if(i==1){
                $scope.d2open=$scope.data["Time Series (Daily)"][key]["1. open"];
                $scope.d2close=parseFloat($scope.data["Time Series (Daily)"][key]["4. close"]);
                day2c=parseFloat($scope.data["Time Series (Daily)"][key]["4. close"]);
                $scope.d2low=$scope.data["Time Series (Daily)"][key]["3. low"];
                $scope.d2high=$scope.data["Time Series (Daily)"][key]["2. high"];
                $scope.d2volume=$scope.data["Time Series (Daily)"][key]["5. volume"];
                i=i+1;
            }
          });
          $scope.change=$scope.d1close-$scope.d2close;
          $scope.changepercent=(parseFloat($scope.change)/parseFloat($scope.d2close))*100;
          if($scope.change>=0){
              $scope.cper={"color":"green"};
          } else {
            $scope.cper={"color":"red"};
          }
        
		
    }, function myError(response) {
        $scope.myWelcome = response.statusText;
        document.getElementById("progrestable").style.display="none"
        document.getElementById("stocktable").style.display="none"
        document.getElementById("errortable").style.display=""
    });
    }
    };
});