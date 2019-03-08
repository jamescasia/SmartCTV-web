// replace these values with those generated in your TokBox Account
var apiKey = "46283042";
var sessionId = "1_MX40NjI4MzA0Mn5-MTU1MjAxOTA0Nzc3Nn4xN0EzN0ZueXd5S0UvS3J4OUNqTWRkOWx-fg";
var token = "T1==cGFydG5lcl9pZD00NjI4MzA0MiZzaWc9MTBiMzdkMjdiODlhYzE2ZWMxNTgxZTQzNTBhNmZkN2QxMDMyYTkxNTpzZXNzaW9uX2lkPTFfTVg0ME5qSTRNekEwTW41LU1UVTFNakF4T1RBME56YzNObjR4TjBFek4wWnVlWGQ1UzBVdlMzSjRPVU5xVFdSa09XeC1mZyZjcmVhdGVfdGltZT0xNTUyMDE5MDcwJm5vbmNlPTAuODY0MTY0NDE0NTQzMTU5NyZyb2xlPXB1Ymxpc2hlciZleHBpcmVfdGltZT0xNTU0NjA3NDY5JmluaXRpYWxfbGF5b3V0X2NsYXNzX2xpc3Q9";

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