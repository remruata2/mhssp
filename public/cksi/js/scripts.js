// PreLoader
$(window).on("load", function () {
    $("#preLoader").fadeOut("200", function () {
        $("#preLoader").delay(100).fadeOut("slow");
    });
});

// Screenshop Slider
$('.autoplay').slick({
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    arrows: false,
    padding: 20,
    dots: true,
    autoplaySpeed: 2000,
    responsive: [
        {
        breakpoint: 768,
        settings: {
            slidesToShow: 3
        }
        },
        {
        breakpoint: 480,
        settings: {
            slidesToShow: 1
        }
        }
    ]
});

// Header Effects
$(window).scroll( () => {
    var windowTop = $(window).scrollTop();
    windowTop > 40 ? $('.app_header').addClass('sticky') : $('.app_header').removeClass('sticky');
});
    
// Scroll to position
var sections = $('.section_block')
, nav = $('.single_navbar ul')
, nav_height = 80;

$(window).on('scroll', function () {
var cur_pos = $(this).scrollTop();

sections.each(function() {
    var top = $(this).offset().top - nav_height,
        bottom = top + $(this).outerHeight();
    if (cur_pos >= top && cur_pos <= bottom) {
    nav.find('a').removeClass('active');
    sections.removeClass('active');
    
    $(this).addClass('active');
    nav.find('a[href="#'+$(this).attr('id')+'"]').addClass('active');
    }
});
});

nav.find('a').on('click', function () {
var $el = $(this)
    , id = $el.attr('href');

$('html, body').animate({
    scrollTop: $(id).offset().top - nav_height
}, 500);

return false;
});

$('.hamburger_menu').on('click', function () {
    $('body').toggleClass('nav_active');
});
$('.nav_close, .app_overlay').on('click', function () {
    $('body').removeClass('nav_active');
});

$('.single_navbar ul li a').on('click', function () {
    $(".nav_close").trigger("click");
});

$(document).ready(function () {
    $(".send-message").on("click", function () {
        let name = $("#name").val()
        let email = $("#email").val()
        let phone = $("#phone").val()
        let subject = $("#subject").val()
        let message = $("#message").val()

        if (name !== '' && email !== '' && message !== '' && phone !== '' && subject !== '') {
            let body = "<table style='width: 100%; border: 1px solid black; border-collapse: collapse;'><tr><td style='border: 1px solid black;'>From</td><td style='border: 1px solid black;''>" + name + "</td></tr><tr><td style='border: 1px solid black;'>Email</td><td style='border: 1px solid black;'>" + email + "</td></tr><tr><td style='border: 1px solid black;'>Phone</td><td style='border: 1px solid black;'>" + phone + "</td></tr><tr><td style='border: 1px solid black;'>Subject</td><td style='border: 1px solid black;'>" + subject + "</td></tr><tr><td style='border: 1px solid black;'>Message</td><td style='border: 1px solid black;'>" + message + "</td></tr></table>"
            let htmlData = `<table>
                                <tr>
                                    <td>Name</td>
                                    <td>${name}</td>
                                </tr>
                                <tr>
                                    <td>Email</td>
                                    <td>${email}</td>
                                </tr>
                                <tr>
                                    <td>Phone Number</td>
                                    <td>${phone}</td>
                                </tr>
                                <tr>
                                    <td>Subject</td>
                                    <td>${subject}</td>
                                </tr>
                                <tr>
                                    <td>Message</td>
                                    <td>${message}</td>
                                </tr>
                            </table>`

            let emailData = {
                fromEmail: "info@mediknit.org",
                fromName: "MHSSP",
                htmlData,
                subject,
                toEmail: 'mnhssp@tvasan.in'
            }

            $.ajax({
                url: "https://api-eventz.mediknit.org/email-template/send-email",
                method: "POST", //First change type to method here
                data: emailData,
                success: function (response) {
                    alert("mail sent successfully")
                    $("#name").val('')
                    $("#email").val('')
                    $("#phone").val('')
                    $("#subject").val('')
                    $("#message").val('')
                },
                error: function () {
                    alert("error");
                }
            });

        } else {
            alert("Please fill the details")
        }
    })
})