// Make connection
console.log('gets here');
var socket = io.connect('http://localhost:4000/tune-in', <%= user_info %>);
console.log('wlep');
console.log(<%= user_info %>);
