<!--// 저작권 정박사닷컴 www.jungbaksa.com 2015. 01. 10 ~ //-->
(function($){
    $(function(){
	  $(document).ready(function() {
		$(document).on("click", ".push_sms", function() {
			var now = new Date();
			len = $("input[name='cart[]']").size();
			list = "";
			cnt = 0;
			for (i=0;i<len;i++) {
				if ($("input[name='cart[]']").eq(i).is(":checked")) {
					cnt++;
					list += $("input[name='cart[]']").eq(i).attr("data-number_id")+"|@|";
				}
			}
			text = $(this).attr("data-result");

			$("body").append('<div id="push_form_box" style="display:block;background:#FFF;padding:20px; border:1px #e0e0e0 solid;position:absolute;top:'+($(this).offset().top - 40)+'px;left:50px; z-index:9999;"></div>');
			$.get("/@cs/message/push_form.php?list="+list+"&timenow="+now.getTime(), function (data) {
				$("#push_form_box").html(data);
				$(".close_push_form").on("click", function () {
					$("#push_form_box").remove();
				});
				$(".select_sms_group").on("click", function () {
					if (cnt == 0) {
						alert("선택한 내용이 없습니다.");
						return false;
					}
					$.post("/@cs/message/save_group.php", {
							"group" : $("#sms_group").val(),
							"list" : list
						}, function (data) { $("#push_form_box").remove(); alert(data);}
					);
				});
				$(".all_sms_group").on("click", function () {
					$.post("/@cs/message/save_result_group.php", {
							"group" : $("#sms_group").val(),
							"text" : text
						}, function (data) { $("#push_form_box").remove(); alert(data);}
					);
				});

			});
			
		});

		$(document).on("click", ".get_address", function() {
			var now = new Date();
			var width;
			if ($(window).width() < 500) width=($(window).width() * 1) - 10;
			else width = 500;
			$("body").append('<div id="shipping_address_box" style="display:block;position:absolute;top:'+($(this).offset().top - 200)+'px;left:0px; height:412px; width:'+width+'px; z-index:9999;"></div>');
				
			$.get("/@cs/get_address.php?number_id="+$(this).attr("data-number_id")+"&timenow="+now.getTime(), function (data) {
				$("#shipping_address_box").html(data);
				$(".close_address").on("click", function () {
					$("#shipping_address_box").remove();
				});
				$(".list_of_zip").on("click", function () {
					var address = $(this).attr("data");
					if (address != null) {
						$("#shipping_address_box").remove();
						var temp = address.split("|@|");
						$(".drj_addr_name").val(temp[0]);
						$(".drj_addr_tel1").val(temp[1]);
						$(".drj_addr_tel2").val(temp[2]);
						$(".drj_addr_first").val(temp[3]);
						$(".drj_addr_second").val(temp[4]);
						$(".daum-address-first").val(temp[3]);
						$(".daum-address-second").val(temp[4]);
					}
				});
			});
		});

		$(document).on("click", ".search_member", function() {
			var now = new Date();
			var width, obj = $(this);
			if ($(window).width() < 500) width=($(window).width() * 1) - 10;
			else width = 500;
			
			$("body").append('<div id="search-member-box" style="display:block;position:absolute;top:'+($(this).offset().top + 20)+'px;left:0px; height:412px; width:'+width+'px; z-index:9999;"></div>');

			$.get("/@cs/search_member.php?keyword="+$(this).prev().val()+"&timenow="+now.getTime(), function (data) {
				$("#search-member-box").html(data);
				$(".close_address").on("click", function () {
					$("#search-member-box").remove();
				});
				$(".list_of_member").on("click", function () {
					var info = $(this).attr("data-info");
					if (info != null) {
						$("#search-member-box").remove();
						var temp = info.split("|@|");
						obj.prev().val(temp[0]).attr("data-info", info);
						obj.next().find(".user_name").html(temp[1]);
						if (obj.attr("callback")) eval(obj.attr("callback")+"();");
					}
				});
			});
		});


	  });
    });
})(jQuery);

<!--// 저작권 정박사닷컴 www.jungbaksa.com 2010. 05. 01 ~ //-->

(function($){
	$(function(){
	$(document).ready(function() {
		$.ajaxSetup({
   			global: false
		});

		$(document).on("click", ".drj_addr_first", function () {
			var ret = window.open("", "krZip", "width=510,height=540,scroll=no");
			if (ret==null) {
				alert("현재 홈페이지의 팝업제한을 해제해 주세요!");
				return;
			}
			ret.location.href="/Kr_address";
		});

		$(document).off("click", "#daum-btnCloseLayer");
		$(document).on("click", "#daum-btnCloseLayer", function () {
			$("#daum-wrap").remove();
		});

		$(document).off("click", ".daum-address-first");
		$(document).on("click", ".daum-address-first", function () {
			var currentScroll = Math.max(document.body.scrollTop, document.documentElement.scrollTop);
			$(".daum-address-first").after('<div id="daum-wrap" style="display:block;border:1px solid;width:100%;height:500px;margin:5px 0;position:relative;-webkit-overflow-scrolling:touch;"><img src="//i1.daumcdn.net/localimg/localimages/07/postcode/320/close.png" id="daum-btnCloseLayer" style="cursor:pointer;position:absolute;right:0px;top:-1px" alt="접기 버튼"></div>');
			new daum.Postcode({
				oncomplete: function(data) {
					$(".daum-address-first").val(data.address + " ("+data.postcode+")");
					$("#daum-wrap").remove();
					$(".daum-address-second").focus();
				},
				onresize : function(size) {
					$("#daum-wrap").css("height", size.height + "px");
				},
				width : '100%',
				height : '100%'
			}).embed($("#daum-wrap").get(0));
		});

		$(document).on("keyup", ".type_email", function () {
			var obj = $(this);
			obj.prev().prev().val('F');
			if (obj.val().length <= 4) {
				obj.next().html("");
				return false;
			}
			if (obj.val().match(/^(\w+)@(\w+)[.](\w+)$/ig) == null && obj.val().match(/^(\w+)@(\w+)[.](\w+)[.](\w+)$/ig) == null) {
				obj.next().html("<font color='red'>E-mail 주소 형식에 맞지 않습니다.</font>");
				return false;
			}
			else {
				if (obj.attr("exec_function")) {
					var now = new Date();
					obj.next().load(obj.attr("exec_function")+"?exec_mode=check_email&email="+ajax_encoding(obj.val())+"&old_email="+ajax_encoding(obj.prev().val())+"&check_id="+obj.prev().prev().attr("id")+"&timenow="+now.getTime());
				}
				else {
					obj.prev().prev().val('T');
					obj.next().html("<font color='blue'>사용가능한 이메일입니다.</font>");
				}
			}
		});

		$(document).on("focusout", ".type_email2", function () {
			var obj = $(this);
			if (obj.val().match(/^(\w+)@(\w+)[.](\w+)$/ig) == null && obj.val().match(/^(\w+)@(\w+)[.](\w+)[.](\w+)$/ig) == null) {
				alert("E-mail 주소 형식에 맞지 않습니다.");
				obj.focus().val("");
				return false;
			}
		});

		$(document).on("keyup", ".type_number_str", function () {
			var obj = $(this);
			obj.val(obj.val().replace(/[^0-9\+\-]/g, ''));
		});

		$(document).on("focusout", ".type_number_str", function () {
			var obj = $(this);
			if (!obj.val()) return;
		});

		$(document).on("keyup", ".type_number", function () {
			var obj = $(this);
			obj.val(obj.val().replace(/[^0-9\+\-]/g, ''));
		});

		$(document).on("focusout", ".type_number", function () {
			var obj = $(this);
			if (!obj.val()) return;
			var regExp = /^[+-]?\d*(\.?\d*)$/;
			if (!regExp.test(obj.val())) {
				alert("유효 하지 않은 숫자입니다.");
				obj.focus();
				obj.val("");
				return false;
			}
		});

		$(document).on("keyup", ".type_float", function () {
			var obj = $(this);
			obj.val(obj.val().replace(/[^0-9\.\+\-]/g, ''));
		});

		$(document).on("focusout", ".type_float", function () {
			var obj = $(this);
			if (!obj.val()) return;
			var regExp = /^[+-]?\d*(\.?\d*)$/;
			if (!regExp.test(obj.val())) {
				alert("유효 하지 않은 숫자입니다.");
				obj.focus();
				obj.val("");
				return false;
			}
		});
	
		$(document).on("focusout", ".type_date", function () {
			var obj = $(this);
			if (!obj.val()) return;
			var regExp = /^\d{4}-\d{2}-\d{2}$/;
			if (!(regExp.test(obj.val()))) {
				alert("유효 하지 않은 날짜형식 입니다.");
				obj.focus();
				obj.val("");
				return false;
			}
		});

		$(document).on("keyup", ".type_date", function (event) {
			var keyCode = 0;
			if(event)
				keyCode = event.charCode ? event.charCode : event.keyCode;
//			var tel_prefix_arr = ["060", "080"]; // 02는 별도
			var obj = $(this);
			var str = obj.val().replace(/-/g,"").replace(/\./g,"").replace(/ /g,"");
			var dateLength = str.length;
			
			if(dateLength < 4) {
				obj.val(str);
				return true;
			}

			if(str.length == 4 && keyCode != 8) {
				if (str < 0) {obj.val(""); return; }
				obj.val(str+"-"); 
			}
			else if(str.length >= 5 && str.length <= 6 && keyCode != 8) {
				var month = str.substring(4,6);
				if (month.length == 2 && parseInt(month, 10) < 1) month = 01;
				if (month.length == 2 && parseInt(month, 10) > 12) { month = 12; }
				obj.val(str.substring(0,4)+"-"+month);
			}
			else if(str.length >= 7) {
				var day = str.substring(6,8);
				if (day.length == 2 && parseInt(day, 10) < 1) day = 01;
				if (day.length == 2 && parseInt(day, 10) > 31) day = 31;
				obj.val(str.substring(0,4)+"-"+str.substring(4,6)+"-"+day);
			}
			
			return;
			
		});

		$(document).on("focusout", ".type_month", function () {
			var obj = $(this);
			if (!obj.val()) return;
			var regExp = /^\d{4}-\d{2}$/;
			if (!(regExp.test(obj.val()))) {
				alert("유효 하지 않은 날짜형식 입니다.");
				obj.focus();
				obj.val("");
				return false;
			}
		});

		$(document).on("keyup", ".type_month", function (event) {
			var keyCode = 0;
			if(event)
				keyCode = event.charCode ? event.charCode : event.keyCode;
			var obj = $(this);
			var str = obj.val().replace(/-/g,"").replace(/\./g,"").replace(/ /g,"");
			var dateLength = str.length;
			
			if(dateLength < 4) {
				obj.val(str);
				return true;
			}

			if(str.length == 4 && keyCode != 8) {
				if (str < 0) {obj.val(""); return; }
				obj.val(str+"-"); 
			}
			else if(str.length >= 5 && str.length <= 6 && keyCode != 8) {
				var month = str.substring(4,6);
				if (month.length == 2 && parseInt(month, 10) < 1) month = 01;
				if (month.length == 2 && parseInt(month, 10) > 12) { month = 12; }
				obj.val(str.substring(0,4)+"-"+month);
			}
			
			return;
			
		});

// 카드번호(16자리)
		$(document).on("focusout", ".type_card", function () {
			var obj = $(this);
			if (!obj.val()) return;
			var regExp = /^\d{4}-\d{4}-\d{4}-\d{4}$/;
			if (!(regExp.test(obj.val()))) {
				alert("유효 하지 않은 카드번호형식 입니다.");
				obj.focus();
				obj.val("");
				return false;
			}
		});

		$(document).on("keyup", ".type_card", function (event) {
			var keyCode = 0;
			if(event)
				keyCode = event.charCode ? event.charCode : event.keyCode;
			var obj = $(this);
			var str = obj.val().replace(/-/g,"").replace(/\./g,"").replace(/ /g,"");
			var dateLength = str.length;
			
			if(dateLength < 4) {
				obj.val(str);
				return true;
			}

			if(str.length == 4 && keyCode != 8) {
				if (str < 0) {obj.val(""); return; }
				obj.val(str+"-"); 
			}
			else if(str.length >= 5 && str.length <= 8 && keyCode != 8) {
				var day = str.substring(4,8);
				obj.val(str.substring(0,4)+"-"+day);
			}
			else if(str.length >= 9 && str.length <= 12 && keyCode != 8) {
				var day = str.substring(8,12);
				obj.val(str.substring(0,4)+"-"+str.substring(4,8)+"-"+day);
			}
			else if(str.length >= 13) {
				var day = str.substring(12,16);
				obj.val(str.substring(0,4)+"-"+str.substring(4,8)+"-"+str.substring(8,12)+"-"+day);
			}
			
			return;
			
		});

// 일반전화		
		$(document).on("keypress", ".type_tel", function (event) {
			var obj = $(this);
			var sign_number_arr = [8,13,45,48,49,50,51,52,53,54,55,56,57];
			var keyCode = 0;
			if(event)
				keyCode = event.charCode ? event.charCode : event.keyCode;
			if (!(keyCode && $.inArray(Number(keyCode), sign_number_arr) >= 0)) { // up arrow
				event.preventDefault();
			}
		});

	
		$(document).on("focusout", ".type_tel", function () {
			var obj = $(this);
			if (!obj.val()) return;
			var regExp = /^\d{2,3}-\d{3,4}-\d{4}$/;
			var regExp2 = /^1\d{3}-\d{4}$/;
			if (!(regExp.test(obj.val()) || regExp2.test(obj.val()))) {
				alert("유효 하지 않은 전화 번호입니다.");
				obj.focus();
				obj.val("");
				return false;
			}
		});

		$(document).on("keyup", ".type_tel", function (event) {
			var keyCode = 0;
			if(event)
				keyCode = event.charCode ? event.charCode : event.keyCode;
//			var tel_prefix_arr = ["060", "080"]; // 02는 별도
			var obj = $(this);
			var str = obj.val().replace(/-/g,"");
			var phoneLength = str.length;
			
			
			if(phoneLength < 2) {
				obj.val(str);
				return true;
			}
		
			// 집 전화 폰일 경우의 수이다.
			if(str.indexOf("02") == 0 && keyCode != 8) {
				if(str.length == 2)
					obj.val(str+"-");
				else if(str.length == 5 && keyCode != 8)
					obj.val(str.substring(0,2)+"-"+str.substring(2,5)+"-");
				else if(str.length == 9 && keyCode != 8)
					obj.val(str.substring(0,2)+"-"+str.substring(2,5)+"-"+str.substring(5));
				else if(str.length == 10 && keyCode != 8)
					obj.val(str.substring(0,2)+"-"+str.substring(2,6)+"-"+str.substring(6));
				else if(str.length > 10)
				{
					obj.val(str.substring(0,10));
					obj.val(str.substring(0,2)+"-"+str.substring(2,6)+"-"+str.substring(6,10));
				}
			}
			else if(str.indexOf("15") == 0 || str.indexOf("16") == 0) {
				if(str.length == 4 && keyCode != 8)
					obj.val(str+"-");
				else if(str.length == 5 && keyCode != 8)
					obj.val(str.substring(0,4)+"-"+str.substring(4,8));
				else if(str.length > 8) {
					obj.val(str.substring(0,8));
					obj.val(str.substring(0,4)+"-"+str.substring(4,8));
				}
			}
			else {
				if(str.length == 3 && keyCode != 8)
					obj.val(str+"-");
				else if(str.length == 6 && keyCode != 8)
					obj.val(str.substring(0,3)+"-"+str.substring(3,6)+"-");
				else if(str.length == 10 && keyCode != 8)
					obj.val(str.substring(0,3)+"-"+str.substring(3,6)+"-"+str.substring(6));
				else if(str.length == 11 && keyCode != 8)
					obj.val(str.substring(0,3)+"-"+str.substring(3,7)+"-"+str.substring(7));
				else if(str.length > 11) {
					obj.val(str.substring(0,11));
					obj.val(str.substring(0,3)+"-"+str.substring(3,7)+"-"+str.substring(7,11));
				}
			}
			
			return;
			
		});

// 핸드폰		
		$(document).on("keypress", ".type_mobile", function (event) {
			var obj = $(this);
			var sign_number_arr = [8,13,45,48,49,50,51,52,53,54,55,56,57];
			var keyCode = 0;
			if(event)
				keyCode = event.charCode ? event.charCode : event.keyCode;
			if (!(keyCode && $.inArray(Number(keyCode), sign_number_arr) >= 0)) { // up arrow
				event.preventDefault(); // 키를 없앤다.
			}
		});

		$(document).on("focusout", ".type_mobile", function () {
			var obj = $(this);
			if (!obj.val()) return;
			var regExp = /01[0-9]-[0-9]{3,4}-[0-9]{4}/;
			if (!regExp.test(obj.val())) {
				alert("유효 하지 않은 휴대폰 번호입니다.");
				obj.focus();
				obj.val("");
				return false;
			}
		});

		$(document).on("keyup", ".type_mobile", function (event) {
			var keyCode = 0;
			if(event)
				keyCode = event.charCode ? event.charCode : event.keyCode;
			var tel_prefix_arr = ["010", "011", "012", "013", "014", "015", "016", "017", "018", "019"];
			var obj = $(this);
			var str = obj.val().replace(/-/g,"");
			var phoneLength = str.length;
			
			
			if(phoneLength < 3) {
				obj.val(str);
				return true;
			}
			
			if (phoneLength >= 3 && $.inArray(str.substring(0,3), tel_prefix_arr) < 0) { // up arrow
				alert("받는 번호 앞자리가 잘못되었습니다.");
				obj.focus();
				obj.val("");
				return false;
			}
		
			if(str.length == 3 && keyCode != 8)
				obj.val(str+"-");
			else if(str.length == 6 && keyCode != 8)
				obj.val(str.substring(0,3)+"-"+str.substring(3,6)+"-");
			else if(str.length == 10 && keyCode != 8)
				obj.val(str.substring(0,3)+"-"+str.substring(3,6)+"-"+str.substring(6));
			else if(str.length == 11 && keyCode != 8)
				obj.val(str.substring(0,3)+"-"+str.substring(3,7)+"-"+str.substring(7));
			else if(str.length > 11) {
				obj.val(str.substring(0,11));
				obj.val(str.substring(0,3)+"-"+str.substring(3,7)+"-"+str.substring(7,11));
			}
			
			return;
			
		});

// 주민번호		
		$(document).on("keypress", ".type_jumin", function (event) {
			var obj = $(this);
			obj.prev().val("F");
			var sign_number_arr = [8,13,48,49,50,51,52,53,54,55,56,57]; // BS 0 ~ 9
			var keyCode = 0;
			if(event)
				keyCode = event.charCode ? event.charCode : event.keyCode;
			if (!(keyCode && $.inArray(Number(keyCode), sign_number_arr) >= 0)) { // up arrow
				event.preventDefault();
			}
		});

		$(document).on("focusout", ".type_jumin", function () {
			var pass = true;
			var obj = $(this);
			if (!obj.val()) return;
			var regExp = /[0-9]{2}(0[1-9]|1[012])(0[1-9]|1[0-9]|2[0-9]|3[01])-?[012349][0-9]{6}/;
			if (regExp.test(obj.val())) { // true
				if (obj.attr("jumin_match") == 1 && !check_juminno(obj.val().replace(/-/g,""))) pass = false;// jumin_match = 1 주민번호 유효성 검사
			}
			else pass = false; 

			if (obj.attr("jumin_match") == 0) pass = true;
			
			if (!pass) {
				alert("유효 하지 않은 주민번호입니다.");
				obj.focus();
				obj.val("");
				return false;
			}
			else {
				obj.prev().val("T");
				return true;
			}
		});

		$(document).on("keyup", ".type_jumin", function (event) {
			var keyCode = 0;
			if(event)
				keyCode = event.charCode ? event.charCode : event.keyCode;
			var obj = $(this);
			var str = obj.val().replace(/-/g,"");
			var strlength = str.length;
			
			
			if(strlength < 1) {
				obj.val(str);
				return true;
			}
			
			if(str.length <= 6 && keyCode != 8)
				obj.val(str.substring(0,6));
			else if(str.length == 6 && keyCode != 8)
				obj.val(str.substring(0,6)+"-");
			else if(str.length > 6 && keyCode != 8)
				obj.val(str.substring(0,6)+"-"+str.substring(6,13));
			
			return;
			
		});

<!--// phpschool api key //-->
<!--// 저작권 정박사닷컴 www.jungbaksa.com 2014. 01. 01 ~ //-->
		$(document).on("click keyup", ".type_address", function () {
			var now = new Date();
			var nodeName = "";
			var $this = $(this);
			var old_display = $(this).css("display");
			var old_width = parseInt($(this).css("width"), 10);
			try {
				if ($this.next().get(0).nodeName == "BR") {
					nodeName = "br";
					$this.next().remove();
				}
			}
			catch(e) {}
			$(this).css("display", "none").after("<div id='drjzip_box'><input type='text' value='' id='get_drjzip' style='width:200px;ime-mode:active;'><span class='btn'><input type='button' value='검색' id='btn_getzip'></span><span class='btn'><input type='button' value='취소' class='btn_closezip'></span><br>*읍/면/동 과 도로명을 입력후 검색버튼을 누르세요!</div>");
			$("#get_drjzip").focus();
			$(".btn_closezip").on("click", function () {
				$("#drjzip_box").remove();
				$this.css("display", old_display);
				if (nodeName == "br") { $this.after("<br>"); $this.next().next().focus();}
				else { $this.next().focus(); }
			});
			
			$("#get_drjzip").on("keypress", function (event) {
				if (Number(event.keyCode) == 13) {$("#btn_getzip").trigger("click");event.preventDefault();}
			});
				
			$("#btn_getzip").on("click", function () {
				$("#drjzip_box").css("display", "none").after("<div id='drjzip_select_box'><select name='drjzip_select' id='drjzip_select'></select><span class='btn'><input type='button' value='취소' class='btn_closezip'></span></div>");
				var loc = window.location;
				$.getJSON("/_direct/_include/load_zip.php?address="+encodeURIComponent($("#get_drjzip").val())+"&callback=?", function(data) {
					if (data == null) {
						$("#drjzip_select").append('<option value="">검색결과가 없습니다.</option>');
					}
					else {
						if (!data[0][1]) {
							$("#drjzip_select").append('<option value="">'+data[0][0]+'</option>');
						}
						else {
							$("#drjzip_select").append('<option value="">※주소를 선택하세요</option>');
							for(var i = 0; i < data.length; i++) {
								$("#drjzip_select").append('<option value="'+data[i][1]+'">'+data[i][0]+"</option>");
							}
						}
					}
					$("#drjzip_select").css("width", old_width - 50);
				});
				
				$(".btn_closezip").on("click", function () {
					$("#drjzip_select_box").remove();
					$("#drjzip_box").remove();
					$this.css("display", old_display);
					if (nodeName == "br") { $this.after("<br>"); $this.next().next().focus();}
					else { $this.next().focus(); }
				});
				
				$("#drjzip_select").on("change", function () {
					$("#drjzip_select_box").remove();
					$("#drjzip_box").remove();
					$this.val($(this).val()).css("display", old_display);
					if (nodeName == "br") { $this.after("<br>"); $this.next().next().focus();}
					else { $this.next().focus(); }
				});
			});
		});

/*
		$(document).on("click keyup", ".type_address", function () {
			var now = new Date();
			var nodeName = "";
			var $this = $(this);
			var old_display = $(this).css("display");
			var old_width = parseInt($(this).css("width"), 10);
			try {
				if ($this.next().get(0).nodeName == "BR") {
					nodeName = "br";
					$this.next().remove();
				}
			}
			catch(e) {
			}
			$(this).after("<div style='position:relative;width:0px;height:0;z-index:99999'><div id='drjzip_box' style='top:-20px;position:absolute;background:white;border:1px solid black; padding:5px 20px; width:300px;'><input type='text' value='' id='get_drjzip' style='width:80px;ime-mode:active;'><span class='btn'><input type='button' value='검색' id='btn_getzip'></span><span class='btn'><input type='button' value='취소' class='btn_closezip'></span><br>*읍/면/동 이름을 입력후 검색버튼을 누르세요!</div></div>");
			$("#get_drjzip").focus();
			$(".btn_closezip").on("click", function () {
				$("#drjzip_box").parent().remove();
				$this.css("display", old_display);
				if (nodeName == "br") { $this.after("<br>"); $this.next().next().focus();}
				else { $this.next().focus(); }
			});
			
			$("#get_drjzip").on("keypress", function (event) {
				if (Number(event.keyCode) == 13) { $("#btn_getzip").trigger("click"); event.preventDefault();}
			});
				
			$("#btn_getzip").on("click", function () {
				$("#drjzip_box").css("display", "none").after("<div id='drjzip_select_box' style='top:-20px;position:absolute;background:white;border:1px solid black; padding:10px 20px; width:400px;'><select name='drjzip_select' id='drjzip_select'></select><span class='btn'><input type='button' value='취소' class='btn_closezip'></span></div>");
				var loc = window.location;
				$.getJSON("/@get/zip_json.php?address="+encodeURIComponent($("#get_drjzip").val())+"&callback=?", function(data) {
					if (data == null) {
						$("#drjzip_select").append('<option value="">검색결과가 없습니다.</option>');
					}
					else {
						$("#drjzip_select").append('<option value="">※주소를 선택하세요</option>');
						for(var i = 0; i < data.length; i++) {
							$("#drjzip_select").append('<option value="'+data[i][1]+'">'+data[i][0]+"</option>");
						}
					}
					$("#drjzip_select").css("width", old_width - 50);
				});
				
				$(".btn_closezip").on("click", function () {
					$("#drjzip_select_box").remove();
					$("#drjzip_box").remove();
					$this.css("display", old_display);
					if (nodeName == "br") { $this.after("<br>"); $this.next().next().focus();}
					else { $this.next().focus(); }
				});
				
				$("#drjzip_select").on("change", function () {
					$("#drjzip_select_box").remove();
					$("#drjzip_box").remove();
					$this.val($(this).val()).css("display", old_display);
					if (nodeName == "br") { $this.after("<br>"); $this.next().next().focus();}
					else { $this.next().focus(); }
				});
			});
		});
	*/	
		$(document).on("click keyup", ".type_local", function () {
			var now = new Date();
			var nodeName = "";
			var $this = $(this);
			var old_display = $(this).css("display");
			var old_width = parseInt($(this).css("width"), 10);
			try {
				if ($this.next().get(0).nodeName == "BR") {
					nodeName = "br";
					$this.next().remove();
				}
			}
			catch(e) {
			}
			$(this).css("display", "none").after("<span id='drjzip_box'><input type='text' value='' id='get_drjzip' style='width:80px;ime-mode:active;'><span class='btn'><input type='button' value='찾기' id='btn_getzip'></span><span class='btn'><input type='button' value='취소' class='btn_closezip'></span> *지역명을 입력후 찾기버튼을 누르세요!</span>");
			$("#get_drjzip").focus();
			$(".btn_closezip").on("click", function () {
				$("#drjzip_box").remove();
				$this.css("display", old_display);
				if (nodeName == "br") { $this.after("<br>"); $this.next().next().focus();}
				else { $this.next().focus(); }
			});
			
			$("#get_drjzip").on("keypress", function (event) {
				if (Number(event.keyCode) == 13) { $("#btn_getzip").trigger("click"); event.preventDefault();}
			});
				
			$("#btn_getzip").on("click", function () {
				$("#drjzip_box").css("display", "none").after("<span id='drjzip_select_box'><select name='drjzip_select' id='drjzip_select'></select><span class='btn'><input type='button' value='취소' class='btn_closezip'></span></span>");
				var loc = window.location;
				$.getJSON(loc.protocol+"//www.with-i.net/zip/local_json.php?address="+encodeURIComponent($("#get_drjzip").val())+"&callback=?", function(data) {
					if (data == null) {
						$("#drjzip_select").append('<option value="">검색결과가 없습니다.</option>');
					}
					else {
						$("#drjzip_select").append('<option value="">※지역을 선택하세요</option>');
						for(var i = 0; i < data.length; i++) {
							$("#drjzip_select").append('<option value="'+data[i][1]+'">'+data[i][1]+"</option>");
						}
					}
					$("#drjzip_select").css("width", old_width - 50);
				});
				
				$(".btn_closezip").on("click", function () {
					$("#drjzip_select_box").remove();
					$("#drjzip_box").remove();
					$this.css("display", old_display);
					if (nodeName == "br") { $this.after("<br>"); $this.next().next().focus();}
					else { $this.next().focus(); }
				});
				
				$("#drjzip_select").on("change", function () {
					$("#drjzip_select_box").remove();
					$("#drjzip_box").remove();
					$this.val($(this).val()).css("display", old_display);
					if (nodeName == "br") { $this.after("<br>"); $this.next().next().focus();}
					else { $this.next().focus(); }
				});
			});
		});
		
		$(document).on("click", ".select_all_checkbox", function () {
			checkbox_name = $(this).attr("chkbxname");
			if (!checkbox_name) checkbox_name = "cart[]";
			var obj = jQuery("input[name='"+checkbox_name+"']:checkbox");
			for(var i = 0; i < obj.length; i++) {
				if (obj.eq(i).attr("checked")) { obj.eq(i).attr("checked", false); }
				else { obj.eq(i).attr("checked", true); }
			}
		});
		
		$(document).on("click", ".goto_page", function () {
			var index = $(".goto_page").index($(this));
			var wish_page = Number($(".go_page_value").eq(index).val());
			if (!(0 < wish_page && wish_page <= Number($(this).attr("max")))) { alert("숫자의 범위는 1 부터 "+ $(this).attr("max")+"입니다."); }
			else eval($(this).attr("class_name")+"move_page('"+(wish_page - 1)+"')");
		});
		
		$(document).on("click", ".count_plus", function () {
			var obj = $(this).prevAll("input:text");
			var value = parseInt(obj.val(), 10) + 1;
			obj.val(value);
		});

		$(document).on("click", ".count_minus", function () {
			var obj = $(this).prevAll("input:text");
			var value = parseInt(obj.val(), 10) - 1;
			if (value < 0) value = 0;
			obj.val(value);
		});

		});
	});
})(jQuery);

// 간이 에디터
drj_list = function() {
	// var
	this.page_index = 0;
	this.page_size = 20;
	this.keyword1 = "";
	this.folder = "/";
	this.display_div = "admin_page";
	
	this.list_href = "";
	this.view_href = "";
	this.modify_href = "";

	// 현재경로의 다른이름
	this.list_name = "list.php";
	this.modify_name = "modify.php";
	this.view_name = "view.php";

	// 강제경로지정
	this.list_file = "";
	this.modify_file = "";
	this.view_file = "";
	
	// function
	this.set_page_size = function(size) {
		this.page_size = size;
		this.move_page(0);
	}

	this.search_word = function(keyword1) {
		this.keyword1 = keyword1;
		this.move_page(0);
	}

	this.move_page = function(no) {
		this.page_index = no;
		this.all_list();
	}

	this.all_list = function() {
		wait_message_view();
		var now = new Date();
		var href = this.list_href ? eval(this.list_href) : "";
		var Lfile = (this.list_file ? this.list_file : this.folder+this.list_name);
		jQuery('#'+this.display_div).load(Lfile+"?page_index="+this.page_index+"&page_size="+this.page_size+href+"&keyword1="+ajax_encoding(this.keyword1)+"&timenow="+now.getTime(), function () { wait_message_hide(); location.href="#";});
	}

	this.modify = function(no) {
		wait_message_view();
		var now = new Date();
		var href = this.modify_href ? eval(this.modify_href) : "";
		var Mfile = (this.modify_file ? this.modify_file : this.folder+this.modify_name);
//		jQuery.get(Mfile+"?no="+no+href+"&timenow="+now.getTime(), function(data) { jQuery('#admin_page').text(data)});
		jQuery('#'+this.display_div).load(Mfile+"?no="+no+href+"&timenow="+now.getTime(), function () { wait_message_hide(); location.href="#";});
	}

	this.view = function(no) {
		wait_message_view();
		var now = new Date();
		var href = this.view_href ? eval(this.view_href) : "";
		var Vfile = (this.view_file ? this.view_file : this.folder+this.view_name);
		jQuery('#'+this.display_div).load(Vfile+"?no="+no+href+"&timenow="+now.getTime(), function () { wait_message_hide(); location.href="#";});
	}
}

var drj_comment = function() {
	this.cmt_data_no = 0;
	this.cmt_comment_id = "";
	this.cmt_order_str = "desc";
	this.class_name = "";
	this.now_folder = "";

	this.write_comment = function(form, obj_name) {
		oEditors_cmt.getById[obj_name].exec("UPDATE_CONTENTS_FIELD", []);
		var text = jQuery("#"+obj_name).val();
		if (text.length <= 0) {
			alert("내용을 입력하세요.");
			return false;
		}
		form.data_no.value = this.cmt_data_no;
		form.cid.value = this.cmt_comment_id;
		form.class_name.value = this.class_name;
		form.memo.value = text;
		form.submit();

		return true;
	}


	this.all_list = function() {
		wait_message_view();
		var now = new Date();
		var div_name = ("#"+(this.class_name ? this.class_name+"_div_comments_list" : "div_comments_list"));
		var url = this.now_folder+"function.php?exec_mode=list&no="+this.cmt_data_no+"&cid="+this.cmt_comment_id+"&order_str="+this.cmt_order_str+"&class="+this.class_name+"&timenow="+now.getTime();
		jQuery(div_name).load(url, wait_message_hide);
	}

	this.del_comment = function(comment_no) {
		if (confirm("댓글을 삭제하시겟습니까?")) {
			wait_message_view();
			var now = new Date();
			var div_name = ("#"+(this.class_name ? this.class_name+"_div_comment_list_"+comment_no : "div_comment_list_"+comment_no));
			var url = this.now_folder+"function.php?exec_mode=delete&no="+comment_no+"&class_name="+this.class_name+"&timenow="+now.getTime();
			jQuery(div_name).html("").css("height", "0");
			jQuery(div_name).load(url, wait_message_hide);
		}
	}
	
	this.re_display = function(comment_no) {
		wait_message_view();
		var now = new Date();
		var div_name = ("#"+(this.class_name ? this.class_name+"_div_comment_list_"+comment_no : "div_comment_list_"+comment_no));
		var url = this.now_folder+"function.php?exec_mode=get&no="+comment_no+"&class_name="+this.class_name+"&timenow="+now.getTime();
		jQuery(div_name).load(url, wait_message_hide);
	}

	this.edit_comment = function(comment_no) {
		wait_message_view();
		var now = new Date();
		var div_name = ("#"+(this.class_name ? this.class_name+"_div_comment_list_"+comment_no : "div_comment_list_"+comment_no));
		var url = this.now_folder+"function.php?exec_mode=edit&no="+comment_no+"&class_name="+this.class_name+"&timenow="+now.getTime();
		jQuery(div_name).load(url, wait_message_hide);
	}
}

