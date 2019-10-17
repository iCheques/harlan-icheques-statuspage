harlan.registerCall('statuspage::link', route => {
  route = route === null ? 'summary' : route;
  let page_id = '2hqchcjm9y1g';
  let api_key = '1fe751d5-f2be-4434-8c98-fd62bf982bbb';
  return `https://${page_id}.statuspage.io/api/v2/${route}.json?api_key=${api_key}`;
})

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

harlan.registerCall('statuspage::svg', config => {
  return `<?xml version="1.0" encoding="UTF-8" standalone="no"?>
  <svg
     xmlns:dc="http://purl.org/dc/elements/1.1/"
     xmlns:cc="http://creativecommons.org/ns#"
     xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
     xmlns:svg="http://www.w3.org/2000/svg"
     xmlns="http://www.w3.org/2000/svg"
     id="svg14"
     version="1.1"
     height="28"
     width="196">
    <metadata
       id="metadata20">
      <rdf:RDF>
        <cc:Work
           rdf:about="">
          <dc:format>image/svg+xml</dc:format>
          <dc:type
             rdf:resource="http://purl.org/dc/dcmitype/StillImage" />
          <dc:title></dc:title>
        </cc:Work>
      </rdf:RDF>
    </metadata>
    <defs
       id="defs18" />
    <g
       shape-rendering="crispEdges"
       style="fill:#666666"
       id="g6">
      <path
         fill="#555"
         style="fill:#1a1a1a"
         id="path2"
         d="M0 0h121v28H0z" />
      <path
         fill="#97ca00"
         style="fill:#4d4d4d"
         id="path4"
         d="M121 0h75v28H121z" />
    </g>
    <text
       x="605"
       y="175"
       transform="scale(0.1)"
       textLength="970"
       id="text8"
       lengthAdjust="spacing"
       style="font-size:100px;font-family:'DejaVu Sans', Verdana, Geneva, sans-serif;text-anchor:middle;font-weight:bold;fill:#ffffff">${config.text}</text>
    <circle
       r="10"
       cy="15.3"
       cx="133"
       id="path24-3-6-7"
       style="fill:${config.red_light !== undefined ? '#FF0000':'#333333'}" />
      
    <circle
       r="10"
       cy="15.3"
       cx="158"
       id="path24-3"
       style="fill:${config.yellow_light !== undefined ? '#FFFF00':'#333333'}" />
    <circle
       r="10"
       cy="15.3"
       cx="183"
       id="path24-3-6"
       style="fill:${config.green_light !== undefined ? '#008000':'#333333'}" />
  </svg>`;
  });

harlan.registerCall('statuspage::index', args => {
  
  $('.header').prepend($('<div>').addClass('statuspage').css({
    'background-color': 'white',
    'display': '-webkit-flex',
    'display': 'flex',
    'justify-content': 'center',
  }));
  /**/
  let url = harlan.call('statuspage::link', 'summary');
  $.get(url, function(data) {
    data.components.forEach(element => {
      
      let attributes =  {
        src: harlan.call('statuspage::badgeLink', element),
        id: element.name.replace(/\W/g,'_').toLowerCase()
      }

      let colorFactory = harlan.call('statuspage::getColor', element.status);

      let configImage = {
        text: element.name,
        green_light: colorFactory.color == 'green' ? true : undefined,
        yellow_light: colorFactory.color == 'yellow' ? true : undefined,
        red_light: colorFactory.color == 'red' ? true : undefined
      }

      let img = $(harlan.call('statuspage::svg', configImage)).css('margin-left', '5px');
      
      $('.statuspage').append($('<a>').attr({href:'https://testedavi.statuspage.io/',target: '_blank'}).append(img));
    });
  });
  
});

harlan.call('statuspage::index');