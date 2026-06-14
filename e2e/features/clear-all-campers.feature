Feature: Clear all campers

  Scenario: the Clear All Campers button is hidden until edit mode
    Given I open the home page
    And I open the camper selector
    Then I should not see the "Clear All Campers" button

  Scenario: the empty-state hint is hidden in edit mode
    Given I open the home page
    And I open the camper selector
    Then I should see "Use the edit button on the top right to add a camper"
    When I enter camper edit mode
    Then I should not see "Use the edit button on the top right to add a camper"

  Scenario: the Clear All Campers button is disabled when there are no campers
    Given I open the home page
    And I open the camper selector
    And I enter camper edit mode
    Then the "Clear All Campers" button should be disabled

  Scenario: the Clear All Campers button is enabled when there are campers
    Given I open the home page
    And I open the camper selector
    And I enter camper edit mode
    And I add the camper "Alice"
    Then the "Clear All Campers" button should be enabled

  Scenario: clicking Clear All Campers asks for confirmation before clearing
    Given I open the home page
    And I open the camper selector
    And I enter camper edit mode
    And I add the camper "Alice"
    And I add the camper "Bob"
    When I click the "Clear All Campers" button
    Then I should see the "Clear All Campers" heading
    When I click the "Cancel" button
    Then I should see "Alice"
    When I click the "Clear All Campers" button
    And I click the "Clear" button exactly
    Then the "Clear All Campers" button should be disabled
    And the stored campers should be empty
