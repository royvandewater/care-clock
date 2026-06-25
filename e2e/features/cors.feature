Feature: API CORS headers

  Scenario: the API does not advertise CORS access to every origin
    When I request the activities API from another origin
    Then the response should not include an Access-Control-Allow-Origin header
