progress = function(i, element, callback) {
  var width = i + '%';
  $(element).width(width);
  if (i < 100) {
    i = i + 1;
    setTimeout(function() {progress(i, element, callback);}, 2);
  } else {
    callback(callback);
  }
};

generatePassword = function() {
    var length = 10;
	var password = '', character; 
	while (length > password.length) {
		if (password.indexOf(character = String.fromCharCode(Math.floor(Math.random() * 94) + 33), Math.floor(password.length / 94) * 94) < 0) {
			password += character;
        }        
	}
	return password;
};

bytesToSize = function(bytes) {
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
    if (bytes === 0) return 'n/a'
    const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)), 10)
    if (i === 0) return `${bytes} ${sizes[i]})`
    return `${(bytes / (1024 ** i)).toFixed(1)} ${sizes[i]}`
  };

// Opera 8.0+
isOpera = (!!window.opr && !!opr.addons) || !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0;

// Firefox 1.0+
isFirefox = typeof InstallTrigger !== 'undefined';

// Safari 3.0+ "[object HTMLElementConstructor]" 
isSafari = /constructor/i.test(window.HTMLElement) || (function (p) { return p.toString() === "[object SafariRemoteNotification]"; })(!window['safari'] || (typeof safari !== 'undefined' && safari.pushNotification));

// Internet Explorer 6-11
isIE = /*@cc_on!@*/false || !!document.documentMode;

// Edge 20+
isEdge = !isIE && !!window.StyleMedia;

// Chrome 1+
isChrome = !!window.chrome && !!window.chrome.webstore;

// Blink engine detection
isBlink = (isChrome || isOpera) && !!window.CSS;

roughSizeOfObjectInMB = function( object ) {

    var objectList = [];
    var stack = [ object ];
    var bytes = 0;

    while ( stack.length ) {
        var value = stack.pop();

        if ( typeof value === 'boolean' ) {
            bytes += 4;
        }
        else if ( typeof value === 'string' ) {
            bytes += value.length * 2;
        }
        else if ( typeof value === 'number' ) {
            bytes += 8;
        }
        else if
        (
            typeof value === 'object'
            && objectList.indexOf( value ) === -1
        )
        {
            objectList.push( value );

            for( var i in value ) {
                stack.push( value[ i ] );
            }
        }
    }
    return bytes * 0.000001;
}





