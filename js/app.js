// replace these values with those generated in your TokBox Account
var apiKey = "46288002";
var sessionId = "1_MX40NjI4ODAwMn5-MTU1MjY5MTMzMTU0MH5TUnBPcTJhTURtZ0hYTXdZcVZjSHBpSGR-fg";
var token = "T1==cGFydG5lcl9pZD00NjI4ODAwMiZzaWc9OGFjMmZlYTdmMGM3ZjU1ZTM2MGUwOTAzYTBmZDZlYTRlYTFlNGZkZDpzZXNzaW9uX2lkPTFfTVg0ME5qSTRPREF3TW41LU1UVTFNalk1TVRNek1UVTBNSDVUVW5CUGNUSmhUVVJ0WjBoWVRYZFpjVlpqU0hCcFNHUi1mZyZjcmVhdGVfdGltZT0xNTUyNjkxMzUxJm5vbmNlPTAuMDQ4NzY4NjMwODI2MTYzODk1JnJvbGU9cHVibGlzaGVyJmV4cGlyZV90aW1lPTE1NTUyODMzNDkmaW5pdGlhbF9sYXlvdXRfY2xhc3NfbGlzdD0=";

// (optional) add server code here
initializeSession();

// Handling all of our errors here by alerting them
function handleError(error) {
    if (error) {
      alert(error.message);
    }
  }
  
  function initializeSession() {
    var session = OT.initSession(apiKey, sessionId);
  
    // Subscribe to a newly created stream
    session.on('streamCreated', function(event) {
        session.subscribe(event.stream, 'subscriber', {
          insertMode: 'append',
          width: '100%',
          height: '100%'
        }, handleError);
      });
  
    // Create a publisher
    var publisher = OT.initPublisher('publisher', {
      insertMode: 'append',
      width: '100%',
      height: '100%',
      name: 'Wassuh'
    }, handleError);
  
    // Connect to the session
    session.connect(token, function(error) {
      // If the connection is successful, publish to the session
      if (error) {
        handleError(error);
      } else {
        session.publish(publisher, handleError);
      }
    });
  }