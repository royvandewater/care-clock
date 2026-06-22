Feature: Default to current date on reopen

  Scenario: the dates reset to today when the app is reopened
    Given I open the home page
    And I set the start date to "2020-01-15"
    When I reopen the app
    Then the start date should be today
    And the end date should be today
