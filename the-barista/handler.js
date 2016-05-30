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

exports.handler = function (event, context) {
  try {
    console.log("event.session.application.applicationId=" + event.session.application.applicationId);

    if (event.session.application.applicationId !== "amzn1.echo-sdk-ams.app.2c18c921-4c28-4608-8341-536a42f814c2") {
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
    ", sessionId=" + session.sessionId);
  if (intentRequest.intent.name === "GetWater") {
    getWater(intentRequest.intent.slots, callback);
  } else if (intentRequest.intent.name === "GetGrounds") {
    getGrounds(intentRequest.intent.slots, callback);
  } 
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
function getWater(slots, callback) {
  var cardTitle = "Filipe The Barista";
  var repromptText = "";
  var sessionAttributes = {};
  var shouldEndSession = false;
  var speechOutput = "I could not find this information.";
  
  var unit = slots.unit.value;
  var quantity = parseFloat(slots.quantity.value);
  
  switch (unit) {
    case "cups" :
      speechOutput = "For " + quantity + " " + unit + " of coffee. You may use " + (300 * quantity) + " grams of water and " + ((300 * quantity) / 17).toFixed(2) + " grams of coffee. Assuming a 10 ounce or 300 gram cup.";
      break;
    case "grams" :
      speechOutput = "For " + quantity + " " + unit + " of coffee. You may use " + (quantity * 17) + " grams of water.";
      break;
    case "mugs"  :
      speechOutput = "For " + quantity + " " + unit + " of coffee. You may use " + (300 * quantity) + " grams of water and " + ((300 * quantity) / 17).toFixed(2) + " grams of coffee. Assuming a 10 ounce or 300 gram Mug.";
      break;
    case "ounces" :
      speechOutput = "For " + quantity + " " + unit + " of coffee. You may use " + (quantity * 17) + " grams of water.";
      break;
    case "spoons" :
      speechOutput = "For " + quantity + " " + unit + " of coffee. You may use " + ((quantity * 7) * 17) + " grams of water.";
      break;
    default :
      speechOutput = "Well that doesn't sound right. How about you try 300 grams of water and 17 grams of coffee?";
      break;
  }
  
  if (Boolean(Math.floor(Math.random() * 2))) {
    speechOutput += " Try going to atomicafe.com for freshly roasted single orgin beans."
  }  
  
  callback(sessionAttributes,
        buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
}

function getGrounds(slots, callback) {
  var cardTitle = "Filipe The Barista";
  var repromptText = "";
  var sessionAttributes = {};
  var shouldEndSession = false;
  var speechOutput = "I could not find this information.";
  
  var unit = slots.unit.value;
  var quantity = parseFloat(slots.quantity.value);
  
  switch (unit) {
    case "cups" :
      speechOutput = "To brew " + quantity + " " + unit + " of coffee. You may use " + ((300 * quantity) / 17).toFixed(2) + " grams of coffee grounds. Assuming a 10 ounce or 300 gram cup.";
      break;
    case "grams" :
      speechOutput = "To Brew " + quantity + " " + unit + " of coffee. You may use " + (quantity / 17).toFixed(2) + " grams of coffee grounds.";
      break;
    case "mugs"  :
      speechOutput = "To Brew " + quantity + " " + unit + " of coffee. You may use " + ((300 * quantity) / 17).toFixed(2) + " grams of coffee grounds. Assuming a 10 ounce or 300 gram mug.";
      break;
    case "ounces" :
      speechOutput = "To Brew " + quantity + " " + unit + " of Coffee. You may use " + (quantity / 17).toFixed(2) + " grams of coffee grounds.";
      break;
    case "spoons" :
      speechOutput = "Well that doesn't sound right. How about you try 300 grams of water and 17 grams of coffee?";
      break;
    default :
      speechOutput = "Well that doesn't sound right. How about you try 300 grams of water and 17 grams of coffee?";
      break;
  }
  
  if (Boolean(Math.floor(Math.random() * 2))) {
    speechOutput += " To ensure the best tasting coffee. Make sure to use freshly ground beans."
  }  

  callback(sessionAttributes,
        buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
}

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