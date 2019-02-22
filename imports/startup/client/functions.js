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

applySaturationToHexColor = function(hex, saturationPercent) {
    if (!/^#([0-9a-f]{6})$/i.test(hex)) {
        throw('Unexpected color format');
    }

    if (saturationPercent < 0 || saturationPercent > 100) {
        throw('Unexpected color format');
    }

    var saturationFloat   = saturationPercent / 100,
        rgbIntensityFloat = [
            parseInt(hex.substr(1,2), 16) / 255,
            parseInt(hex.substr(3,2), 16) / 255,
            parseInt(hex.substr(5,2), 16) / 255
        ];

    var rgbIntensityFloatSorted = rgbIntensityFloat.slice(0).sort(function(a, b){ return a - b; }),
        maxIntensityFloat       = rgbIntensityFloatSorted[2],
        mediumIntensityFloat    = rgbIntensityFloatSorted[1],
        minIntensityFloat       = rgbIntensityFloatSorted[0];

    if (maxIntensityFloat == minIntensityFloat) {
        // All colors have same intensity, which means 
        // the original color is gray, so we can't change saturation.
        return hex;
    }

    // New color max intensity wont change. Lets find medium and weak intensities.
    var newMediumIntensityFloat,
        newMinIntensityFloat = maxIntensityFloat * (1 - saturationFloat);

    if (mediumIntensityFloat == minIntensityFloat) {
        // Weak colors have equal intensity.
        newMediumIntensityFloat = newMinIntensityFloat;
    }
    else {
        // Calculate medium intensity with respect to original intensity proportion.
        var intensityProportion = (maxIntensityFloat - mediumIntensityFloat) / (mediumIntensityFloat - minIntensityFloat);
        newMediumIntensityFloat = (intensityProportion * newMinIntensityFloat + maxIntensityFloat) / (intensityProportion + 1);
    }

    var newRgbIntensityFloat       = [],
        newRgbIntensityFloatSorted = [newMinIntensityFloat, newMediumIntensityFloat, maxIntensityFloat];

    // We've found new intensities, but we have then sorted from min to max.
    // Now we have to restore original order.
    rgbIntensityFloat.forEach(function(originalRgb) {
        var rgbSortedIndex = rgbIntensityFloatSorted.indexOf(originalRgb);
        newRgbIntensityFloat.push(newRgbIntensityFloatSorted[rgbSortedIndex]);
    });

    var floatToHex = function(val) { return ('0' + Math.round(val * 255).toString(16)).substr(-2); },
        rgb2hex    = function(rgb) { return '#' + floatToHex(rgb[0]) + floatToHex(rgb[1]) + floatToHex(rgb[2]); };

    var newHex = rgb2hex(newRgbIntensityFloat);

    return newHex;
}

hexContrast = (hexcolor) => {
    var r = parseInt(hexcolor.substr(0,2),16);
	var g = parseInt(hexcolor.substr(2,2),16);
	var b = parseInt(hexcolor.substr(4,2),16);
	var yiq = ((r*299)+(g*587)+(b*114))/1000;
	return (yiq >= 128) ? 'black' : 'white';
};



