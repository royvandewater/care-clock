Feature: Camper import

  Scenario: lists the campers from the query params
    When I open the camper import page for campers "Fred W., Bob F."
    Then I should see "Fred W."
    And I should see "Bob F."

  Scenario: confirming stores the campers and returns home
    When I open the camper import page for campers "Fred W., Bob F."
    And I click the "Confirm" button
    Then I should see the "Care Clock" heading
    When I open the camper selector
    Then I should see "Fred W."
    And I should see "Bob F."

  Scenario: confirming merges with existing campers without duplicating
    Given I open the home page
    And the stored campers are "Bob F., Zoe Q."
    When I open the camper import page for campers "Fred W., Bob F."
    And I click the "Confirm" button
    Then the stored campers should be "Bob F., Fred W., Zoe Q."

  Scenario: cancelling discards the campers and returns home
    When I open the camper import page for campers "Fred W., Bob F."
    And I click the "Cancel" button
    Then I should see the "Care Clock" heading
    And the stored campers should be empty
