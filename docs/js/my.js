$(window).scroll(function () {
  if ($(".navbar").offset().top > 50) {
    $(".navbar-fixed-top").addClass("top-nav-collpase");
  } else {
    $(".navbar-fixed-top").removeClass("top-nav-collapse");
  }
});

$(function () {
  $('.page-scroll a').click(function (event) {
    var anchor = $(this);
    $('html, body').stop().animate({
      scrollTop: $(anchor.attr('href')).offset().top - 50
    },
      1500,
      'linear'
    );
    event.preventDefault();
  });
});

$('#frmContact').submit(function () {
  var formControl = true;

  var frmGrpVorname = $('#vorname');
  var frmGrpNachname = $('#nachname');
  var frmGrpMail = $('#mail');
  var frmGrpNachricht = $('#nachricht');

  frmGrpVorname.removeClass('is-invalid');
  frmGrpNachname.removeClass('is-invalid');
  frmGrpMail.removeClass('is-invalid');
  frmGrpNachricht.removeClass('is-invalid');

  var vorname = $('#vorname').val();
  var nachname = $('#nachname').val();
  var mail = $('#mail').val();
  var nachricht = $('#nachricht').val();

  if (vorname == '') {
    formControl = false;
    frmGrpVorname.addClass('is-invalid');
  }

  if (nachname == '') {
    formControl = false;
    frmGrpNachname.addClass('is-invalid');
  }

  if (mail == '') {
    formControl = false;
    frmGrpMail.addClass('is-invalid');
  }

  if (nachricht == '') {
    formControl = false;
    frmGrpNachricht.addClass('is-invalid');
  }

  if (formControl) {
    $.ajax({
      type: 'POST',
      url: 'https://formspree.io/7262de68-ae33-4758-b3a3-1283c824f2a6@michaltsis.net',
      data: { vorname: vorname, nachname: nachname, mail: mail, nachricht: nachricht }
    }).done(function (message) {
      var erfolgsmeldung = $('#erfolgsmeldung');
      erfolgsmeldung.html(message);
      erfolgsmeldung.addClass('alert');
      erfolgsmeldung.addClass('alert-success');
    });

  }

  return false;
});
