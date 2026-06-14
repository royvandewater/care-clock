Feature: Save activity toast

  Scenario: saving an activity shows a confirmation toast
    Given I open the home page
    And the therapist is set to "Tori"
    And the camper "Alice" has been added and selected
    And I select the "Individual" session type
    And I fill in the description with "A saved activity"
    And I set the end time to one hour after the start time
    When I click the "Save" button
    Then the status message should be "Activity saved"
