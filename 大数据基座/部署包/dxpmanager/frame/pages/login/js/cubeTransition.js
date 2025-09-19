(function($) {
    // document.getElementById('cubeTransition').style.perspective = 1200;
    var length = $('#cubeTransition>div').length,
        current = 1,
        next = 1,
        outClass, inClass, onGoing = false;
    $('#cubeTransition>div:eq(' + (current - 1) + ')').show()


    for (i = 0; i < length; i++) {
        var bullet = $("<li></li>");
        if (i == 0) bullet.addClass('active');
        $("#bullets").append(bullet);
    }

    function openIndex(i) {
        if (!onGoing && next != i) {
            onGoing = true;
            next = i
            outClass = current > i ? 'rotateCubeBottomOut top' : 'rotateCubeTopOut top'
            inClass = current > i ? 'rotateCubeBottomIn' : 'rotateCubeTopIn';
            show()
        }
    }

    function trans(direction) {
        if (!onGoing) {
            onGoing = true;
            if (direction == 'up') {
                next = current > 1 ? current - 1 : length;
                outClass = 'rotateCubeBottomOut top';
                inClass = 'rotateCubeBottomIn';
            } else {
                next = current < length ? current + 1 : 1;
                outClass = 'rotateCubeTopOut top';
                inClass = 'rotateCubeTopIn';
            }
            show();
        }
    }

    function show() {
        $('#cubeTransition>div:eq(' + (current - 1) + ')').addClass(outClass);
        $('#cubeTransition>div:eq(' + (next - 1) + ')').addClass(inClass);
        $('#bullets>li:eq(' + (current - 1) + ')').removeClass('active');
        $('#bullets>li:eq(' + (next - 1) + ')').addClass('active');
        $('#cubeTransition>div:eq(' + (next - 1) + ')').show();
        setTimeout(function() {
            $('#cubeTransition>div:eq(' + (current - 1) + ')').hide();
        }, 500)
        setTimeout(function() {
            $('#cubeTransition>div:eq(' + (current - 1) + ')').removeClass(outClass);
            $('#cubeTransition>div:eq(' + (next - 1) + ')').removeClass(inClass);
            current = next;
            onGoing = false;
        }, 800)
    }

    $('#cubeTransition').on('click', '#code', function() {
        openIndex(2);
    }).on('click', '#brain', function() {
        openIndex(1);
    }).on('click', '#accountkey', function() {
        openIndex(3);
    }).on('click', '#CA', function() {
        openIndex(1);
    })
})(jQuery);