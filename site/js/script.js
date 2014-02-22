$(document).ready(function(){
	var devicewidth= $(window).width();
	var deviceheight= $(document).height() - 500;
	if( devicewidth < 600 ){
		$("#subs").remove();
		$("body").append('<ul id="subs"><li id="LightingStrike" class="active"><span>LightingStrike</span></li><li id="redFlames"><span>redFlames</span></li><li id="BasicYellowSub"><span>BasicYellowSub</span></li></ul>');
	}
	for(i=0; i<9; i++){
		$('#nuages').append('<div class="nuage" style="top:'+Math.floor(Math.random() * 400)+'px; left: '+Math.floor(Math.random() * devicewidth)+'px;"></div>');
	}
	for(i=0; i<6; i++){
		$('#container').append('<div class="poisson" style="top:'+Math.floor(Math.random() * deviceheight)+'px; left: '+Math.floor(Math.random() * devicewidth)+'px;"></div>');
	}
	
	autoWeather();
	var haut = 624;
		var moit = 	$(window).height() / 2;
		var dif = moit - haut;
		var pal = dif / 20;
	
	$(document).scroll( function() {
		var possub = $(document).scrollTop() + moit;
		if( devicewidth < 600 ){
			var tier = $(window).height() / 3;
			var dtier = tier * 2;
			var mtier = tier / 2;
			var atier = mtier + dtier;
			var possub = $(document).scrollTop() + dtier;
		}
		if($(document).scrollTop() <= 340){
			
		    $("#sub .bulle").css('display', 'none');
		    if($(document).scrollTop() >= 100 && $("#sub .sub").hasClass('wb') ){
			    $("#sub").css('top', '600px');
			    $("#sub .sub").removeClass('wb');
			     $("#sub").css('position','absolute');
		    }
		    if($(document).scrollTop() <= 339 && !$("#sub .sub").hasClass('wb') ){
			    $("#sub").css('top', '524px');
		    	if( devicewidth < 600 ){
			    	$("#sub").css('top', '439px');
		    	}
			    $("#sub .sub").addClass('wb');
			     $("#sub").css('position','absolute');
		    }
		   
	    }
	    else{
		    $("#sub").css({
		    'position' : 'absolute',
		    'top' : possub
		    });
		    $("#sub .bulle").css('display', 'block');
	    }
    });
    function nuage1(){
     $(".nuage").each(function(i,el){
     	if(!$(this).hasClass("move")){
	     	 var posx = $(this).offset().left + 180;
	     	 var timex = posx / 23;
	     	 var timex = timex * 1000;
	     	 $(this).addClass("move");
		     $(this).animate({left:"-180px"},timex,"linear");
	    }
     })
	 
	}
	nuage1();
    function nuage(){
    	if($('.nuage').first().offset().left < -150){
		    $('#nuages').append('<div class="nuage" style="top:'+Math.floor(Math.random() * 400)+'px; left:'+devicewidth+'px;"></div>');
		    if($("header").hasClass("night")){$(".nuage").css("opacity", ".25");}
		    $('.nuage').first().fadeOut();
		    
		    function removenu(){
			    $('.nuage').first().remove();
		    }
		    setTimeout(removenu(), 3000);
		    nuage1();
	    }
    }
    setInterval(nuage, 3000);
    function poisson1(){
     $(".poisson").each(function(i,el){
     	if(!$(this).hasClass("move")){
	     	 var posx = $(this).offset().left + 210;
	     	 var timex = posx / 43;
	     	 var timex = timex * 1000;
	     	 $(this).addClass("move");
		     $(this).animate({left:"-210px"},timex,"linear");
	    }
     })
	 
	}
	poisson1();
    function poisson(){
    	if($('.poisson').first().offset().left < -190){
		    $('#container').append('<div class="poisson" style="top:'+Math.floor(Math.random() * deviceheight)+'px; left:'+devicewidth+'px;"></div>');
		    $('.poisson').first().fadeOut();
		    
		    function removenu(){
			    $('.poisson').first().remove();
		    }
		    setTimeout(removenu(), 1000);
		    poisson1();
	    }
    }
    setInterval(poisson, 1000);
    function removeactive(){
	    $("#subs li").each(function(){
		    if($(this).hasClass("active")){
			    $(this).removeClass("active");
		    }
	    })
    }
    $("#submarine_04_MT-19214").click(function(){
	    $("#sub .sub").css("background", "url(images/submarine_04_MT-19214.png) center center no-repeat");
	    $("#sub .sub").css("background-size", "150px");
	    removeactive();
	    $("#submarine_04_MT-19214").addClass("active");
    });
    $("#LightingStrike").click(function(){
	    $("#sub .sub").css("background", "url(images/submarine_01_LightingStrike.png) center center no-repeat");
	    $("#sub .sub").css("background-size", "150px");
	    removeactive();
	    $("#LightingStrike").addClass("active");
    });
    $("#redFlames").click(function(){
	    $("#sub .sub").css("background", "url(images/submarine_02_redFlames.png) center center no-repeat");
	    $("#sub .sub").css("background-size", "cover");
	    removeactive();
	    $("#redFlames").addClass("active");
    });
    $("#BasicYellowSub").click(function(){
	    $("#sub .sub").css("background", "url(images/submarine_03_BasicYellowSub.png) center center no-repeat");
	    $("#sub .sub").css("background-size", "160px");
	    removeactive();
	    $("#BasicYellowSub").addClass("active");
    });
    function removeactivew(){
	    $("#weather li").each(function(){
		    if($(this).hasClass("active")){
			    $(this).removeClass("active");
		    }
	    })
    }
    $("#clicknight").click(function(){
	    night();
	    removeactivew();
	    $("#clicknight").addClass("active");
    });
    $("#clickcrep").click(function(){
	    crepuscule();
	    removeactivew();
	    $("#clickcrep").addClass("active");
    });
    $("#clickday").click(function(){
	    day();
	    removeactivew();
	    $("#clickday").addClass("active");
    });
    $("#clickaube").click(function(){
	    aube();
	    removeactivew();
	    $("#clickaube").addClass("active");
    });
    $("#auto").click(function(){
	    autoWeather();
	    removeactivew();
	    $("#auto").addClass("active");
    })
    if($("header").hasClass("night")){
	    console.log("ça brille ici?!");
	    function shiningstar(){
		    var numstar = Math.floor(Math.random() * 209);
		    $(".star:nth-child("+numstar+")").animate({opacity:"1"},400,"linear");
		    console.log("ça brille!");
	    }
	    console.log("ça brille ici?!");
	    setInterval(shiningstar, 100);
    }
    function autoWeather(){
	    var date = new Date();
	    var heure = date.getHours();
	    if( heure >= 8 && heure < 18){
		    day();
	    }
	    if( heure >= 18 && heure < 22){
		    crepuscule();
	    }
	    if( heure >= 22 || heure < 6){
		    night();
	    }
	    if( heure >= 6 && heure < 8){
		    crepuscule();
	    }
    }
    function night(){
    	if( !$("header").hasClass("night")){
		    $("header").css("background", "-webkit-linear-gradient(#1c1c1c 0%, #525252 57.68%)");
		    $(".nuage").css("opacity", ".35");
		    $('.star').remove();
		    for(i=0; i<409; i++){
				$('header').append('<div class="star" style="top:'+Math.floor(Math.random() * 600)+'px; left: '+Math.floor(Math.floor(Math.random() * devicewidth) - 20)+'px; opacity:'+Math.random()+';"></div>');
			}
			if($("header").hasClass("day")){
				$("header").removeClass("day");
			}
			if($("header").hasClass("crepuscule")){
			$("header").removeClass("crepuscule");
		}
		if($("header").hasClass("aube")){
			$("header").removeClass("aube");
		}
			$("header").addClass("night");
		}
    }
    function crepuscule(){
    	if( !$("header").hasClass("crepuscule")){
		    $("header").css("background", "-webkit-linear-gradient(#2a629d 0%, #f8a3ff 81.79%)");
		    $(".nuage").css("opacity", ".85");
		    $(".nuage").css("background", "url(images/nuageaube.png) no-repeat");
		    $(".nuage").css("background-size", "cover");
		    $('.star').remove();
		    for(i=0; i<109; i++){
				$('header').append('<div class="star" style="top:'+Math.floor(Math.random() * 600)+'px; left: '+Math.floor(Math.floor(Math.random() * devicewidth) - 20)+'px; opacity:'+Math.random()*0.5+';"></div>');
			}
			$(".star").css("opacity", ".25");
			if($("header").hasClass("day")){
				$("header").removeClass("day");
			}	
			if($("header").hasClass("night")){
				$("header").removeClass("night");
			}
		if($("header").hasClass("aube")){
			$("header").removeClass("aube");
		}
			$("header").addClass("crepuscule");
		}
    }
    function aube(){
    	if( !$("header").hasClass("aube")){
		    $("header").css("background", "-webkit-linear-gradient(top, #00aeff 0%,#ed9017 60%)");
		    
		    $(".nuage").css("opacity", ".85");
		    $(".nuage").css("background", "url(images/nuageaube.png) no-repeat");
		    $(".nuage").css("background-size", "cover");
		    $('.star').remove();
		    for(i=0; i<99; i++){
				$('header').append('<div class="star" style="top:'+Math.floor(Math.random() * 600)+'px; left: '+Math.floor(Math.floor(Math.random() * devicewidth) - 20)+'px; opacity:'+Math.random()*0.3+';"></div>');
			}
			$(".star").css("opacity", ".15");
			if($("header").hasClass("day")){
				$("header").removeClass("day");
			}	
			if($("header").hasClass("night")){
				$("header").removeClass("night");
			}
				
			if($("header").hasClass("crepuscule")){
				$("header").removeClass("crepuscule");
			}
			$("header").addClass("aube");
		}
    }
    function day(){
	    $("header").css("background", "-webkit-linear-gradient(#5c90cb 0%, #c2dbff 63.44%, #def1c3 100%)");
	    $(".nuage").css("opacity", "1");
	    $('.star').remove();
		if($("header").hasClass("crepuscule")){
			$("header").removeClass("crepuscule");
		}
		if($("header").hasClass("night")){
			$("header").removeClass("night");
		}
		if($("header").hasClass("aube")){
			$("header").removeClass("aube");
		}
		$("header").addClass("day");
    }
});