var cloudCache = {
    access_key  :   'b5ec816c-9973-11de-954f-12313b000e46',
    secret_key  :   'de01ca095d586f17b57f0f902f6f45c5',
    timestamp   :   new Date().getTime(),
    baseUrl     :   "http://0.0.0.0:4567/",
    auth        :   "",
    shaObj      :   null,
    hmac        :   null,
    headers     :   {},
    
    init    : function()
    {
        this.buildAuth();
    }, 
    buildAuth: function(opertaion)
    {
        this.timestamp  = new Date().getTime();
        this.auth       =   "CloudCache"+opertaion+this.timestamp;
        this.shaObj     =   new jsSHA(this.auth,"ASCII");
        this.hmac       =   this.shaObj.getHMAC(this.secret_key, "ASCII", "SHA-1", "B64");
        this.setHeaders();
    },
    
    setHeaders : function()
    {
        this.headers = {
                  'HTTP_AKEY': this.access_key,
                  'HTTP_TIMESTAMP' : this.timestamp,
                  'HTTP_SIGNATURE' : this.hmac+"="
            }    
    },
    
    testAuth : function(callback)
    {
        this.buildAuth("auth");
        $.ajax({
            headers: this.headers,
            dataType: "jsonp",
            type: "GET",
            data:this.headers,
            url: this.baseUrl+"auth",
            success: function(data){
                callback(data);
            }
        });
    },
    
    putKeyValue : function (key, data,callback)
    {
        this.buildAuth('POST');
        var sendData = this.headers;
        sendData.data = data;
        $.ajax({
            dataType: "jsonp",
            url: this.baseUrl+"put/"+key,
            data:sendData,
            success: function(data){
                callback(data);
            }
        });
    },
    getValue : function(key,callback)
    {
        this.buildAuth("GET");
        var sendData = this.headers;
        $.ajax({
            dataType: "jsonp",
            data:sendData,
            url: this.baseUrl+"get/"+key,
            success: function(data){
                callback(data);
            }
        });
    },
    
    deleteKey : function(key,callback)
    {
        this.buildAuth("DELETE");
        $.ajax({
            type: "DELETE",
            dataType: "jsonp",
            data: this.headers,
            url: this.baseUrl+"delete/"+key,
            success: function(data){
                callback(data);
            }
        });
    
    },
    
    
    getMultiValue : function(data,callback)
    {

        this.buildAuth("GET");
        var sendData = this.headers;
        sendData.data = data;

        $.ajax({
            type: "GET",
            url: this.baseUrl+"get/multi",
            dataType: "jsonp",
            data:sendData,
            success: function(data){
                callback(data);
            }
        });
    },

    
    incrementKey : function(key,incr,callback)
    {
        this.buildAuth("POST");   
        $.ajax({
            headers: this.headers,
            type: "POST",
            url: this.baseUrl+key+"/incr",
            dataType: "jsonp",
            data:{val : incr},
            success: function(data){
                callback(data);
            }
        });
    },
    
    decrementKey : function(key,incr,callback)
    {
        this.buildAuth("POST");
        $.ajax({
            headers: this.headers,
            type: "POST",
            url: this.baseUrl+this.key+"/decr",
            dataType: "jsonp",
            data:{val : incr},
            success: function(data){
                callback(data);
            }
        });
    },

    flush : function(callback)
    {
                this.buildAuth("flush");
                $.ajax({
                    data: this.headers,
                    url: this.baseUrl+"get/flush",
                    dataType: "jsonp",
                    success: function(data){
                        callback(data);
                    }
                });
            },
    listKeys : function(callback)
    {
        this.buildAuth("listkeys");
        $.ajax({
            data: this.headers,
            url: this.baseUrl+"get/listkeys",
            dataType: "jsonp",
            success: function(data){
                callback(data);
            }
        })
    },
    
    listKeysValues : function(callback)
    {
        this.buildAuth("list");
        $.ajax({
            data: this.headers,
            url: this.baseUrl+"get/list",
            dataType: "jsonp",
            success: function(data){
                callback(data);
            }
        })
    },
    
    getMyUsage : function(callback)
    {
        this.buildAuth("myusage");
        $.ajax({
            data: this.headers,
            url: this.baseUrl+"get/myusage",
            dataType: "jsonp",
            success: function(data){
                callback(data);
            }
        })
    }
}
var printData= function(data){
    $("#dump").append(data+" <br/> ");
}



var test1 = function(){
    var key ='test001';
    cloudCache.putKeyValue(key, "Hello World",function(data){
            printData("=====TEST1 === ");
            printData("PUT KEY ? === >"+data);
            //GetKey
            cloudCache.getValue(key, function(data){
                printData("GET KEY? === >"+data);
                //deleteKey
                cloudCache.deleteKey(key, function(data){
                    printData("DELETE KEY ? === >"+data);
                    printData("=====TEST1__END === ");
                });
                
            });
        });
}
var test2 = function(){
    var keys =new Array("test1","test2","test3");
    printData("=====TEST2 === ");
    $.each(keys,function(key,value){
        cloudCache.putKeyValue(value, value,function(data){
            printData("PUT KEY = "+ value +" ? === >"+data);
            if((keys.length - 1) == key){
               setTimeout(
                    function(){
                       cloudCache.getMultiValue(keys,function(data){
                            $.each(data,function(key,value){
                                printData("GET MultiValue ? === >"+value);
                            });
                        });
                    },1000
                );
            }
        });
        
    });

}
var test3 = function(){
  var key ='test003';
    cloudCache.putKeyValue(key, "Hello World",function(data){
            printData("=====TEST3 === ");
            printData("PUT KEY ? === >"+data);
            //flush
            cloudCache.flush(function(data){
                printData("FLUSH ? === >"+data);
                cloudCache.getValue(key, function(data){
                    printData("GET KEY? === >"+data);
                });
            });
    });

}
var test4 = function(){
    test2();
    printData("=====TEST4 === ");
    cloudCache.listKeys(function(data){
        printData("GET listKeys? === >"+data);
    });
   cloudCache.listKeysValues(function(data){
        $.each(data,function(key,value){
            printData("GET listKeysValues? KEY = "+key+", Value = "+value);
        });
    });
    cloudCache.getMyUsage(function(data){
        printData("GET getMyUsage? === >"+data);
    });
}
$(document).ready(function() {
    //test1();
    //test2();
    //test3();
    //test4();
});


//cloudCache.testAuth(printData);

