Feature: Tri-Treat "With Who" therapist combining

  A Tri-Treat session has two therapist dropdowns. Their selections are
  stored in the single comma-separated "With Who" field so downstream code
  keeps treating it as one string, exactly like Co-Treat.

  Scenario: combines two selected therapists into one comma-separated string
    When I combine the therapists "Miss Amanda" and "Miss Valerie"
    Then the combined value should be "Miss Amanda, Miss Valerie"

  Scenario: omits an unselected second therapist
    When I combine the therapists "Miss Amanda" and ""
    Then the combined value should be "Miss Amanda"

  Scenario: splits a comma-separated value back into two therapists
    When I split the "With Who" value "Miss Amanda, Miss Valerie"
    Then the first therapist should be "Miss Amanda"
    And the second therapist should be "Miss Valerie"

  Scenario: splits a single therapist into a first with an empty second
    When I split the "With Who" value "Miss Amanda"
    Then the first therapist should be "Miss Amanda"
    And the second therapist should be ""
