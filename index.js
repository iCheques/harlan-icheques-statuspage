(function () {
  'use strict';

  harlan.registerCall('statuspage::link', function (route) {
    route = route === null ? 'summary' : route;
    var page_id = '33vfx3wlmq7p';
    return ("https://" + page_id + ".statuspage.io/api/v2/" + route + ".json");
  });

  /**
   * Retorna a cor e a mensagem 
   */
  harlan.registerCall('statuspage::getColor', function (json_status) {
    
    var statusCondition = json_status == 'operational' || json_status == 'partial_outage';
    
    var statusOn = {
      color: 'green',
      message: 'online'
    };

    var statusOff = {
      color: 'red',
      message: 'em manuntenção'
    };

    return statusCondition ? statusOn : statusOff;

  });

  /**
   * Retorna o link do badge
   */
  harlan.registerCall('statuspage::badgeLink', function (json) {
    var status = harlan.call('statuspage::getColor', json.status);
    var information = {
      label: json.name,
      message: status.message,
      color: status.color
    };

    return ("https://img.shields.io/static/v1?label=" + (information.label) + "&message=" + (information.message) + "&color=" + (information.color) + "&style=for-the-badge");
  });

  harlan.registerCall('statuspage::index', function (args) {
    
    $('.header').prepend($('<div>').addClass('mdl-layout__content statuspage').css({
      'background-color': 'white',
      'display': '-webkit-flex',
      'display': 'flex',
      'justify-content': 'center',
      'overflow': 'hidden'
    }));
    
    $('.statuspage').append($('<div>').addClass('mdl_grid'));
    /**/
    var url = harlan.call('statuspage::link', 'summary');
    $.get(url, function(data) {
      data.components.forEach(function (element) {
        
        var attributes =  {
          src: harlan.call('statuspage::badgeLink', element),
          id: element.name.replace(/\W/g,'_').toLowerCase()
        };

        var img = $('<img>').attr(attributes).css('margin-left', '5px');
        
        $('.mdl_grid').append($('<a>').attr({href:'https://icheques.statuspage.io/',target: '_blank'}).append(img));
      });
    });
    
  });

  harlan.call('statuspage::index');

}());
