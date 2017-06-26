$(()=>{
  var socket  = io();
  socket.on("new_caller",(data)=>{
    var $list = $('#list');
    console.log('data')
    console.log(data)
    var $item = $("<li>").addClass('caller')
    var $phone_number = $("<span>").addClass('phone_number').html(data.CalledDID)
    var $hold_time = $("<span>").addClass("hold_time").html("0:30");
    $item.append($phone_number)
    $item.append($hold_time)
    $list.prepend($item)
  })
  socket.on("remove_caller", (data) => {

  })

})
