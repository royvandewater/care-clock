Feature: Activity write serialization

  The ActivityQueueDO funnels concurrent Google Sheet reads/writes through a
  single promise chain (a Serializer) so overlapping upserts/deletes cannot
  interleave their read-modify-write and clobber each other.

  Background:
    Given a serializer

  Scenario: overlapping tasks run one at a time in submission order
    When I enqueue overlapping tasks "a,b,c"
    Then the event log should be "start:a,end:a,start:b,end:b,start:c,end:c"

  Scenario: a failing task does not block later tasks
    When I enqueue a failing task "a" then a task "b"
    Then task "b" should have run
    And task "a" should have rejected
