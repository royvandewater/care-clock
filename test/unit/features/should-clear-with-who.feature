Feature: Clearing "With Who" on session-type change

  Tri-Treat stores two therapists as one comma-separated string. Co-Treat's
  single dropdown can't represent that, so switching Tri-Treat -> Co-Treat
  must clear the "With Who" value.

  Scenario: clears when switching from Tri-Treat to Co-Treat
    When I change the session type from "Tri-Treat" to "Co-Treat"
    Then "With Who" should be cleared

  Scenario: does not clear when switching from Co-Treat to Tri-Treat
    When I change the session type from "Co-Treat" to "Tri-Treat"
    Then "With Who" should not be cleared
