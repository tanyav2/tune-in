$(document).ready(function(){

  $('#submit-button').on('click', function(){

      $.ajax({
        type: 'POST',
        url: '/submitted',
        success:function(data, code, jqXHR) {
            window.location.pathname = "../submitted.html";
        }
      });
      return false;
  });
});
