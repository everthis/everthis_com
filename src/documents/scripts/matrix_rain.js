!(function() {
    var $matrix = document.getElementById("matrix"),
        $banner = document.getElementsByClassName("banner")[0];

    var width =  $banner.offsetWidth,
        height = $matrix.offsetHeight,
        arr   = new Array(256),
        letters = "";

        letters = arr.join(1).split("");
        $matrix.height = height;
        $matrix.width = width;
        $matrix.style.verticalAlign = "middle";
        $matrix.style.borderRadius = "4px";

     var draw = function() {
         $matrix.getContext('2d').fillStyle = 'rgba(0,0,0,.05)';
         $matrix.getContext('2d').fillRect(0, 0, width, height);

         letters.map(function(y_pos, index) {
             $matrix.getContext('2d').fillStyle = '#0F0';
             text = String.fromCharCode(48 + Math.random() * 43);
             x_pos = index * 10;
             $matrix.getContext('2d').fillText(text, x_pos, y_pos);
             letters[index] = (y_pos > 158 + Math.random() * 1e4) ? 0 : y_pos + 10;
         });

     };
     setInterval(draw, 55);
})();
