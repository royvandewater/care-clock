Feature: Home page

  Scenario: the page loads
    When I open the home page
    Then the page title should contain "Care Clock"

  Scenario: hides the duration warning until a date/time field is interacted with
    When I open the home page
    Then I should not see "Activity duration is less than 1 minute"
    When I enter the start time as the end time
    Then I should see "Activity duration is less than 1 minute"

  Scenario: hides the duration warning again after saving
    Given I open the home page
    And the therapist is set to "Miss Amanda"
    And the camper "Alice" has been added and selected
    When I enter the start time as the end time
    Then I should see "Activity duration is less than 1 minute"
    When I save the activity anyway
    Then I should not see "Activity duration is less than 1 minute"

  Scenario: Filling out the form for a group session
    Given I open the home page
    And the therapist is set to "Miss Amanda"
    And the camper "Alice" has been added and selected
    When I select the "Group" session type
    And I fill in the group with "Automated Tests"
    And I fill in the description with "Running automated tests"

  Scenario: Filling out the form for a co-treat session
    Given I open the home page
    And the therapist is set to "Miss Amanda"
    And the camper "Alice" has been added and selected
    When I select the "Co-Treat" session type
    And I fill in "With Who" with "Miss Valerie"
    And I fill in the description with "Running automated tests"

  Scenario: Filling out the form for an individual session
    Given I open the home page
    And the therapist is set to "Miss Amanda"
    And the camper "Alice" has been added and selected
    When I select the "Individual" session type
    And I fill in the description with "Running automated tests"
    Then the "Group" field should not be present
    And the "With Who" field should not be present
