package com.crashanalytics.api.models;

import java.time.Instant;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ApiErrorResponse {

    private Instant timestamp;

    private int status;

    private String error;

    private String message;
}
