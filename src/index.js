harlan.registerCall('statuspage::link', route => {
  route = route === null ? 'summary' : route;
  let page_id = '33vfx3wlmq7p';
  return `https://${page_id}.statuspage.io/api/v2/${route}.json`;
});

/**
 * Retorna a cor e a mensagem 
 */
harlan.registerCall('statuspage::getColor', json_status => {
  
  let statusCondition = json_status == 'operational' || json_status == 'partial_outage';
  
  let statusOn = {
    color: 'green',
    message: 'online'
  }

  let statusOff = {
    color: 'red',
    message: 'em manuntenção'
  }

  return statusCondition ? statusOn : statusOff;

});

/**
 * Retorna o link do badge
 */
harlan.registerCall('statuspage::badgeLink', json => {
  let status = harlan.call('statuspage::getColor', json.status);
  let information = {
    label: json.name,
    message: status.message,
    color: status.color
  }

  return `https://img.shields.io/static/v1?label=${information.label}&message=${information.message}&color=${information.color}&style=for-the-badge`;
});

harlan.registerCall('statuspage::index', args => {
  
  $('.header').prepend($('<div>').addClass('mdl-layout__content statuspage').css({
    'background-color': 'white',
    'display': '-webkit-flex',
    'display': 'flex',
    'justify-content': 'center',
    'overflow': 'hidden'
  }));
  
  $('.statuspage').append($('<div>').addClass('mdl_grid'));
  /**/
  let url = harlan.call('statuspage::link', 'summary');
  $.get(url, function(data) {
    data.components.forEach(element => {
      
      let attributes =  {
        src: harlan.call('statuspage::badgeLink', element),
        id: element.name.replace(/\W/g,'_').toLowerCase()
      }

      let img = $('<img>').attr(attributes).css('margin-left', '5px');
      
      $('.mdl_grid').append($('<a>').attr({href:'https://icheques.statuspage.io/',target: '_blank'}).append(img));
    });
  });
  
});

harlan.call('statuspage::index');