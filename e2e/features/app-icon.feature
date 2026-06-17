Feature: App icon

  Scenario: iOS has a non-maskable apple-touch-icon
    When I open the home page
    Then the page should declare an apple-touch-icon
    And the apple-touch-icon should load successfully
