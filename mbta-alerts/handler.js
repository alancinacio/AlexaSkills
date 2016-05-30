/**
 * This sample demonstrates a simple skill built with the Amazon Alexa Skills Kit.
 * The Intent Schema, Custom Slots, and Sample Utterances for this skill, as well as
 * testing instructions are located at http://amzn.to/1LzFrj6
 *
 * For additional samples, visit the Alexa Skills Kit Getting Started guide at
 * http://amzn.to/1LGWsLG
 */

// Route the incoming request based on type (LaunchRequest, IntentRequest,
// etc.) The JSON body of the request is provided in the event parameter.
var rp = require('request-promise');

exports.handler = function (event, context) {
  try {
    console.log("event.session.application.applicationId=" + event.session.application.applicationId);

    if (event.session.application.applicationId !== "amzn1.echo-sdk-ams.app.6f5eaa4a-891c-4e53-8966-21b8582ab6c5") {
      context.fail("Invalid Application ID");
    }


    if (event.session.new) {
      onSessionStarted({ requestId: event.request.requestId }, event.session);
    }

    if (event.request.type === "LaunchRequest") {
      onLaunch(event.request,
        event.session,
        function callback(sessionAttributes, speechletResponse) {
          context.succeed(buildResponse(sessionAttributes, speechletResponse));
        });
    } else if (event.request.type === "IntentRequest") {
      onIntent(event.request,
        event.session,
        function callback(sessionAttributes, speechletResponse) {
          context.succeed(buildResponse(sessionAttributes, speechletResponse));
        });
    } else if (event.request.type === "SessionEndedRequest") {
      onSessionEnded(event.request, event.session);
      context.succeed();
    }
  } catch (e) {
    context.fail("Exception: " + e);
  }
};

function getRouteId(routeSlot) {
  var ROUTE_MAPPINGS = {
    "green line b": "Green-B",
    "green b": "Green-B",
    "green line c": "Green-C",
    "green c": "Green-C",
    "green line d": "Green-D",
    "green d": "Green-D",
    "green line e": "Green-E",
    "green e": "Green-E",
    "mattapan": "Mattapan",
    "mattapan trolley": "Mattapan",
    "blue": "Blue",
    "blue line": "Blue",
    "red": "Red",
    "red line": "Red",
    "orange": "Orange",
    "orange line": "Orange",
    "fairmount": "CR-Fairmount",
    "fairmount line": "CR-Fairmount",
    "fitchburg": "CR-Fitchburg",
    "fitchburg line": "CR-Fitchburg",
    "framingham/worcester": "CR-Worcester",
    "framingham/worcester line": "CR-Worcester",
    "franklin": "CR-Franklin",
    "franklin line": "CR-Franklin",
    "greenbush": "CR-Greenbush",
    "greenbush line": "CR-Greenbush",
    "haverhill": "CR-Haverhill",
    "haverhill line": "CR-Haverhill",
    "kingston/plymouth": "CR-Kingston",
    "kingston/plymouth line": "CR-Kingston",
    "lowell": "CR-Lowell",
    "lowell line": "CR-Lowell",
    "middleborough/lakeville": "CR-Middleborough",
    "middleborough/lakeville line": "CR-Middleborough",
    "needham": "CR-Lowell",
    "needham line": "CR-Lowell",
    "newburyport/rockport": "CR-Newburyport",
    "newburyport/rockport line": "CR-Newburyport",
    "providence/stoughton": "CR-Providence",
    "providence/stoughton line": "CR-Providence",
  }
  var routeSlot = routeSlot.toLowerCase();
  return ROUTE_MAPPINGS[routeSlot] || "none";
}

/**
 * Called when the session starts.
 */
function onSessionStarted(sessionStartedRequest, session) {
  console.log("onSessionStarted requestId=" + sessionStartedRequest.requestId +
    ", sessionId=" + session.sessionId);
}

/**
 * Called when the user launches the skill without specifying what they want.
 */
function onLaunch(launchRequest, session, callback) {
  console.log("onLaunch requestId=" + launchRequest.requestId +
    ", sessionId=" + session.sessionId);
}

/**
 * Called when the user specifies an intent for this skill.
 */
function onIntent(intentRequest, session, callback) {
  console.log("onIntent requestId=" + intentRequest.requestId +
    ", sessionId=" + session.sessionId + ", slot=" + intentRequest.intent.slots.route.value);
  var routeId = getRouteId(intentRequest.intent.slots.route.value);
  getRouteAlerts(routeId, callback);

}

/**
 * Called when the user ends the session.
 * Is not called when the skill returns shouldEndSession=true.
 */
function onSessionEnded(sessionEndedRequest, session) {
  console.log("onSessionEnded requestId=" + sessionEndedRequest.requestId +
    ", sessionId=" + session.sessionId);
  // Add cleanup logic here
}

// --------------- Functions that control the skill's behavior -----------------------


function handleSessionEndRequest(callback) {
  var cardTitle = "Session Ended";
  var speechOutput = "Thank you for trying the Alexa Skills Kit sample. Have a nice day!";
  // Setting this to true ends the session and exits the skill.
  var shouldEndSession = true;

  callback({}, buildSpeechletResponse(cardTitle, speechOutput, null, shouldEndSession));
}

/**
 * Sets the color in the session and prepares the speech to reply to the user.
 */
function getRouteAlerts(route, callback) {
  var cardTitle = "";
  var repromptText = "";
  var sessionAttributes = {};
  var shouldEndSession = false;
  var speechOutput = "I could not find this information.";
  
  if (route === "none") {
    repromptText = "I'm sorry. I did not catch that. Please specify a route to get alert information for.";
    speechOutput = "";
       
    callback(sessionAttributes,
        buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
  }

  var votdProperties = {
    uri: 'http://realtime.mbta.com/developer/api/v2/alertsbyroute?api_key=wX9NwuHnZU2ToO7GmGR9uw&route=' + route + '&include_service_alerts=true&format=json',
    json: true,
    resolveWithFullResponse: true
  };

  return rp(votdProperties)
    .then(function (resp) {
      console.log('res', resp.body);
      cardTitle = "MBTA Alerts";
      var alerts = [];
      
      if (resp.body.alerts.length > 0) {
        for (var index = 0; index < resp.body.alerts.length; index++) {
          var element = resp.body.alerts[index];
          console.log('element' + index, element);  
          if (element.alert_lifecycle && element.alert_lifecycle === "New") {
            alerts.push(element.short_header_text);
          }
          
        }
      }
      
      if (alerts.length === 0) {
        speechOutput = "There are currently no new alerts for the " + resp.body.route_name;
      } else {
        speechOutput = "There are currently " + alerts.length + " alerts for the " + resp.body.route_name + ". ";
        for (var index = 0; index < alerts.length; index++) {
          var element = alerts[index];
          speechOutput += element;
        }
        
      }

      callback(sessionAttributes,
        buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));

    })
    .catch(function (err) {
      console.error('api call error', err);
      callback(sessionAttributes,
        buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
    });

}


// --------------- Helpers that build all of the responses -----------------------

function buildSpeechletResponse(title, output, repromptText, shouldEndSession) {
  return {
    outputSpeech: {
      type: "PlainText",
      text: output
    },
    card: {
      type: "Simple",
      title: title,
      content: output
    },
    reprompt: {
      outputSpeech: {
        type: "PlainText",
        text: repromptText
      }
    },
    shouldEndSession: shouldEndSession
  };
}

function buildResponse(sessionAttributes, speechletResponse) {
  return {
    version: "1.0",
    sessionAttributes: sessionAttributes,
    response: speechletResponse
  };
}