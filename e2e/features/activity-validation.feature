Feature: Activity validation

  Scenario: rejects a description longer than 25000 characters
    When I PUT an activity with a description of 25001 characters
    Then the response status should be in the 4xx range
