glDashboard.factory('Save', function() {

    var s2ab = function(s) {
        var buf = new ArrayBuffer(s.length);
        var view = new Uint8Array(buf);
        for (var i = 0; i != s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
        return buf;
    };

    return function(fileName, extension, data, type) {

        saveAs(new Blob([s2ab(data)], {
            type: (type) ? type : "application/octet-stream"
        }), fileName + extension);

    };
});
