(function() {
  // Generate a random Firebase location
  var firebaseUrl = "https://" + generateRandomString(10) + ".firebaseio-demo.com/";
  var firebaseRef = new Firebase(firebaseUrl);
  var geoFire = new GeoFire(firebaseRef);

  // Feel free to watch items being added in Firebase
  $("#firebaseUrl").html("Observe Firebase in realtime at <a href='" + firebaseUrl + "'>" + firebaseUrl + "</a>");

  $("#addfish").on("submit", function() {

    var lat = parseFloat($("#addlat").val());
    var lon = parseFloat($("#addlon").val());
    var myID = "fish-" + generateRandomString(10);

    geoFire.set(myID, [lat, lon]).then(function() {
      log(myID + ": setting position to [" + lat + "," + lon + "]");
    });

    return false;
  });  

  var geoQuery;
  $("#queryfish").on("submit", function() {

    // We want to have only one query in place
    // When creating new one - cancelling the old one
    if (geoQuery != null) {
      geoQuery.cancel();
      log("cancelling old query");
    }

    var lat = parseFloat($("#querylat").val());
    var lon = parseFloat($("#querylon").val());
    var radius = parseFloat($("#queryradius").val());

    geoQuery = geoFire.query({
      center: [lat, lon],
      radius: radius
    });

    log("creating a query [" + lat + "," + lon + "] with " + radius + "km radius")

    geoQuery.on("key_entered", function(key, location, distance) {
      log(key + " is located " + location + " is within the query (" + distance + " km from center)");
    });

    return false;
  });

  /*************/
  /*  HELPERS  */
  /*************/
  /* Returns a random string of the inputted length */
  function generateRandomString(length) {
      var text = "";
      var validChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

      for(var i = 0; i < length; i++) {
          text += validChars.charAt(Math.floor(Math.random() * validChars.length));
      }

      return text;
  }

  /* Logs to the page instead of the console */
  function log(message) {
    var childDiv = document.createElement("div");
    var textNode = document.createTextNode(message);
    childDiv.appendChild(textNode);
    document.getElementById("log").appendChild(childDiv);
  }
})();