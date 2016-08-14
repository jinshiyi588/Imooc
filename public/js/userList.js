$(function() {
	$('.del').click(function(e){
		var target = $(e.target);
		var id = target.data('id');
		var tr = $('.item-id-' + id);

		$.ajax({
			type: 'DELETE',
			url: '/admin/list?id='+id 
		})
		.done(function(results){
			if(results.success === 1){
				if(tr.length >0 ){
					tr.remove();
				}
			}
		})


	})

	$('.new').click(function(e){
		window.location.href = "/admin/movie/showAdd";
	})

	$('.del-user').click(function(e){
		var target = $(e.target);
		var id = target.data('id');
		var tr = $('.item-id-' + id);

		$.ajax({
			type: 'DELETE',
			url: '/admin/userList?id='+id 
		})
		.done(function(results){
			if(results.success === 1){
				if(tr.length >0 ){
					tr.remove();
				}
			}
		})


	})

})