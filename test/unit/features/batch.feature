Feature: Batch upsert per-item results

  A batch upsert runs each item through a worker in submission order and reports
  a per-item result. One item failing does not abort the rest of the batch;
  the failure is reported against that item and the others still run.

  Background:
    Given a batch of items "a,b,c"

  Scenario: all items succeed
    When I settle the batch with a worker that always succeeds
    Then the results should be "a:success,b:success,c:success"

  Scenario: a failing item does not block later items
    When I settle the batch with a worker that fails item "b"
    Then the results should be "a:success,b:error,c:success"
    And the results should run in order "a,b,c"
    And item "b" should carry the message "boom:b"
