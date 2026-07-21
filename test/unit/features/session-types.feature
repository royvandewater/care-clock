Feature: Session types

  Care-clock supports a fixed set of session types. "Tri-Treat" behaves like
  "Consult": it has a free-form "With Who" text field, so switching to it must
  not clear the withWho value.

  Scenario: Tri-Treat is a valid session type
    When I parse the session type "Tri-Treat"
    Then the parsed session type should be "Tri-Treat"

  Scenario: switching to Tri-Treat keeps the With Who value
    When I check whether switching from "Consult" to "Tri-Treat" clears With Who
    Then With Who should not be cleared
