Feature: Group session prefill

  Scenario: prefills group name, session type, and campers
    When I open the group session link for group "Triathlon" with campers "Fred W., Bob F."
    Then I should see the "Care Clock" heading
    And the group name should be "Triathlon"
    And I should see "Fred W., Bob F."

  Scenario: campers not in the stored list can still be unselected
    When I open the group session link for group "Triathlon" with campers "Fred W., Bob F."
    Then I should see the "Care Clock" heading
    When I open the camper selector
    Then I should see "Fred W."
    And I should see "Bob F."
    When I toggle the camper "Bob F."
    And I click the "Back" button
    Then I should see "Fred W."
    And I should not see "Bob F."

  Scenario: temporary campers are not added to the stored camper list
    When I open the group session link for group "Triathlon" with campers "Fred W., Bob F."
    Then I should see the "Care Clock" heading
    And the stored campers should be empty
