let toggleTime = 1500;

function init_view(commands) {
  const reordered = [];
  commands.forEach(function(command) {
    if (command != "silence" && command != "unknown") {
      reordered.push(command);
    }
  });

  let split = Math.floor(reordered.length/2)
  for (let i = 0; i < split; i++) {
      $('#commandList1').append(
        $('<li>').attr('class','list-group-item ' + reordered[i] + '_button text-center').append(reordered[i].toUpperCase()));
  }

  for (let i = split; i < reordered.length; i++) {
      $('#commandList2').append(
        $('<li>').attr('class','list-group-item ' + reordered[i] + '_button text-center').append(reordered[i].toUpperCase()));
  }

  $('#commandList3').append(
    $('<li>').attr('class','list-group-item unknown_button text-center').append("unknown"));

  $('.unknown_button').addClass('list-group-item-dark');
}

let lastCommand;
let lastToggleTime = 0;

function toggleCommand(command) {
  const lastCommand = command;
  const lastToggleTime = new Date().getTime();
  $('.commandList .active').removeClass('active');
  $('.commandList .'+command+'_button').addClass('active');
}

function updateToggledCommand(command) {
  if (command == 'silence') {
    command = 'unknown';
  }

  currentTime = new Date().getTime();

  if (command != 'unknown') {
    if (lastCommand != command) {
      $('#statusBar').text('keyword spoken is ... ' + command.toUpperCase() + ' !!');
      toggleCommand(command);
    }
  } else if (lastCommand != 'unknown' && currentTime > lastToggleTime + toggleTime) {
    // current command is unknown
    $('#statusBar').text('Say one of the following keywords');
    toggleCommand(command);
  }
}

let micAudioProcessor = new MicAudioProcessor(audioConfig);
let model = new SpeechResModel("RES8", commands);

micAudioProcessor.getMicPermission().done(function() {
  let prevCommand = '';
  setInterval(function() {
    let offlineProcessor = new OfflineAudioProcessor(audioConfig, micAudioProcessor.getData());
    offlineProcessor.getMFCC().done(function(mfccData) {
      const command = predictKeyword(mfccData, model, commands);
      if (command === prevCommand) {
          if (command !== 'silence' && command !== 'unknown') {
            console.log('Command: ' + command);
          }

          if (command === 'stop' && micAudioProcessor.status === 'playing') {
            let music = document.getElementById('music');
            music.pause();
            micAudioProcessor.status = 'paused';
          } else if (command === 'off' && (micAudioProcessor.status === 'playing' || micAudioProcessor.status === 'paused')) {
            let music = document.getElementById('music');
            music.pause();
            micAudioProcessor.status = 'wait';
          }

          if (command === 'go' && micAudioProcessor.status === 'paused') {
            let music = document.getElementById('music');
            music.play();
            micAudioProcessor.status = 'playing';
          }

          if (command === 'left') {
            if (micAudioProcessor.status === 'playing') {
              let music = document.getElementById('music');
              music.pause();
            }

            if (micAudioProcessor.getLongBufferLength() > 0) {
              console.log('cancelling command with another one')
            } else {
              console.log('starting listen a new command')
            }
            micAudioProcessor.status = 'listen'
            micAudioProcessor.longBuffer = [];
          } else if (micAudioProcessor.status === 'listen' && micAudioProcessor.getLongBufferLength() > micAudioProcessor.getData().length && command === 'silence') {
            micAudioProcessor.status = 'send';
          }
      }
      prevCommand = command;
      updateToggledCommand(command);
    });
  }, predictionFrequency);
}).fail(function() {
  alert('mic permission is required, please enable the mic usage!');
});

// list initialization
init_view(commands);
