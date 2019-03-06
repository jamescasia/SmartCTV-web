// replace these values with those generated in your TokBox Account
var apiKey = "46278792";
var sessionId = "1_MX40NjI3ODc5Mn5-MTU1MTQ1MjEwOTY5Mn4zWmpFSVE5V2xoNWwvL2liaWE3cEgyWmZ-fg";
var token = "T1==cGFydG5lcl9pZD00NjI3ODc5MiZzaWc9OGFjN2ZmMTgzOGFiYjg1YmE0OWNkZjVjMTUyNzY5MTA4NDYwNDAzNTpzZXNzaW9uX2lkPTFfTVg0ME5qSTNPRGM1TW41LU1UVTFNVFExTWpFd09UWTVNbjR6V21wRlNWRTVWMnhvTld3dkwybGlhV0UzY0VneVdtWi1mZyZjcmVhdGVfdGltZT0xNTUxNDUyMTQxJm5vbmNlPTAuNDc0NzA0Mjk2Njc4Mzk4MyZyb2xlPXB1Ymxpc2hlciZleHBpcmVfdGltZT0xNTU0MDQwNTM4JmluaXRpYWxfbGF5b3V0X2NsYXNzX2xpc3Q9";

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