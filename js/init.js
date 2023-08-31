/*
 * Copyright (c) 2021 Frenify
 * Author: Frenify
 * This file is made for CURRENT TEMPLATE
*/


(function($){
  "use strict";
  
  
	var Persono = {
		
		topPositon: 0,

		init: function(){
			// get scrollbar width and apply it as padding right for body to disable scroll without dragging
			Persono.getScrollbarWidth();
			
			// parallax effect for about section
			Persono.parallax();
			
			// set background image from data
			Persono.background__image();
			
			// change image file to svg
			Persono.img__to_svg();
			
			// main title animation
			Persono.title__animation();
			
			// navigation menu scroll
			Persono.navigation__scroll();
			
			// resume hover animation
			Persono.resume__hover();
			
			// jump to anchor with animation: it was applied to desktop and mobile menus
			Persono.anchor__jump();
			
			// service opener/closer and its navigation actions
			Persono.service__actions();
			
			// portfolio category filter
			Persono.portfolio__category_filter();
			
			// contact form submit action (works with PHP)
			Persono.contact__submit();
			
			// popup opener/closer and its navigation actions: it was used for portfolio and blog posts
			Persono.popup__actions();
			
			// navigation resize action: it will resize sidebar with dragger
			Persono.navigation__resize();
			
			// navigation open and close actions
			Persono.navigation__closer();
			
			// mobile menu open and close actions
			Persono.navigation__mobile();
			
			// initalize main slider
			Persono.slider__initalize();
		},
		
		slider__title_animation: function(){
			$('.main_slider .title_holder h3').each(function(){
				var e = $(this);
				if(!e.hasClass('js_ready')){
					var t = e.text();
					var html = '';
					$.each(t.split(''),function(i,e){
						if(i === 0){
							html += '<span class="word">';
						}
						if(e === ' '){
							html += '</span>&nbsp<span class="word">';
						}else{
							html += '<span class="char">'+e+'</span>';
						}
					});
					e.html(html);
				}
				e.addClass('js_ready');
			});
		},
		
		slider__initalize: function(){
			Persono.slider__title_animation();
			Persono.background__image();
			Persono.img__to_svg();
			
			$('.main_slider').each(function(){
				var element 	= $(this);
				var container 	= element.find('.swiper-container');
				var mySwiper 	= new Swiper (container, {
					observer: true,
					observeParents: true,
					loop: true,
					slidesPerView: 1,
					spaceBetween: 0,
					speed: 1500,
					loopAdditionalSlides: 20,
					navigation: {
						nextEl: container.find('.nav__next'),
						prevEl: container.find('.nav__prev'),
				  	},
					autoplay: {
						delay: 7000,
						disableOnInteraction: false
					},
					on: {
					  init: function () {
						Persono.letterAnimation(container);
					  },
					  slideChangeTransitionEnd: function () {
						Persono.letterAnimation(container);
					  },
					},
				});
			});
		},
		
		letterAnimation: function (element){
			element.find('.swiper-slide .char').removeClass('opened');
			var active	= element.find('.swiper-slide-active');
			var mySpan	= active.find('.char');
			var speed 	= 40;
			mySpan.each(function(i){
				var element = $(this);
				setTimeout(function(){element.addClass('opened');},i*speed);
			});
		},
		
		
		navigation__mobile: function(){
			var hamburger		= $('.persono_fn_mobilemenu .hamburger');
			hamburger.on('click',function(){
				var element 	= $(this);
				var menupart	= $('.persono_fn_mobilemenu .mobilemenu');
				if(element.hasClass('is-active')){
					element.removeClass('is-active');
					menupart.removeClass('opened');
					menupart.slideUp(500);
				}else{
					element.addClass('is-active');
					menupart.addClass('opened');
					menupart.slideDown(500);
				}return false;
			});
		},
		
		navigation__closer: function(){
			var wrapper		= $('.persono_fn_wrapper');
			var sidebar		= $('.persono_fn_sidebar');
			var trigger		= sidebar.find('.nav_trigger');
			$('.persono_fn_sidebar .nav__button').off().on('click',function(){
				if(wrapper.hasClass('sidebar-closed')){
					wrapper.removeClass('sidebar-closed');
					trigger.text(trigger.data('close'));
				}else{
					wrapper.addClass('sidebar-closed');
					trigger.text(trigger.data('open'));
				}
				setTimeout(function(){
					Persono.portfolio__category_filter();
					Persono.service__masonry();
					Persono.popup__resize();
					Persono.slider__initalize();
				},500);
				
				return false;
			});
		},
		
		navigation__resize: function(){
			var isResizing 	= false,
				lastDownX 	= 0;

			var sidebar		= $('.persono_fn_sidebar'),
				content 	= $('.persono_fn_content'),
				handle 		= $('.shifter_wrapper'),
				max			= sidebar.data('max'),
				min			= sidebar.data('min'),
				stopper		= $('.persono_popup .stopper'),
				trigger		= $('.persono_fn_sidebar .nav__button'),
				indicator	= $('.persono_fn_sidebar .width_indicator');

			handle.on('mousedown', function (e) {
				isResizing 	= true;
				lastDownX 	= e.clientX;
				trigger.addClass('resize');
			});

			$(document).on('mousemove', function (e) {
				// we don't want to do anything if we aren't resizing.
				var lastDownX = e.clientX;
				if (!isResizing || lastDownX > max || lastDownX < min){return;}

				sidebar.css('width', lastDownX);
				content.css('padding-left', lastDownX);
				stopper.css('left', lastDownX);
				indicator.html(lastDownX+'px');
			}).on('mouseup', function () {
				// stop resizing
				isResizing = false;
				trigger.removeClass('resize');
			});
		},
		
		contact__submit: function(){
			$('.contact_form .submit').off().on('click', function(){
				var element		= $(this);
				var form		= element.closest('.contact_form');
				var name 		= form.find(".name").val();
				var email 		= form.find(".email").val();
				var tel 		= form.find(".tel").val();
				var message 	= form.find(".message").val();
				var spanSuccess	= form.find(".success");
				var success     = spanSuccess.data('success');
				var emailto     = form.data('email');

				spanSuccess.empty(); //To empty previous error/success message.
				//checking for blank fields	
				if(name === ''|| email === ''|| message === '' || emailto === ''){
					form.find('.empty_notice').slideDown(500).delay(2000).slideUp(500);
				}
				else{
					// Returns successful data submission message when the entered information is stored in database.
					$.post(
						"modal/contact.php",
						{
							ajax_name: name,
							ajax_email: email,
							ajax_emailto: emailto,
							ajax_tel: tel,
							ajax_message: message
						}, function(data) {
							spanSuccess.append(data);//Append returned message to message paragraph
							if(spanSuccess.find(".contact_error").length){
								spanSuccess.slideDown(500).delay(2000).slideUp(500);		
							}else{
								spanSuccess.append("<span class='contact_success'>" + success + "</span>");
								spanSuccess.slideDown(500).delay(4000).slideUp(500);
							}
							if(data===""){
								form[0].reset();//To reset form fields on success
							}
						}
					);
				}
				return false; 
			});
		},
		
		portfolio__category_filter: function(){
			if($().isotope){
				var items = $('.section_portfolio');
				items.each(function() {
					var thisItem = $(this);
					var list = thisItem.find('.list');
					var filter = thisItem.find('.portfolio_filter');

					list.isotope();
					// Isotope Filter 
					filter.find('a').off().on('click', function() {
						var selector = $(this).attr('data-filter');
						list = thisItem.find('.list');
						filter.find('a').removeClass('current');
						$(this).addClass('current');
						list.isotope({
							itemSelector: '.list_item',
							filter: selector,
							animationOptions: {
								duration: 750,
								easing: 'linear',
								queue: false
							}
						});
						return false;
					});

				});
			}
		},
		
		parallax: function(){
			if ($('#scene').length > 0) { 
				var scene 		= $('#scene').get(0);
				var parallax 	= new Parallax(scene, { 
					relativeInput: true,
				});
		  	}
		},
		
		service__masonry: function(){
			var $grid = $('.grid').isotope({
				itemSelector: '.grid-item',
				transitionDuration: 1000,
				getSortData: {
					weight: function( itemElem ) { // function
						var weight = $( itemElem ).find('.new_index').val();
						return parseFloat( weight.replace( /[\(\)]/g, '') );
					}
				}
			});
			$grid.isotope({ sortBy : 'weight' });
			$grid.isotope('updateSortData').isotope();
		},
		
		popup__open_by_index: function(parent,index,is_first_time,from){
			// some variables
			index 				= parseInt(index,10);
			var element 		= parent.find('.list_item:nth-child('+index+') .item');
			var popup			= $('.persono_popup');
			var allLiLength		= parent.find('.list_item').length;
			var contentDOM		= popup.find('.popup_in');
			var spentTime,visibilityTime;
			
			contentDOM.removeClass('opened');
			
			// if popup is not active
			if(is_first_time){
				var sidebar			= $('.persono_fn_sidebar');
				var leftOffset		= element.offset().left;
				var topOffset		= element.offset().top;
				var scrollTop		= $(document).scrollTop();
				var width			= element.outerWidth();
				var height			= element.outerHeight();
				var sidebarWidth	= sidebar.outerWidth();
				var image			= element.find('.gallery_img').data('image');
				
				// if clicked BLOG item
				if(from === 'blog'){
					width			= element.find('.img_holder').outerWidth();
					height			= element.find('.img_holder').outerHeight();
					image			= element.find('.blog_img').data('image');
				}
				if(sidebar.css('display') === 'none' || $('.sidebar-closed').length){
					sidebarWidth 	= 0;
				}

				var waitTime = 500,animateTime = 1500;

				// calculate top position of window, when clicked the item
				Persono.topPositon = $(window).scrollTop();
				$('body').addClass('modal-open').scrollTop(Persono.topPositon);
				
				// clear popup HTML
				contentDOM.html('');

				// activate popup with some additional css without transition
				popup.css({width: width + 'px',height: height + 'px',overflow: 'hidden',borderRadius: '5px',top:(topOffset-scrollTop) + 'px',left: leftOffset + 'px',transition: 'none'}).addClass('opened');
				
				// get clicked item's image and attach for popup background
				popup.find('.extra_img').css({backgroundImage: 'url('+image+')',transform: 'scale(1) translateY(0)',transition: 'none'});
				// remove additional css from popup
				setTimeout(function(){
					popup.css({
						transition: 'all '+animateTime+'ms ease',
						width: $(window).width() - sidebarWidth,
						left: sidebarWidth,
						top: 0,
						bottom: 0,
						height: '100%',
						borderRadius: 0,
					});
				},waitTime);
				
				// calculate spentTime for next animation
				spentTime 		= waitTime + animateTime;
				visibilityTime 	= 0;
			}else{
				spentTime 		= 0;
				visibilityTime 	= 1000;
			}
			
			setTimeout(function(){
				// now popup animation finished
				popup.addClass('transition-end');
				
				// return animation speed to close popup with animation
				popup.css({
					transitionDuration: '500ms',
					overflowY: 'scroll',
				});
				
				// remove background image from popup with some cool animation
				popup.find('.extra_img').css({transform: 'translateY(-100%) scale(0.9)',transition: 'all 500ms ease',});
				
				// get and append HTML into popup
				contentDOM.html(element.find('.hidden_info').html());
				
				// animate popup to starting position
				popup.animate({scrollTop: 0},visibilityTime);
				
				// remove opacity from new HTML
				setTimeout(function(){
					contentDOM.addClass('opened');
				},visibilityTime);
				
				
				// get and insert next & prev title
				var nextIndex,prevIndex,prevTitle,nextTitle;
				nextIndex 		= index+1;if(nextIndex>allLiLength){nextIndex=1;}
				prevIndex 		= index-1;if(prevIndex===0){prevIndex=allLiLength;}
				prevTitle 		= parent.find('.list_item:nth-child('+prevIndex+') .fn__title').text();
				nextTitle 		= parent.find('.list_item:nth-child('+nextIndex+') .fn__title').text();
				popup.find('.popup_nav .prev_post a').text(prevTitle).attr('title',prevTitle);
				popup.find('.popup_nav .next_post a').text(nextTitle).attr('title',nextTitle);
				popup.find('.popup_nav .prev_post input').val(prevIndex);
				popup.find('.popup_nav .next_post input').val(nextIndex);



				// recall some functions
				Persono.popup__actions();
				
			},spentTime);
		},
		
		service__open_by_index: function(parent,index){
			// the service that will be opened
			var element = parent.find('.list li:nth-child('+index+') .item');
			
			// check if panel is open
			if(parent.hasClass('opened')){
				if(element.hasClass('opened')){return false;}
				parent.find('.item.opened').removeClass('opened');
			}else{
				parent.addClass('opened');
			}
			element.addClass('opened');

			// some variables
			var leftContent 	= parent.find('.fn_inner');
			var allLiLength		= parent.find('.list li').length;

			// append content
			leftContent.addClass('ready').removeClass('opened').html('').html(element.find('.hidden_info').html());

			// preparing to change list order
			var li = element.closest('li');
			li.siblings().each(function(){
				var siblingLi = $(this);
				siblingLi.find('.new_index').val(siblingLi.find('.old_index').val()+1);
			});
			li.find('.new_index').val(1);

			// get ans insert next & prev title
			var currentIndex,nextIndex,prevIndex,prevTitle,nextTitle,prevSubTitle,nextSubTitle;
			currentIndex 	= parseInt(li.find('.old_index').val(),10);
			nextIndex 		= currentIndex+1;if(nextIndex>allLiLength){nextIndex=1;}
			prevIndex 		= currentIndex-1;if(prevIndex===0){prevIndex=allLiLength;}
			prevTitle 		= parent.find('.list li:nth-child('+prevIndex+') .fn__title').text();
			nextTitle 		= parent.find('.list li:nth-child('+nextIndex+') .fn__title').text();
			prevSubTitle 	= parent.find('.list li:nth-child('+prevIndex+') .counter').text();
			nextSubTitle 	= parent.find('.list li:nth-child('+nextIndex+') .counter').text();
			parent.find('.service_nav .prev a').text(prevSubTitle + '. '+ prevTitle);
			parent.find('.service_nav .next a').text(nextSubTitle + '. '+ nextTitle);
			parent.find('.service_nav .prev input').val(prevIndex);
			parent.find('.service_nav .next input').val(nextIndex);


			// open left panel
			setTimeout(function(){
				leftContent.addClass('opened');
			}, 100);

			// change list order
			Persono.service__masonry();

			// scroll to left panel
			$([document.documentElement, document.body]).animate({
				scrollTop: parent.offset().top - 50
			}, 1000);

			// recall some functions
			Persono.service__actions();
			Persono.title__animation();
		},
		
		service__actions: function(){
			// open service by navigation (Previous and Next buttons)
			$('.persono_services .service_nav a').off().on('click',function(){
				var element			= $(this);
				var targetIndex 	= parseInt(element.closest('li').find('input').val(),10);
				var parent			= element.closest('.persono_services');
				Persono.service__open_by_index(parent,targetIndex);
				return false;
			});
			
			// open service by itself
			$('.persono_services .item').off().on('click',function(){
				var element 		= $(this);
				var parent			= element.closest('.persono_services');
				var index			= parseInt(element.closest('li').find('.old_index').val(),10);
				Persono.service__open_by_index(parent,index);
				return false;
			});
			
			// close services
			$('.persono_services .fn__closer').off().on('click',function(){
				var element			= $(this);
				var parent			= element.closest('.persono_services');
				parent.removeClass('opened').find('.opened').removeClass('opened');
				parent.find('.fn_inner').removeClass('ready');
				parent.find('.list li').each(function(){
					var li			= $(this);
					li.find('.new_index').val(li.find('old_index').val());
				});
				// recall some functions
				Persono.service__actions();
				Persono.title__animation();
				Persono.service__masonry();
			});
		},
		
		popup__actions: function(){
			// open portfolio/blog by navigation (Previous and Next buttons)
			$('.persono_popup .post_nav a').off().on('click',function(){
				var element			= $(this);
				var targetIndex 	= parseInt(element.siblings('input').val(),10);
				var parent			= $('.popup_added');
				Persono.popup__open_by_index(parent,targetIndex,false);
				return false;
			});
			
			// open portfolio/blog by itself
			$('.portfolio_list .item').off().on('click',function(){
				var element 		= $(this);
				var parent			= element.closest('.portfolio_list');
				var index			= parseInt(element.closest('li').find('.index').val(),10);
				parent.addClass('popup_added');
				Persono.popup__open_by_index(parent,index,true);
				return false;
			});
			
			// open portfolio/blog by itself
			$('.section_blog .item').off().on('click',function(){
				var element 		= $(this);
				var parent			= element.closest('.list');
				var index			= parseInt(element.closest('li').find('.index').val(),10);
				parent.addClass('popup_added');
				Persono.popup__open_by_index(parent,index,true,'blog');
				return false;
			});
			
			// close popup
			$('.persono_popup .fn__closer').off().on('click',function(){
				$('.persono_popup').removeClass('opened transition-end').attr('data-address','');
				$('.popup_added').removeClass('popup_added');
				$('body').removeClass('modal-open');
				$(window).scrollTop(Persono.topPositon);
			});
		},
		
		popup__resize: function(){
			var popup = $('.persono_popup,.persono_popup .stopper');
			if(!popup.hasClass('transition-end')){
				return false;
			}
			var sidebar = $('.persono_fn_sidebar'),
				left	= sidebar.outerWidth();
			if(sidebar.css('display') === 'none' || $('.sidebar-closed').length){
				left = 0;
			}
			popup.css({
				left: left,
				width: 'auto'
			});
		},
		
		anchor__jump: function(){
			var minimumSpeed		= 300;
			var maximumSpeed		= 2000;
			$(".persono_fn_sidebar .navigation a,.persono_fn_mobilemenu ul a").off().on("click",function(){
				var e   			= $(this);
				var URL 			= e.attr("href");
				if(URL.indexOf("#") !== -1) {
					if($(URL).length){
						var topOffset 		= $(URL).offset().top;
						var scrollDocument 	= $(window).scrollTop();
						var distance 		= Math.abs(topOffset-scrollDocument);
						var speed 			= distance/2;
						speed = (speed > maximumSpeed) ? maximumSpeed: speed;
						speed = (speed < minimumSpeed) ? minimumSpeed: speed;
						$([document.documentElement, document.body]).animate({
							scrollTop: $(URL).offset().top
						}, speed);
						$('.persono_fn_mobilemenu .hamburger').removeClass('is-active');
						$('.persono_fn_mobilemenu .mobilemenu').removeClass('opened').slideUp(500);
						
						return false;
					}
				}
			});
		},
		
		resume__hover: function(){
			$('.section_resume li').on('mouseenter',function(){
				var element 		= $(this),
					parent			= element.closest('.resume_footer'),
					box				= parent.find('.hover_box');
				
				// calculation
				var topPosition 	= element.offset().top - parent.offset().top,
					elementHeight	= element.outerHeight();
				box.addClass('ready').css({height: elementHeight + 'px',transform:'translateY('+topPosition+'px)'});
			}).on('mouseleave',function(){
				$('.section_resume .hover_box').removeClass('ready').css({transform:'translateY(0px)'});
			});
		},
		
		navigation__scroll: function(){
			var sidebar = $('.persono_fn_sidebar'),
				H 		= sidebar.height(),
				ul		= sidebar.find('.navigation ul'),
				logoH	= sidebar.find('.logo').outerHeight(),
				copyH	= sidebar.find('.copyright').outerHeight(),
				over	= H-logoH-copyH,
				ulH		= ul.height();
			
			if(ulH < over){
				ul.css({paddingTop: (over-ulH)/2 + 'px', paddingBottom: (over-ulH)/2 + 'px'});
			}
			sidebar.find('.navigation').css({height: (H-logoH-copyH) + 'px'});
			if($().niceScroll){
				sidebar.find('.navigation').niceScroll({
					touchbehavior:false,
					cursorwidth:0,
					autohidemode:true,
					cursorborder:"0px solid #333"
				});
			}
			ul.addClass('ready');
		},
		
		title__animation: function(){
			$('.animated_text').each(function(i){
				var e = $(this);
				if(!e.hasClass('js_ready')){
					var t = e.find('.text').text();
					var html = '';
					$.each(t.split(''),function(i,e){
						if(i === 0){
							html += '<span class="word">';
						}
						if(e === ' '){
							html += '</span>&nbsp<span class="word">';
						}else{
							html += '<span class="char">'+e+'</span>';
						}
					});
					e.find('.text').html(html).attr('data-title',t);
				}
				e.addClass('js_ready');
				e.waypoint({handler: function(){Persono.animate__start(i,e);},offset:'85%'});
			});
		},
		getScrollbarWidth: function() {
			$('body').append('<style>body.modal-open{padding-right: '+(window.innerWidth - document.documentElement.clientWidth)+'px}</style>');
		},
		animate__stop: function(i,e){
			e.removeClass('ready');
			e.find('.char').removeClass('opened');
		},
		animate__start: function(i,e){
			e.addClass('ready');
			var speed 	= 45;
			var char	= e.find('.char');
			var newTime = 0;
			char.each(function(ii){
				var element = $(this);
				newTime	= (ii*speed) + 1500;
				setTimeout(function(){element.addClass('opened');},newTime);
			});
			setTimeout(function(){
				e.find('.text').text(e.find('.text').attr('data-title'));
			},newTime+speed+500);
		},
		
		img__to_svg: function(){
			$('img.persono_fn_svg').each(function(){
				var img 		= $(this);
				var imgClass	= img.attr('class');
				var imgURL		= img.attr('src');

				$.get(imgURL, function(data) {
					var svg 	= $(data).find('svg');
					if(typeof imgClass !== 'undefined') {
						svg 	= svg.attr('class', imgClass+' replaced-svg');
					}
					img.replaceWith(svg);

				}, 'xml');

			});	
		},

	  	background__image: function(){
			var div = $('*[data-image]');
			div.each(function(){
				var element = $(this);
				var attrBg	= element.attr('data-image');
				var dataBg	= element.data('image');
				if(typeof(attrBg) !== 'undefined'){
					element.css({backgroundImage:'url('+dataBg+')'});
				}
			});
		},
    
  	};
  	
	
	// READY Functions
	$(document).ready(function(){Persono.init();});
	
	// RESIZE Functions
	$(window).on('resize',function(){
		Persono.navigation__scroll();
		Persono.popup__resize();
		Persono.portfolio__category_filter();
	});
	
	// LOAD Functions
	$(window).on('load',function(){
		
		setTimeout(function(){
			Persono.portfolio__category_filter();
		},10);
	});
	
	// SCROLL Functions
	$(window).on('scroll',function(){
		
	});
  
})(jQuery);