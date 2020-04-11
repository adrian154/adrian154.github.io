const getAPIStatus = function(callback) {

    let request = new XMLHttpRequest();

    request.addEventListener("readystatechange", function(event) {
        if(request.readyState == XMLHttpRequest.DONE) {
            let status = xhr.status;

            /* Return success */
            if(status == 0 || (status >= 200 && status < 400)) {
                callback({
                    success: true,
                    value: request.responseText
                });
            } else {
                callback({
                    success: false,
                    status: status
                });
            }

        }
    });

    request.open("GET", "https://status.mojang.com/check");
    request.send();

};

const getNameHistory = function(uuid, callback) {

    let request = new XMLHttpRequest();

    request.addEventListener("readystatechange", function(event) {
        if(request.readyState == XMLHttpRequest.DONE) {
            let status = xhr.status;

            if(status == 0 || (status >= 200 && status < 400)) {
                callback({
                    success: true,
                    value: request.responseText
                });
            } else {
                callback({
                    success: false,
                    status: status
                });
            }
        }
    });

    request.open("GET", "https://api.mojang.com/user/profiles/" + uuid + "/names");
    request.send();

};

const getUUIDAndInfo = function(names, callback) {

    let request = new XMLHttpRequest();

    request.addEventListener("readystatechange", function(event) {

    });

    request.open("POST", "https://api.mojang.com/profiles/minecraft");
    request.setRequestHeader("Content-Type", "application/json");
    request.send(JSON.stringify(names));

};

getUUIDAndInfo(["yum_cookies"], function(data) {
    if(data.success) console.log(data);
});