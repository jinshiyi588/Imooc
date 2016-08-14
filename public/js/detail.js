$(function() {
	$('.reply').click(function(e){
		var target = $(e.target);
		var commentId = target.data('cid');
		var toId= target.data('tid');
		var toName= target.data('tname');
		//var tr = $('.item-id-' + id);
		if($('#cid').length >0 ){
			$('#cid').val(commentId);
			$('#tid').val(toId);
			$('#tname').html("Reply to: "+toName);
		}else{

			$('<input>').attr({
				id:'cid',
				type:'hidden',
				name:'comment[cid]',
				value:commentId
			}).appendTo('#commentForm');

			$('<input>').attr({
				type:'hidden',
				name:'comment[tid]',
				value:toId,
				id:'tid'
			}).appendTo('#commentForm');

			$('<p>')
				.attr({
					class: 'badge',
					id: 'tname'})
				.html("Reply to: "+toName)
				.prependTo('#commentForm');
			
		}


	})

})