"use strict"


// Константы

// Элементы
const win = $(window)
const menuBtn = $('.menu-btn')
const menu = $('.menu')
const mainCont = $('.main-content')


// Переменные

let currentScroll
let menuIndex = 1


// Меню

menuBtn.click(function() {
	if (menuIndex) {
		menuBtn.addClass('active')
		win.width() > 1100 ? menuBtn.css('transform', 'translateX(6vw)') : menuBtn.css('transform', 'translateX(2vw)')
		menu.addClass('active')
		mainCont.addClass('active')
		menuIndex = 0
	}
	else {
		menuBtn.removeClass('active')
		menuBtn.css('transform', 'translateY(0) translateX(0)')
		menu.removeClass('active')
		mainCont.removeClass('active')
		menuIndex = 1
	}
})


// Функции при прокрутке

win.scroll(function() {
	currentScroll = win.scrollTop()
	// Фиксация кнопки меню
	if (!menuIndex) {
	win.width() > 1100 ? menuBtn.css('transform', `translateX(6vw) translateY(${currentScroll}px)`) : menuBtn.css('transform', `translateX(2vw) translateY(${currentScroll}px)`)	}
})


// Форма

$('.form__sending').fadeOut()
$('.form__after-sending').fadeOut()
$('form').submit(function(event) {
	event.preventDefault()
	$('form fieldset').fadeOut()
	$('.form__sending').fadeIn()
	$.ajax({
		type: 'POST',
		url: 'phpmailer/mail.php',
		data: $(this).serialize()
	}).done(function() {
		$(this).find('input').val('')
		$('form').trigger('reset')
		$('.form__sending').fadeOut()
		$('.form__after-sending').fadeIn()
		setTimeout(function() {
			$('.form__after-sending').fadeOut()
			$('form fieldset').fadeIn()
		}, 4000)
	})
})


// Wow

let wow = new WOW(
  {
    boxClass: 'wow',
    animateClass: 'animated',
    offset: 150,
    mobile: true,
    live: true,
    callback: function(box) {
    },
    scrollContainer: null
  }
)
wow.init()

// Слайдер

$('.slider').slick({
	dots: true,
	vertical: false,
	infinite: false
})