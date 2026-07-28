package com.crashanalytics.api;

public class RiskCalculator {
     public int calculateRiskScore(boolean speeding,
                                  boolean harshBraking,
                                  boolean nightDriving) {

        int score = 0;

        if (speeding) score += 40;
        if (harshBraking) score += 30;
        if (nightDriving) score += 20;

        return score;
    }
}
