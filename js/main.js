"use strict"


// Элементы
const win = $(window)
const menuBtn = $('.menu-btn')
const menu = $('.menu')
const mainCont = $('.main-content')
const descriptions = $('.categories__descriptions')
const lastCategory = $('.categories__descriptions .category:last-child')
const categoriesPhoto = $('.categories__photo')
const categoriesPhotoImg = $('.categories__photo img')
const rotatingFrame = $('.red-sqr')
const categoryNumber = $('.category-number')
const arrowToScroll = $('.arrow-to-scroll')
const categories = $('.categories')
const firstScreen = $('.first-screen')


// Переменные
let winHeight = win.height()
let winWidth = win.width()
let winHeightHalf = win.height()/2
let lastCategoryHeight = lastCategory.height()
let lastCategoryEndScreenTop = winHeightHalf - lastCategoryHeight/2
let categoriesMargin = +categories.css('margin-top').replace('px','')
let categoriesOffsetTop = categories.offset().top
let scrollToFix = winHeight + categoriesMargin
let categoriesPhotoImgHeight = categoriesPhotoImg.height()
let currentScroll
let lastCategoryScreenTop
let categoriesScrollTop
let translateBlock = 0
let menuIndex = 1


// функции

const categoriesPhotoImgChild = function(index) {
	return $(`.categories__photo img:nth-child(${index})`)
}
const categoriesChild = function(index) {
	return $(`.categories__descriptions .category:nth-child(${index})`)
}
const categoriesChildOffsetTop = function(index) {
	return categoriesChild(index).offset().top
}
const secondSectionPositions = function() {
	if (winWidth <= 1100) {
		rotatingFrame.css('top', categoriesPhotoImgHeight/2 + 'px')
		categoryNumber.css('top', categoriesPhotoImgHeight/2 + 'px')
		categoriesPhoto.css('height', categoriesPhotoImgHeight+'px')
	}
}
const deleteWow = function() {
	if (winWidth <= 1100) {
		$(`.categories__descriptions .category:nth-child(1)`).removeClass('wow')
	}
}
deleteWow()
secondSectionPositions()


// Изменение размеров

win.resize(function() {
	winHeight = win.height()
	winWidth = win.width()
	winHeightHalf = win.height()/2
	lastCategoryEndScreenTop = winHeightHalf - lastCategoryHeight/2
	categoriesMargin = +categories.css('margin-top').replace('px','')
	categoriesOffsetTop = categories.offset().top
	scrollToFix = winHeight + categoriesMargin
	categoriesPhotoImgHeight = categoriesPhotoImg.height()
	secondSectionPositions()
})

// Меню

menuBtn.click(function() {
	if (menuIndex) {
		menuBtn.addClass('active')
		winWidth > 1100 ? menuBtn.css('transform', 'translateX(6vw)') : menuBtn.css('transform', 'translateX(2vw)')
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


// Прокрутка вниз

arrowToScroll.click(function() {
	if (winWidth > 1100) {
		$('html').animate({scrollTop: scrollToFix + 1}, {easing: "swing"}, 600)
	} else {
		$('html').animate({scrollTop: firstScreen.height() + 3}, {easing: "swing"}, 600)
		winWidth = win.width()
		categoriesPhotoImgHeight = categoriesPhotoImg.height()
		secondSectionPositions()
	}
})


// Функции при прокрутке

win.scroll(function() {
	currentScroll = win.scrollTop()
	// Вторая секция(ПК и моб)
	if (winWidth > 1100) {
		// Секция категорий - фиксация
		lastCategoryScreenTop = lastCategory.offset().top - currentScroll
		if (currentScroll > scrollToFix && lastCategoryScreenTop > lastCategoryEndScreenTop) {
			categoriesPhoto.css('position', 'fixed')
			translateBlock = 1
			categoriesPhoto.css('transform', `translateY(0px)`)
		}
		else {
			categoriesPhoto.css('position', 'relative');
			if (currentScroll > scrollToFix && translateBlock) {
				categoriesScrollTop = currentScroll - categoriesOffsetTop
				categoriesPhoto.css('transform', `translateY(${categoriesScrollTop}px)`)
				translateBlock = 0
			}
		}
		// Секция категорий - смена картинок
		for (let i = 1 ; i < $('.category').length + 1 ; i++) {
			if (categoriesChildOffsetTop(i) - currentScroll < winHeightHalf && categoriesChildOffsetTop(i) - currentScroll > 0) {
				categoriesPhotoImg.css('opacity', '0')
				categoriesPhotoImgChild(i).css('opacity', '1')
				categoryNumber.text(`0${i}`)
			}
		}
	}
	else {
		// Секция категорий - фиксация
		lastCategoryScreenTop = lastCategory.offset().top - currentScroll
		if (currentScroll > firstScreen.height() && lastCategoryScreenTop > winHeightHalf) {
			categoriesPhoto.css('position', 'fixed')
			translateBlock = 1
			categoriesPhoto.css('transform', `translateY(0px)`)
			descriptions.css('margin-top', categoriesPhotoImgHeight+'px')
		}
		else {
			categoriesPhoto.css('position', 'relative')
			descriptions.css('margin-top', '0px')
			if (currentScroll > firstScreen.height() && translateBlock) {
				categoriesScrollTop = currentScroll - categoriesOffsetTop
				categoriesPhoto.css('transform', `translateY(${categoriesScrollTop}px)`)
				translateBlock = 0
				
			}
		}
		// Секция категорий - смена картинок
		for (let i = 1 ; i < $('.category').length + 1 ; i++) {
			if (categoriesChildOffsetTop(i) - currentScroll < winHeightHalf && categoriesChildOffsetTop(i) - currentScroll > winHeightHalf - categoriesPhotoImgHeight/3.5) {
				categoriesPhotoImg.css('opacity', '0')
				categoriesPhotoImgChild(i).css('opacity', '1')
				categoryNumber.text(`0${i}`)
			}
		}
	}
	// Фиксация кнопки меню
	if (!menuIndex) {
		winWidth > 1100 ? menuBtn.css('transform', `translateX(6vw) translateY(${currentScroll}px)`) : menuBtn.css('transform', `translateX(2vw) translateY(${currentScroll}px)`)
	}
	// Вращение красной рамки
	rotatingFrame.css('transform', `translateY(-50%) translateX(-50%) rotate(${currentScroll/10}deg)`)
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

$('[name="phone"]').on('input', function() {
	$(this).val($(this).val().replace(/[A-Za-zA-Яа-я-Ёе]/, ''))
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