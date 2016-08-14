$(function(){
	$("#inputDouban").blur(function(e){
		var id= $("#inputDouban").val();

		if(id){
			$.ajax({
				url: "https://api.douban.com/v2/movie/subject/"+id,
				cache: true,
				type: 'get',
				dataType: 'jsonp',
				crossDomain: true,
				jsonp: 'callback',
				success: function(data){
					$("#inputTitle").val(data.title);				
					$("#inputPoster").val(data.images.large);
					$("#inputDirector").val(data.directors[0].name);
					$("#inputCountry").val(data.countries[0]);
				}

			});
			//$('#inputTitle').val("111");	
		}
	});


})