/* Examples */
(function($) {
  /*
   * Example 1:
   *
   * - no animation
   * - custom gradient
   *
   * By the way - you may specify more than 2 colors for the gradient
   */
  $('.first.circle').circleProgress({
    value: 0.35,
    animation: false,
    fill: {gradient: ['#ff1e41', '#ff5f43']}
  });

  /*
   * Example 2:
   *
   * - default gradient
   * - listening to `circle-animation-progress` event and display the animation progress: from 0 to 100%
   */
  $('.second.circle').circleProgress({
    value: 0.25,
    fill: "#0266ff",
    emptyFill: "rgba(202, 232, 239, 1)",
  }).on('circle-animation-progress', function(event, progress) {
    $(this).find('strong').html(Math.round(25 * progress) + '<i>%</i>');
  });


  $('.third.circle').circleProgress({
     value: 0.50,
    fill: "#0266ff",
    emptyFill: "rgba(202, 232, 239, 1)",
  }).on('circle-animation-progress', function(event, progress) {
    $(this).find('strong').html(Math.round(50 * progress) + '<i>%</i>');
  });
  
  $('.fourth.circle').circleProgress({
    value: 0.65,
    fill: "#0266ff",
    emptyFill: "rgba(202, 232, 239, 1)",
  }).on('circle-animation-progress', function(event, progress) {
    $(this).find('strong').html(Math.round(65 * progress) + '<i>%</i>');
  });

  $('.fifth.circle').circleProgress({
    value: 0.75,
    fill: "#0266ff",
    emptyFill: "rgba(202, 232, 239, 1)",
  }).on('circle-animation-progress', function(event, progress) {
    $(this).find('strong').html(Math.round(75 * progress) + '<i>%</i>');
  });
  

})(jQuery);
