// Initialize Firebase
var config = {
    apiKey: "AIzaSyAue9StYm0S8QVrm9x9fipxtusz-jKzDRw",
    authDomain: "train-b37cc.firebaseapp.com",
    databaseURL: "https://train-b37cc.firebaseio.com",
    projectId: "train-b37cc",
    storageBucket: "",
    messagingSenderId: "84491800601"
};
firebase.initializeApp(config);

// set database variable
var database = firebase.database();

// on form submit
document.getElementById('submit').addEventListener('click', function (event) {
    // prevent refresh
    event.preventDefault();

    // capture train name
    var trainName = document.getElementById('train-name').value
    console.log(trainName);

    // capture destination
    var destination = document.getElementById('destination').value
    console.log(destination);

    // capture first train time
    var firstTrain = document.getElementById('first-train').value
    console.log(firstTrain);

    // capture frequency
    var frequency = document.getElementById('frequency').value
    console.log(frequency);

    // create incomplete msg var
    var incomplete = document.getElementById('incomplete');

    // validate inputs
    if (trainName !== '' && destination !== '' && firstTrain !== '' && frequency !== '') {

        // push values to firebase
        database.ref().push({
            trainName: trainName,
            destination: destination,
            firstTrain: firstTrain,
            frequency: frequency
        });

        // clear form fields
        var form = document.getElementById('add-train');
        form.reset();

        // remove incomplete msg
        incomplete.innerHTML = '<p></p>';
    }
    else {
        // add incomplete msg
        incomplete.innerHTML = '<h4 style="color: red;">*Must Complete Form!</h4>';
    }

});

// pull data from firebase on pg load and new train added
database.ref().on('child_added', function (snapshot) {

    // log everything in database
    console.log(snapshot.val().trainName);
    console.log(snapshot.val().destination);
    console.log(snapshot.val().firstTrain);
    console.log(snapshot.val().frequency);

    // create variables of snapshot
    var newTrainName = snapshot.val().trainName;
    var newDestination = snapshot.val().destination;
    var newFirstTrain = snapshot.val().firstTrain;
    var newFrequency = snapshot.val().frequency;

    var firstTimeConverted = moment(newFirstTrain, "HH:mm");
    console.log('ft: ' + firstTimeConverted);

    var currentTime = moment().format("HH:mm");
    console.log("CURRENT TIME: " + currentTime);

    // store difference between currentTime and first train converted
    var timeDiff = moment().diff(moment(firstTimeConverted), "minutes");
    console.log('diff: ' + timeDiff);

    // find Remainder of the time left and store in a variable
    var timeRemainder = timeDiff % newFrequency;
    console.log(timeRemainder);

    // to calculate minutes till train,we store it in a variable
    var minToTrain = newFrequency - timeRemainder;

    // next train
    var nxTrain = moment().add(minToTrain, "minutes").format("HH:mm");

    // append new to data to table
    $('.table').append('<tr><td>' + newTrainName + '</td><td>' + newDestination + '</td><td>' + newFrequency + '</td><td>' + nxTrain + '</td><td>' + minToTrain + '</td>');

});

// use snapshot to populate schedule table
// checkout 'for in loop' to iterate through data
// use 'for in loop' inside snapshot 
// use moment.js .diff method to do calculation