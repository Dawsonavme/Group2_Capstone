package com.crashanalytics.api.models;

import java.time.Instant;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class StartTripRequest {

    @NotNull(message = "Start time is required.")
    private Instant startTime;

    @Valid
    @NotNull(message = "Start location is required.")
    private GPSPointRequest startLocation;
}