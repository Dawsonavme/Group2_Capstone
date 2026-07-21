package com.crashanalytics.api.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.crashanalytics.api.beans.GPSPoint;

public interface GPSPointRepository extends JpaRepository<GPSPoint, Long> {

    List<GPSPoint> findByTripId(Long tripId);
}
