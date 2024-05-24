document.getElementById('startVoice').addEventListener('click', function() {
  var url = document.getElementById('website').value.trim();
  var voiceButton = document.getElementById('startVoice').innerHTML;
  if(document.getElementById('startVoice').innerHTML==="Start Voice Input"){
    document.getElementById('startVoice').innerHTML="End Voice Input";
  }
  else{
    document.getElementById('startVoice').innerHTML="Start Voice Input";
  }
    chrome.runtime.sendMessage({
      action: 'startVoiceInput',
      url:url,
      voiceButton:voiceButton
    });
  });
  
document.getElementById('setShortcut').addEventListener('click', function() {
    var url = document.getElementById('website').value.trim();;
    chrome.runtime.sendMessage({
      action: 'setShortcutAction',
      url:url
    });
  });
