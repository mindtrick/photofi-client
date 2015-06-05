/**
 * Created by 758orenh on 3/22/2015.
 */
var apiUrl = 'http://prod-photofi.rhcloud.com';
var privateKey = "Photofi.,-K3y-4_different=httprequests";

angular.module('photofi.event.service', [])
    .factory('EventsService', function ($http) {


        var GetEvents = function () {
            var events = JSON.parse(localStorage.getItem('events'));
            if (!events) {
                events = {};
            }
            return events;
        };


        var GetEventById = function (id, callback) {
            var url = '/event/' + id;
            var hash = CryptoJS.HmacSHA1(url, privateKey);
            url = apiUrl + url + "?hash="+hash.toString(CryptoJS.enc.Hex);
            $http.get(url).success(function (response) {
                if (response["type"]) {
                    var data = response["data"];
                    var event = {
                        description: data["description"],
                        eventId: data["eventId"],
                        title: data["title"]
                    };

                    var events = GetEvents();
                    events[data["eventId"]] = event;
                    localStorage.setItem('events', JSON.stringify(events));
                    callback();

                } else {
                    alert("קוד אירוע לא נכון");
                }
            }).error(function (err) {
                alert("קוד אירוע לא נכון");
            });

        };


        var GetImagesLinks = function (eventId, success_callback) {
            var url = '/event/' + eventId;
            var hash = CryptoJS.HmacSHA1(url, privateKey);
            url = apiUrl + url + "?hash="+hash.toString(CryptoJS.enc.Hex);
            $http.get(url).then(function (response) {

                var event = response.data["data"];
                success_callback(event.Images);

            });
        };

        var DeleteEvent = function (eventIndex) {
            var events = GetEvents();
            events.splice(eventIndex, 1);
            localStorage.setItem('events', JSON.stringify(events));
        };


        // Return a reference to the function
        return {
            events: (GetEvents),
            addEvent: (GetEventById),
            getImagesLinks: (GetImagesLinks),
            removeEvent: (DeleteEvent)
        };

    })

    .factory('saveFileFrom', [function () {

        function guid() {
            function s4() {
                return Math.floor((1 + Math.random()) * 0x10000)
                    .toString(16)
                    .substring(1);
            }

            return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
                s4() + '-' + s4() + s4() + s4();
        }

        return function (url, $cordovaFileTransfer) {

            console.log(cordova.file);
            var targetPath = "Pictures/Photofi/" + guid() + ".png";
            if (cordova.file.externalRootDirectory) {
                targetPath = cordova.file.externalRootDirectory + targetPath;
            }
            else {
                targetPath = cordova.file.applicationDirectory + targetPath;
            }
            console.log(targetPath);
            var trustHosts = true;
            var options = {};

            $cordovaFileTransfer.download(url, targetPath, options, trustHosts)
                .then(function (result) {
                    console.log("download complete: " + result);
                    //TODO: change to toast
                    alert("הקובץ ירד בהצלחה!");
                }, function (err) {
                    alert("error code" + err);
                }, function (progress) {
                    console.log(progress);
                });
        };
    }])

;