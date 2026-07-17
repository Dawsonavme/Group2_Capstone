package com.crashanalytics.api.models;

import java.time.Instant;
import java.util.List;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EndTripRequest {

    @NotNull(message = "End time is required.")
    private Instant endTime;

    @Valid
    @NotNull(message = "End location is required.")
    private GPSPointRequest endLocation;

    @Valid
    private List<GPSPointRequest> gpsPoints;

    private Integer gpsPointCount;
}