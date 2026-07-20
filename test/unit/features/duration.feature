Feature: Rounded whole-minute durations

  Alongside the fractional-day Duration column, the sheet also gets a Minutes
  column holding the duration rounded to the nearest whole minute.

  Scenario Outline: rounding a millisecond duration to whole minutes
    Given a duration of <ms> milliseconds
    When I convert it to rounded minutes
    Then the result should be <minutes>

    Examples:
      | ms     | minutes |
      | 0      | 0       |
      | 60000  | 1       |
      | 90000  | 2       |
      | 89999  | 1       |
      | 630000 | 11      |
