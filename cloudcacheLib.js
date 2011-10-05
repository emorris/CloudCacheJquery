var cloudCache = {
    access_key  :   'b5ec816c-9973-11de-954f-12313b000e46',
    secret_key  :   'de01ca095d586f17b57f0f902f6f45c5',
    timestamp   :   new Date().getTime(),
    baseUrl     :   "http://174.129.12.177:4567/",
    auth        :   "",
    shaObj      :   null,
    hmac        :   null,
    headers     :   {},
    
    init    : function()
    {
        this.buildAuth();
    }, 
    buildAuth: function()
    {
        this.timestamp  = new Date().getTime();
        this.auth       =   "CloudCache"+this.access_key+this.timestamp;
        this.shaObj     =   new jsSHA(this.auth,"HEX");
        this.hmac       =   shaObj.getHMAC(this.secret_key, "ASCII", "SHA-1", "HEX");
        this.setHeaders();
    },
    
    setHeaders : function()
    {
        this.headers = {
                  'access-key': this.access_key,
                  'timestamp' : this.timestamp,
                  'signature' : this.hmac
            }    
    },
    
    testAuth : function(callback)
    {
        this.buildAuth();
        $.ajax({
            headers: this.headers,
            type: "GET",
            url: this.baseUrl+"auth",
            success: function(data){
                callback(data);
            }
        });
    },
    
    putKeyValue : function (key, data,callback)
    {
        this.buildAuth();
        $.ajax({
            headers: this.headers,
            type: "POST",
            url: this.baseUrl+key,
            data:data,
            success: function(data){
                callback(data);
            }
        });
    },
    getValue : function(key,callback)
    {
        this.buildAuth();
        $.ajax({
            headers: this.headers,
            type: "GET",
            url: this.baseUrl+key,
            data:data,
            success: function(data){
                callback(data);
            }
        });
    },
    
    deleteValue : function(key,callback)
    {
        this.buildAuth();
        $.ajax({
            headers: this.headers,
            type: "DELETE",
            url: this.baseUrl+key,
            data:data,
            success: function(data){
                callback(data);
            }
        });
    
    },
    
    
    getMultiValue : function(data,callback)
    {
        this.buildAuth();
        $.ajax({
            headers: this.headers,
            type: "GET",
            url: baseUrl+"getmulti",
            dataTypeString:"jsonp",
            data:data,
            success: function(data){
                callback(data);
            }
        });
    },

    
    incrementKey : function(key,incr,callback)
    {
        this.buildAuth();   
        $.ajax({
            headers: this.headers,
            type: "POST",
            url: this.baseUrl+key+"/incr",
            dataTypeString:"jsonp",
            data:{val : incr},
            success: function(data){
                callback(data);
            }
        });
    },
    
    decrementKey : function(key,incr,callback)
    {
        this.buildAuth();
        $.ajax({
            headers: this.headers,
            type: "POST",
            url: this.baseUrl+this.key+"/decr",
            dataTypeString:"jsonp",
            data:{val : incr},
            success: function(data){
                callback(data);
            }
        });
    },

    flush : function(callback)
    {
                this.buildAuth();
                $.ajax({
                    headers: this.headers,
                    type: "GET",
                    url: this.baseUrl+"flush",
                    dataTypeString:"jsonp",
                    success: function(data){
                        callback(data);
                    }
                });
            },
    listKeys : function(callback)
    {
        this.buildAuth();
        $.ajax({
            headers: this.headers,
            type: "GET",
            url: this.baseUrl+"listkeys",
            dataTypeString:"jsonp",
            success: function(data){
                callback(data);
            }
        })
    },
    
    listKeysValues : function(callback)
    {
        this.buildAuth();
        $.ajax({
            headers: this.headers,
            type: "GET",
            url: this.baseUrl+"list",
            dataTypeString:"jsonp",
            success: function(data){
                callback(data);
            }
        })
    },
    
    getMyUsage : function(callback)
    {
        this.buildAuth();
        $.ajax({
            headers: this.headers,
            type: "GET",
            url: this.baseUrl+"myusage",
            dataTypeString:"jsonp",
            success: function(data){
                callback(data);
            }
        })
    }
}

cloudCache.testAuth();