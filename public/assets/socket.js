// Make connection
console.log('gets here');
var socket = io.connect('http://10.194.148.215:4000/tune-in', <%= user_info %>);
console.log('wlep');
console.log(<%= user_info %>);
