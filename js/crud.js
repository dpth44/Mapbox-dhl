/**
 * 
 * @param {String} url - request url - required
 * @param {Function} callback - function callback - required
 * @param {String} method - request method - optionnal
 * @param {Object} body - Formated to JSON - optionnal
 */
function xhr(url,callback,method,body,async) {
    if(!method){
        method = "GET" ;
    }
    if(!async){
        async = true;
    }
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            // Typical action to be performed when the document is ready:
            callback(this.response)
        }else if(this.readyState == 4 && this.status == 201){
            callback(this.response)
        }
        
    };
    xhr.open(method, url, async);
    xhr.setRequestHeader("Content-Type","application/json");
    xhr.send(JSON.stringify(body));
    !async?callback(xhr.response):null;
}