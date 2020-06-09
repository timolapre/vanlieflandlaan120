function getSchoonmaakrooster(offset) {
  $.post("api/cleaning", {weekOffset: offset}, function (data) {
      $('#schoonmaakrooster').html(data);
  });
}

function nextWeek(){
  getSchoonmaakrooster(1);
}

function previousWeek(){
  getSchoonmaakrooster(-1);
}