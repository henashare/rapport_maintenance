$("#tasks_table tr").mousedown(function(event){
    var index = $(this).attr("id");
    switch(event.which){
        case 3: 
            var id = prompt("Pour valider cet événement, veuillez rentrer son identifiant de tâche :");
            if(id == null || id == "") ;
            else{
                var data_ = "index_=" + index + "&id_=" + id;
                $.ajax({
                    type : "POST",
                    url : "find.php", 
                    data : data_,
                    success : function(result){
                        //console.log(result);
                        const array_res = result.split("&");
                        const db_index = array_res[0];
                        const rand_id = array_res[1];
                        if(index == db_index && id == rand_id) location.reload();
                    }
                });
            }
        break;
    }
});

$(document).ready(function(){
    var today = new Date();
    var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    var i = 0;
    $("#tasks_table tr").each(function(){
        var id = $(this).attr("id");
        $("#tasks_table td").each(function(index, element){
            if($(this).text() == date) $(this).closest("tr").css("background-color", "#965F00");
        });
    });
});