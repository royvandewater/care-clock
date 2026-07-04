Feature: Batch activity validation

  Scenario: rejects a batch containing an item with a description longer than 25000 characters
    When I POST a batch with one activity whose description is 25001 characters
    Then the response status should be in the 4xx range
