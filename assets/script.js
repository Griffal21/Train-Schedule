$(document).ready(function () {

  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyAhemNVkjOmOdp-K_LC3KB_jf6O6S8_Vgw",
    authDomain: "bootcamp-a78c4.firebaseapp.com",
    databaseURL: "https://bootcamp-a78c4.firebaseio.com",
    projectId: "bootcamp-a78c4",
    storageBucket: "bootcamp-a78c4.appspot.com",
    messagingSenderId: "205582184383"
  };
  firebase.initializeApp(config);
  // console.log("hi")

  // save firebase database reference
  var database = firebase.database();


  // add event listener for form submit
  $("#submit").on("click", function (event) {
    event.preventDefault();
    console.log("submit");

    var trainData = {
      name: $("#trainName").val().trim(),
      destination: $("#destination").val().trim(),
      startTime: $("#time").val(),
      rate: parseInt($("#rate").val())
    };

    // add train to firebase using .push() method instead of .set()
    database.ref().push(trainData);

    // clear out any value in form input tags on page
    $("#trainName").val("");
    $("#destination").val("");
    $("#time").val("");
    $("#rate").val("");

  });

  var nextTrain = null;
  var tMinutesTillTrain = null;

  // set up child_added event listener for firebase to send new information every time a train is added and when the page loads
  database.ref().on("child_added", function (childSnapshot) {
    console.log(childSnapshot.val());
    var name = childSnapshot.val().name;
    var destination = childSnapshot.val().destination;
    var rate = childSnapshot.val().rate;
    var startTime = childSnapshot.val().startTime;

    // if you need the key of the child
    console.log(childSnapshot.key);


    //finds when next train is due
    //trainTime(startTime, rate);

    function trainTime(startTime, rate) {

      // First Time (pushed back 1 year to make sure it comes before current time)
      var firstTimeConverted = moment(startTime, "HH:mm").subtract(1, "years");
      console.log(firstTimeConverted);
  
      // Current Time
      var currentTime = moment();
      console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));
  
      // Difference between the times
      var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
      console.log("DIFFERENCE IN TIME: " + diffTime);
  
      // Time apart (remainder)
      var tRemainder = diffTime % rate;
      console.log(tRemainder);
  
      // Minute Until Train
      tMinutesTillTrain = rate - tRemainder;
      console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);
  
      // Next Train
      nextTrain = moment().add(tMinutesTillTrain, "minutes");
      console.log("ARRIVAL TIME: " + moment(nextTrain).format("hh:mm"));
  
      // return nextTrain;
      // return tMinutesTillTrain;
  
    };

    trainTime(startTime, rate);

    // create a table row for new train
    // Create the new row
    var newRow = $("<tr>").append(
      $("<td>").text(name),
      $("<td>").text(destination),
      $("<td>").text(rate),
      $("<td>").text(nextTrain.format("hh:mm A")),
      $("<td>").text(tMinutesTillTrain)
    );
    

    // Append the new row to the table
    $("#trainTable > tbody").append(newRow);
  });

 
});