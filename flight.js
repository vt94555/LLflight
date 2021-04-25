"use strict";

const createCoordinates = (latitude, longitude) => {
    // set max and min values or latitude and longitude
    const minLat = -90
    const maxLat = 90;
    const minLong = -180;
    const maxLong = 180;

    // create user latitude and longitude
    let userMinLat = latitude - 6;
    let userMaxLat = latitude + 6;
    let userMinLong = longitude - 6;
    let userMaxLong = longitude + 6;

    // if user latitude or longitude are out of bounds, then
    // set to constant min and max values
    if (userMinLat < minLat) { userMinLat = minLat; }
    if (userMaxLat > maxLat) { userMaxLat = maxLat; }
    if (userMinLong < minLong) { userMinLong = minLong; }
    if (userMaxLong > maxLong) { userMaxLong = maxLong; }

    // return latitude and longitude ranges in a list format
    return [userMinLat, userMaxLat, userMinLong, userMaxLong];
    
};

// display table with flight data
const displayTable = (json) => {
    let html = `
        <table>
            <tr>
                <th>Flight Callsign</th>
                <th>Country Origin</th>
                <th>Latitude</th>
                <th>Longitude</th>
                <th>Velocity</th>
            </tr>`;
    
    try {
        for (let i = 0; i < json.states.length; i++) {
            html += `
                <tr>
                    <td>${json.states[i][1]}</td>
                    <td>${json.states[i][2]}</td>
                    <td>${json.states[i][6]}</td>
                    <td>${json.states[i][5]}</td>
                    <td>${json.states[i][9]}</td>
                </tr>`;
        }

        html += `</table>`;
        $("#table").html(html);
        }
    catch {
        let html = `<p>No flights at the selected coordinates</p>`;
        $("#table").html(html);
    }

};


// fetch flight data at the given coordinates
const fetchFlightData = (coordinates) => {

    let url = `https://opensky-network.org/api/states/all?lamin=${coordinates[0]}&lomin=${coordinates[2]}&lamax=${coordinates[1]}&lomax=${coordinates[3]}`;
    fetch(url)
        .then(response => response.json() )
        .then(json => displayTable(json));
};




$(document).ready( ()=> {


    $("#fetch").click( () => {

        // clear error messages
        $("span").text("");

        // obtain latitude and longitude values
        const latitude = parseFloat($("#latitude").val());
        const longitude = parseFloat($("#longitude").val());


        // validate latitude and longitude
        let isValid = true;
    
        if ( isNaN(latitude) || latitude > 90 || latitude < -90) {
            isValid = false;
            $("#latitude").next().text("Latitude must be a number between -90 and +90");
        }
        if ( isNaN(longitude) || longitude > 180 || longitude < -180) {
            isValid = false;
            $("#longitude").next().text("Longitude must be a value between -180 and +180");
        }

        // create pairs of coordinates if latitude and longitude are valid
        let coordinates = [];
        let html = "";
        if (isValid) {
            coordinates = createCoordinates(latitude, longitude);
            html = `
            <h4>Displaying flights in coordinates</h4>
            <p>latitude: ${coordinates[0]} to ${coordinates[1]}</p>
            <p>longitude: ${coordinates[2]} to ${coordinates[3]}</p>`
            $("#display").html(html);
            
            // fetch flight data at the coordinates and display table
            fetchFlightData(coordinates);
            
        }
        

    });
});