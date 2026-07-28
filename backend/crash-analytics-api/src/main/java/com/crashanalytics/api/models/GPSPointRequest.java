package com.crashanalytics.api.models;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class GPSPointRequest {

	 @NotNull(message = "Latitude is required.")
	    @DecimalMin(
	            value = "-90.0",
	            message = "Latitude must be at least -90."
	    )
	    @DecimalMax(
	            value = "90.0",
	            message = "Latitude must not be greater than 90."
	    )
	    private Double latitude;

	    @NotNull(message = "Longitude is required.")
	    @DecimalMin(
	            value = "-180.0",
	            message = "Longitude must be at least -180."
	    )
	    @DecimalMax(
	            value = "180.0",
	            message = "Longitude must not be greater than 180."
	    )
	    private Double longitude;

	    private Long timestamp;

	    @PositiveOrZero(message = "Accuracy cannot be negative.")
	    private Double accuracy;

	    @PositiveOrZero(message = "Speed cannot be negative.")
	    private Double speed;

	    private Boolean lowAccuracy;
}