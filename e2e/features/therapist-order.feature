Feature: Therapist ordering

  Scenario: therapists are listed by name, ignoring their honorific
    Given I open the home page
    When I open the settings
    Then the therapist options should be in the order:
      | Miss Amanda    |
      | Miss Ashlea    |
      | Miss Carolyn   |
      | Miss Danielle  |
      | Ms. Denise     |
      | Miss Kaitie    |
      | Miss Katie     |
      | Miss Kourtney  |
      | Mr. Marty      |
      | Mr. Rob        |
      | Mrs. Stephanie |
      | Miss Valerie   |
