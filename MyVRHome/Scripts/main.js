
let world = $(".main-container").get(0) ? new World($(".main-container").first()) : null;
var tv = new TV(world);
tv.Load("/Home/TV");