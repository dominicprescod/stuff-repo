$(()=>{
  var socket  = io();

  $({
    method: "GET",
    url: "/all",
    success: (response) => {
      console.log(response)
    },
    error: (err) => {
      console.log(err)
    }
  })
  // get new caller and post data to website
  socket.on("new_caller",(data)=>{
    var $list = $('#list');
    console.log('data')
    console.log(data)
    var $item = $("<li>").addClass('caller')
    $item.attr('id',data.Keys.callerId.S);
    var $phone_number = $("<span>").addClass('phone_number').html(data.info.M.CallerIDNum.S)
    var $hold_time = $("<span>").addClass("hold_time").html("0:30");
    $item.append($phone_number)
    $item.append($hold_time)
    $list.prepend($item)
  })
  // delete record after Lambda posts
  socket.on("remove_caller", (data) => {
    console.log(data)
    var $toDelete = $("li[id='"+data.Keys.callerId.S+"']");
    $toDelete.remove();
  })

})
