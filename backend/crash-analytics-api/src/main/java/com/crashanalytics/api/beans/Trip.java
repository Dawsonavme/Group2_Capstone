package com.crashanalytics.api.beans;

import java.time.Instant;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "trips")
public class Trip {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Instant startTime;

    private Instant endTime;

    private Double startLatitude;

    private Double startLongitude;

    private Double endLatitude;

    private Double endLongitude;

    private Integer gpsPointCount;
    
    private Double distanceKm;
    
    private Double averageSpeedKmh;

    private Double maximumSpeedKmh;

    private Integer thresholdExceededCount;

    private String postTripMessage;

    private String status;
    
    
}