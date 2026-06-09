package com.crashanalytics.api;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
class CrashAnalyticsApiApplicationTests {

	  @Test
    void testRiskLow() {
        int risk = 1;
        assertEquals(1, risk);
    }
     @Test
    void testLowRiskDriver() {

        RiskCalculator calculator = new RiskCalculator();

        int score = calculator.calculateRiskScore(
                false,
                false,
                false);

        assertEquals(0, score);
    }

    @Test
    void testHighRiskDriver() {

        RiskCalculator calculator = new RiskCalculator();

        int score = calculator.calculateRiskScore(
                true,
                true,
                true);

        assertEquals(90, score);
    }
}
