package com.crashanalytics.api.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import com.crashanalytics.api.beans.Trip;
import com.crashanalytics.api.models.EndTripRequest;
import com.crashanalytics.api.models.StartTripRequest;
import com.crashanalytics.api.services.TripService;
import java.util.List;
import com.crashanalytics.api.beans.GPSPoint;
import lombok.AllArgsConstructor;

@RestController
@RequestMapping("/api/trips")
@AllArgsConstructor
public class TripController {

    private final TripService tripService;
    
    @PostMapping("/start")
    public ResponseEntity<Trip> startTrip(
            @Valid @RequestBody StartTripRequest request) {

        Trip trip = tripService.startTrip(request);

        return ResponseEntity.ok(trip);
    }
    
    @PutMapping("/{tripId}/end")
    public ResponseEntity<Trip> endTrip(
            @PathVariable Long tripId,
            @Valid @RequestBody EndTripRequest request) {

        Trip trip = tripService.endTrip(tripId, request);

        return ResponseEntity.ok(trip);
    }
    
    @GetMapping("/{tripId}")
    public ResponseEntity<Trip> getTripById(
            @PathVariable Long tripId) {

        Trip trip = tripService.getTripById(tripId);

        return ResponseEntity.ok(trip);
    }
    
    @GetMapping("/{tripId}/gps-points")
    public ResponseEntity<List<GPSPoint>> getGPSPointsByTripId(
            @PathVariable Long tripId) {

        List<GPSPoint> gpsPoints =
                tripService.getGPSPointsByTripId(tripId);

        return ResponseEntity.ok(gpsPoints);
    }
    
    @GetMapping
    public ResponseEntity<List<Trip>> getAllTrips() {

        List<Trip> trips = tripService.getAllTrips();

        return ResponseEntity.ok(trips);
    }

}