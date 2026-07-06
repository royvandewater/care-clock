Feature: Force sync all activities

  Re-syncing every activity - including ones already marked synced - overwrites
  the spreadsheet and recreates rows that were deleted from it, so it is guarded
  by a confirmation modal that only proceeds on confirm.

  Scenario: Force Sync All re-syncs already-synced activities after confirmation
    Given the batch sync request will succeed
    And I open the home page
    And the therapist is set to "Miss Amanda"
    And the camper "Alice" has been added and selected
    And I select the "Individual" session type
    And I fill in the description with "A note"
    And I set the end time to one hour after the start time
    And I click the "Save" button
    Then exactly one batch sync request should have been made
    When I open the activity history
    And I click the "Force Sync All Activities" button
    Then I should see the "Force Sync All Activities" heading
    Given the batch sync request will succeed
    When I click the "Force Sync All" button exactly
    Then exactly one batch sync request should have been made
    And the batch sync request should have contained 1 activities

  Scenario: Cancelling the Force Sync All confirmation makes no request
    Given the batch sync request will succeed
    And I open the home page
    And the therapist is set to "Miss Amanda"
    And the camper "Alice" has been added and selected
    And I select the "Individual" session type
    And I fill in the description with "A note"
    And I set the end time to one hour after the start time
    And I click the "Save" button
    Then exactly one batch sync request should have been made
    When I open the activity history
    And I click the "Force Sync All Activities" button
    Then I should see the "Force Sync All Activities" heading
    Given the batch sync request will succeed
    When I click the "Cancel" button
    Then no batch sync request should have been made
