$(document).ready(function(){

  $('#submit-button').on('click', function(){
    var data = $('#text-area').val();
      $.ajax({
        type: 'POST',
        url: '/submitted',
        data: data,
        success:function(data, code, jqXHR) {
            window.location.pathname = "../submitted.html/data";
        }
      });
      return false;
  });
});
