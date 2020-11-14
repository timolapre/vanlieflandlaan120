function getSchoonmaakrooster(offset, today = false) {
  $.post("api/cleaning", { weekOffset: offset, today }, function (data) {
    $('#schoonmaakrooster').html(data);
  });
}

function nextWeek() {
  getSchoonmaakrooster(1);
}

function previousWeek() {
  getSchoonmaakrooster(-1);
}

function thisWeek() {
  getSchoonmaakrooster(0, true);
}