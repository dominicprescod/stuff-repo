$(()=>{
  var socket  = io();

  socket.on("log",(data)=>{
    var $list = $('#list');
    var $item = $("<li>").text(JSON.stringify(data));
    $list.prepend($item);
  })
})
