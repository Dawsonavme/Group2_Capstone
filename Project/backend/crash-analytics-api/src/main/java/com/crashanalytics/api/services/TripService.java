package com.crashanalytics.api.services;

import java.time.Duration;
import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.crashanalytics.api.beans.GPSPoint;
import com.crashanalytics.api.beans.Trip;
import com.crashanalytics.api.models.EndTripRequest;
import com.crashanalytics.api.models.GPSPointRequest;
import com.crashanalytics.api.models.StartTripRequest;
import com.crashanalytics.api.repositories.GPSPointRepository;
import com.crashanalytics.api.repositories.TripRepository;
import com.crashanalytics.api.exceptions.TripNotFoundException;
import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class TripService {

    private final TripRepository tripRepository;
    private final GPSPointRepository gpsPointRepository;
    
    private static final double PROTOTYPE_THRESHOLD_KMH = 50.0;

    public Trip startTrip(StartTripRequest request) {

        Trip trip = new Trip();

        trip.setStartTime(request.getStartTime());
        trip.setStartLatitude(request.getStartLocation().getLatitude());
        trip.setStartLongitude(request.getStartLocation().getLongitude());
        trip.setGpsPointCount(0);
        trip.setStatus("active");

        return tripRepository.save(trip);
    }

    @Transactional
    public Trip endTrip(Long tripId, EndTripRequest request) {

        Trip trip = tripRepository.findById(tripId)
                .orElseThrow(() -> new TripNotFoundException(tripId));

        trip.setEndTime(request.getEndTime());
        trip.setEndLatitude(request.getEndLocation().getLatitude());
        trip.setEndLongitude(request.getEndLocation().getLongitude());
        trip.setStatus("completed");

        List<GPSPoint> gpsPoints = new ArrayList<>();

        if (request.getGpsPoints() != null) {

            for (GPSPointRequest pointRequest : request.getGpsPoints()) {

                GPSPoint gpsPoint = new GPSPoint();

                gpsPoint.setLatitude(pointRequest.getLatitude());
                gpsPoint.setLongitude(pointRequest.getLongitude());
                gpsPoint.setTimestamp(pointRequest.getTimestamp());
                gpsPoint.setAccuracy(pointRequest.getAccuracy());
                gpsPoint.setSpeed(pointRequest.getSpeed());
                gpsPoint.setLowAccuracy(pointRequest.getLowAccuracy());
                gpsPoint.setTrip(trip);

                gpsPoints.add(gpsPoint);
            }
        }

        trip.setGpsPointCount(gpsPoints.size());

        double distanceKm =
                calculateTotalDistanceKm(gpsPoints);

        double roundedDistanceKm =
                Math.round(distanceKm * 100.0) / 100.0;

        trip.setDistanceKm(roundedDistanceKm);

        double averageSpeedKmh =
                calculateAverageSpeedKmh(gpsPoints);

        double maximumSpeedKmh =
                calculateMaximumSpeedKmh(gpsPoints);

        int thresholdExceededCount =
                calculateThresholdExceededCount(gpsPoints);

        String postTripMessage =
                generatePostTripMessage(
                        gpsPoints,
                        thresholdExceededCount
                );

        trip.setAverageSpeedKmh(averageSpeedKmh);
        trip.setMaximumSpeedKmh(maximumSpeedKmh);
        trip.setThresholdExceededCount(
                thresholdExceededCount
        );
        trip.setPostTripMessage(postTripMessage);

        Trip savedTrip = tripRepository.save(trip);

        if (!gpsPoints.isEmpty()) {
            gpsPointRepository.saveAll(gpsPoints);
        }

        return savedTrip;
    }

    public Trip getTripById(Long tripId) {

        return tripRepository.findById(tripId)
        		.orElseThrow(() -> new TripNotFoundException(tripId));
    }

    public Long calculateDurationSeconds(Trip trip) {

        if (trip.getStartTime() == null || trip.getEndTime() == null) {
            return null;
        }

        return Duration.between(
                trip.getStartTime(),
                trip.getEndTime()
        ).getSeconds();
    }
    
    public List<GPSPoint> getGPSPointsByTripId(Long tripId) {
        tripRepository.findById(tripId)
        	.orElseThrow(() -> new TripNotFoundException(tripId));

        return gpsPointRepository.findByTripId(tripId);
    }
    
    public List<Trip> getAllTrips() {

        return tripRepository.findAllByOrderByStartTimeDesc();
    }
    
    private double calculateDistanceKm(
            double latitude1,
            double longitude1,
            double latitude2,
            double longitude2) {

        final double earthRadiusKm = 6371.0;

        double latitudeDifference =
                Math.toRadians(latitude2 - latitude1);

        double longitudeDifference =
                Math.toRadians(longitude2 - longitude1);

        double a =
                Math.sin(latitudeDifference / 2)
                * Math.sin(latitudeDifference / 2)
                + Math.cos(Math.toRadians(latitude1))
                * Math.cos(Math.toRadians(latitude2))
                * Math.sin(longitudeDifference / 2)
                * Math.sin(longitudeDifference / 2);

        double c = 2 * Math.atan2(
                Math.sqrt(a),
                Math.sqrt(1 - a)
        );

        return earthRadiusKm * c;
    }
    
    private double calculateTotalDistanceKm(
            List<GPSPoint> gpsPoints) {

        if (gpsPoints == null || gpsPoints.size() < 2) {
            return 0.0;
        }

        double totalDistanceKm = 0.0;

        for (int i = 1; i < gpsPoints.size(); i++) {

            GPSPoint previousPoint = gpsPoints.get(i - 1);
            GPSPoint currentPoint = gpsPoints.get(i);

            totalDistanceKm += calculateDistanceKm(
                    previousPoint.getLatitude(),
                    previousPoint.getLongitude(),
                    currentPoint.getLatitude(),
                    currentPoint.getLongitude()
            );
        }

        return totalDistanceKm;
    }
    
    private double calculateAverageSpeedKmh(
            List<GPSPoint> gpsPoints) {

        if (gpsPoints == null || gpsPoints.isEmpty()) {
            return 0.0;
        }

        double totalSpeedKmh = 0.0;
        int validSpeedCount = 0;

        for (GPSPoint gpsPoint : gpsPoints) {

            Double speedMps = gpsPoint.getSpeed();

            if (speedMps != null && speedMps >= 0) {

                double speedKmh = speedMps * 3.6;

                totalSpeedKmh += speedKmh;
                validSpeedCount++;
            }
        }

        if (validSpeedCount == 0) {
            return 0.0;
        }

        double averageSpeedKmh =
                totalSpeedKmh / validSpeedCount;

        return Math.round(averageSpeedKmh * 10.0) / 10.0;
    }
    
    private double calculateMaximumSpeedKmh(
            List<GPSPoint> gpsPoints) {

        if (gpsPoints == null || gpsPoints.isEmpty()) {
            return 0.0;
        }

        double maximumSpeedKmh = 0.0;

        for (GPSPoint gpsPoint : gpsPoints) {

            Double speedMps = gpsPoint.getSpeed();

            if (speedMps != null && speedMps >= 0) {

                double speedKmh = speedMps * 3.6;

                if (speedKmh > maximumSpeedKmh) {
                    maximumSpeedKmh = speedKmh;
                }
            }
        }

        return Math.round(maximumSpeedKmh * 10.0) / 10.0;
    }
    
    private int calculateThresholdExceededCount(
            List<GPSPoint> gpsPoints) {

        if (gpsPoints == null || gpsPoints.isEmpty()) {
            return 0;
        }

        int exceededCount = 0;

        for (GPSPoint gpsPoint : gpsPoints) {

            Double speedMps = gpsPoint.getSpeed();

            if (speedMps != null && speedMps >= 0) {

                double speedKmh = speedMps * 3.6;

                if (speedKmh > PROTOTYPE_THRESHOLD_KMH) {
                    exceededCount++;
                }
            }
        }

        return exceededCount;
    }
    
    private String generatePostTripMessage(
            List<GPSPoint> gpsPoints,
            int thresholdExceededCount) {

        boolean hasValidSpeed = false;

        if (gpsPoints != null) {

            for (GPSPoint gpsPoint : gpsPoints) {

                if (gpsPoint.getSpeed() != null
                        && gpsPoint.getSpeed() >= 0) {

                    hasValidSpeed = true;
                    break;
                }
            }
        }

        if (!hasValidSpeed) {
            return "Your trip was recorded, but speed data was unavailable for this trip.";
        }

        if (thresholdExceededCount > 0) {
            return "Your recorded speed exceeded the prototype threshold "
                    + thresholdExceededCount
                    + " time(s).";
        }

        return "Your trip was recorded successfully. "
                + "No prototype speed threshold exceedances were detected.";
    }
}