Feature: Edit activity

  Scenario: editing an activity persists the new description
    Given I open the home page
    And the therapist is set to "Miss Amanda"
    And the camper "Alice" has been added and selected
    And I select the "Individual" session type
    And I fill in the description with "Initial description"
    And I set the end time to one hour after the start time
    And I click the "Save" button
    When I open the activity history
    And I open the activity for "Alice"
    Then the "Description" field should have value "Initial description"
    When I fill in the description with "Updated description"
    And I click the "Save" button
    And I open the activity for "Alice"
    Then the "Description" field should have value "Updated description"

  Scenario: deleting an activity removes it from history
    Given the activity delete request will succeed
    And I open the home page
    And the therapist is set to "Miss Amanda"
    And the camper "Alice" has been added and selected
    And I select the "Individual" session type
    And I fill in the description with "To be deleted"
    And I set the end time to one hour after the start time
    And I click the "Save" button
    When I open the activity history
    Then I should see "Alice"
    When I open the activity for "Alice"
    And I click the "Delete" button
    And I click the "Delete" button exactly
    Then I should not see "Alice"
    And I should see "All activities are uploaded."
