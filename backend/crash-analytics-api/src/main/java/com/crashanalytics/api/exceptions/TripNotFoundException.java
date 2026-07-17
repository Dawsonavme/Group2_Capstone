package com.crashanalytics.api.exceptions;

public class TripNotFoundException extends RuntimeException {

    public TripNotFoundException(Long tripId) {
        super("Trip with ID " + tripId + " was not found.");
    }
}