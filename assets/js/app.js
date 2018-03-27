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
    var firstTrainTime = document.getElementById('first-train').value
    console.log(firstTrainTime);

    // capture frequency
    var frequency = document.getElementById('frequency').value
    console.log(frequency);

    // create incomplete msg var
    var incomplete = document.getElementById('incomplete');

    // validate inputs
    if (trainName !== '' && destination !== '' && firstTrainTime !== '' && frequency !== '') {

        // push values to firebase
        database.ref().push({
            trainName: trainName,
            destination: destination,
            firstTrainTime: firstTrainTime,
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
database.ref().on('child_added', function (childSnapshot) {

    // log everything in database
    console.log(childSnapshot.val().trainName);
    console.log(childSnapshot.val().destination);
    console.log(childSnapshot.val().firstTrainTime);
    console.log(childSnapshot.val().frequency);

    // Store everything into a variable.
    var trainNameData = childSnapshot.val().trainName;
    var destinationData = childSnapshot.val().destination;
    var frequencyData = childSnapshot.val().frequency;
    var firstTrainTimeData = childSnapshot.val().firstTrainTime;

    var timeArr = firstTrainTimeData.split(":"); // splits user inputed first time 09:40 to ["09", "20"]
    var trainTime = moment().hours(timeArr[0]).minutes(timeArr[1]); // this make an actual "moment" out of the time
    var maxMoment = moment.max(moment(), trainTime);
    console.log(maxMoment);
    var tMinutes;
    var tArrival;

    // If the first train is later than the current time, sent arrival to the first train time
    // https://momentjs.com/docs/#/get-set/max/
    if (maxMoment === trainTime) {
        tArrival = trainTime.format("hh:mm A");
        tMinutes = trainTime.diff(moment(), "minutes");
    } else {

        // Calculate the minutes until arrival using hardcore math
        // To calculate the minutes till arrival, take the current time in unix subtract the FirstTrain time
        // and find the modulus between the difference and the frequency.
        var differenceTimes = moment().diff(trainTime, "minutes");
        var tRemainder = differenceTimes % frequencyData;
        tMinutes = frequencyData - tRemainder;
        // To calculate the arrival time, add the tMinutes to the current time
        tArrival = moment().add(tMinutes, "m").format("hh:mm A");
    }

    // append new data to table
    var newRow = "<tr><td>" + trainNameData + "</td><td>" + destinationData + "</td><td>" + firstTrainTimeData + "</td><td>" +
        frequencyData + "</td><td>" + tArrival + "</td><td>" + tMinutes + "</td></tr>"
    $('.table').append(newRow)
});