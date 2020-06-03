function getSchoonmaakrooster() {
  $.get("api/cleaning", function (data) {
      $('#schoonmaakrooster').html(data);
  });
}
