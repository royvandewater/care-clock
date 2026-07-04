Feature: Batch sync unsynced activities

  Uploading all unsynced activities sends them in a single batch request
  instead of one request per activity, and marks each synced per the
  batch's per-item result.

  Scenario: Saving a group activity syncs all campers in one batch request
    Given the batch sync request will succeed
    And I open the home page
    And the therapist is set to "Miss Amanda"
    When I open the group session link for group "Test Group" with campers "Alice,Bob,Cara"
    And I fill in the description with "Group note"
    And I set the end time to one hour after the start time
    And I click the "Save" button
    Then exactly one batch sync request should have been made
    And the batch sync request should have contained 3 activities

  Scenario: Upload All sends one batch request for multiple activities
    Given the batch sync request will fail
    And I open the home page
    And the therapist is set to "Miss Amanda"
    And the camper "Alice" has been added and selected
    And the camper "Bob" has been added and selected
    And I select the "Individual" session type
    And I fill in the description with "Group note"
    And I set the end time to one hour after the start time
    And I click the "Save" button
    When I open the activity history
    Then I should see "Alice"
    And I should see "Bob"
    Given the batch sync request will succeed
    When I click the "Upload All Unsynced Activities" button
    Then I should see "All activities are uploaded."
    And exactly one batch sync request should have been made
    And the batch sync request should have contained 2 activities
