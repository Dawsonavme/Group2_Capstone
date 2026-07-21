package com.crashanalytics.api.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.crashanalytics.api.beans.Trip;

public interface TripRepository extends JpaRepository<Trip, Long> {

    List<Trip> findAllByOrderByStartTimeDesc();
}