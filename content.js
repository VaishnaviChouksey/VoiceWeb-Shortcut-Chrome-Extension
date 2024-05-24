chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  if (message.action === "startVoiceInput") {
    voiceRecognition(message.url, message.voiceButton);
  }

  if (message.action === "setShortcutAction") {
    setShortcut(message.url);
  }
});

let voiceCommand = "";

const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();
recognition.lang = "en-US";

function voiceRecognition(url, voiceButton) {
  if (url != "") {
    if (voiceButton === "Start Voice Input") {
      recognition.start();
    } else {
      recognition.stop();
    }
  } else {
    alert("Please enter url.");
  }
}

recognition.addEventListener("start", startSpeechRecognition);
function startSpeechRecognition() {
  console.log("active");
}

recognition.addEventListener("end", endSpeechRecognition);
function endSpeechRecognition() {
  console.log("deactive");
}

recognition.addEventListener("result", function (event) {
  const speechResult = event.results[0][0].transcript.trim().toLowerCase();
  voiceCommand = speechResult;
  console.log("Voice Command:", voiceCommand);
});

recognition.addEventListener("error", function (event) {
  console.error("Speech recognition error:", event.error);
  alert(
    "Speech recognition error. Please ensure microphone access and try again."
  );
});


const siteIdentifier = window.location.hostname;


function setShortcut(url) {
  if (url != "" && voiceCommand != "") {
    chrome.storage.local.get(null, function (data) {
      const allData = data || {};
      const siteShortcuts = allData[`${siteIdentifier}_shortcuts`] || {};

      siteShortcuts[voiceCommand] = url;
      allData[`${siteIdentifier}_shortcuts`] = siteShortcuts;

      chrome.storage.local.set(allData, function () {
        if (!chrome.runtime.lastError) {
          console.log(
            `Shortcut set successfully for site ${siteIdentifier}:`,
            siteShortcuts
          );
          alert(`Shortcut "${voiceCommand}" set successfully for ${url}`);
        } else {
          console.error("Error setting shortcut:", chrome.runtime.lastError);
        }
      });
    });
  } else {
    alert("Invalid data for setting shortcut.");
  }
}

function checkVoiceCommand(speechResult) {
  const siteIdentifier = window.location.hostname;
  chrome.storage.local.get(`${siteIdentifier}_shortcuts`, function (data) {
    const shortcuts = data[`${siteIdentifier}_shortcuts`];
    if (shortcuts && shortcuts[speechResult]) {
      console.log("found");
      const url = shortcuts[speechResult];
      openUrl(url);
    }
  });
}

function openUrl(url) {
  window.open(url, "_blank");
}

const recognition1 = new webkitSpeechRecognition() || new SpeechRecognition();
recognition1.continuous = false;
recognition1.lang = "en-US";

recognition1.onstart = function () {
  console.log("Speech recognition started...");
};

recognition1.onend = function () {
  document.getElementById("voiceCommandButton").innerHTML = "Voice Command";
  console.log("Speech recognition ended...");
};

recognition1.onresult = function (event) {
  const speechResult = event.results[0][0].transcript.trim().toLowerCase();
  checkVoiceCommand(speechResult);
};

recognition1.onerror = function (event) {
  console.error("Speech recognition error:", event.error);
};

function recognizeVoice() {
  let button = document.getElementById("voiceCommandButton");
  if (button.textContent === "Voice Command") {
    button.textContent = "End Voice Command";
    recognition1.start();
  } else if (button.textContent === "End Voice Command") {
    button.textContent = "Voice Command";
    recognition1.stop();
  }
}

function addButton() {
  const siteIdentifier = window.location.hostname;

  chrome.storage.local.get(`${siteIdentifier}_shortcuts`, function (data) {
    const shortcuts = data[`${siteIdentifier}_shortcuts`];
    if (shortcuts && Object.keys(shortcuts).length > 0) {
      
      let existingButton = document.getElementById("voiceCommandButton");

      if (!existingButton) {
        const button = document.createElement("button");
        button.textContent = "Voice Command";
        button.id = "voiceCommandButton"; 
        button.style.position = "fixed";
        button.style.top = "3px";
        button.style.left = "5px";
        button.style.zIndex = "9999"; 
        button.style.backgroundColor= "#943eb8";
        button.style.color="white";
        button.style.border= "none";
        button.style.padding="10px 4px";
        button.style.borderRadius= "10px";
        button.style.cursor= "pointer";
        button.style.boxShadow= "0 0 4px 10px rgba(208, 8, 235, 0.19)";
        button.style.transition= "background-color 0.3s ease";
        button.style.width="150px";
      
        button.addEventListener("mouseover",function(){
          button.style.backgroundColor= "#72219d";
          button.style.boxShadow= "0 0 4px 10px rgba(177, 8, 199, 0.19)";
        })
        button.addEventListener("mouseout",function(){
          button.style.backgroundColor= "#943eb8";
          button.style.boxShadow="0 0 4px 10px rgba(208, 8, 235, 0.19)";
        })

        button.addEventListener("click", function () {
          recognizeVoice();
        });

        document.body.appendChild(button);
      }
    }
  });
}

addButton();
