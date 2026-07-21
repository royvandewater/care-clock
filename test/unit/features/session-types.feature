Feature: Session types

  Care-clock supports a fixed set of session types. "Tri-treat" behaves like
  "Consult": it has a free-form "With Who" text field, so switching to it must
  not clear the withWho value.

  Scenario: Tri-treat is a valid session type
    When I parse the session type "Tri-treat"
    Then the parsed session type should be "Tri-treat"

  Scenario: switching to Tri-treat keeps the With Who value
    When I check whether switching from "Consult" to "Tri-treat" clears With Who
    Then With Who should not be cleared
