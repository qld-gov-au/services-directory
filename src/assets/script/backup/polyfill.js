// string contains something
if (!String.prototype.contains) {
    String.prototype.contains = function (arg) {
        'use strict';
        return !!~this.indexOf(arg);
    };
}

// object keys
if (!Object.keys) {
    Object.keys = function (o) {
        'use strict';
        if (o !== Object(o)) {
            throw new TypeError('Object.keys called on a non-object');
        }
        var k = [], p;
        for (p in o) {
            if (Object.prototype.hasOwnProperty.call(o, p)) {
                k.push(p);
            }
        }
        return k;
    };
}

// index of
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/indexOf
if (!Array.prototype.indexOf) {
    Array.prototype.indexOf = function (searchElement, fromIndex) {
        'use strict';
        var k;

        if (this == null) {
            throw new TypeError('"this" is null or not defined');
        }

        var O = Object(this);

        var len = O.length >>> 0;

        if (len === 0) {
            return -1;
        }

        var n = +fromIndex || 0;

        if (Math.abs(n) === Infinity) {
            n = 0;
        }

        if (n >= len) {
            return -1;
        }
        k = Math.max(n >= 0 ? n : len - Math.abs(n), 0);

        while (k < len) {
            if (k in O && O[k] === searchElement) {
                return k;
            }
            k++;
        }
        return -1;
    };
}

// array remove (element)
Array.prototype.remove = function (value) {
    'use strict';
    var idx = this.indexOf(value);
    if (idx !== -1) {
        return this.splice(idx, 1); // The second parameter is the number of elements to remove.
    }
    return false;
};