/* Frases de apoyo para la respuesta manual. Nunca llama al envío. */
(() => {
  const caja = document.getElementById('rapidasCategorias');
  const respuesta = document.getElementById('respTexto');
  if (!caja || !respuesta) return;
  const grupos = {
    'Primer contacto': [
      'Hola, soy Pablo. Contame un poco qué hacés y qué te gustaría que tenga la web.',
      'Gracias por escribirme. ¿Ya tenés una web o arrancamos desde cero?',
      '¿Tenés algún ejemplo de página que te guste? Me sirve para entender el estilo que buscás.',
      'Si me contás qué vendés o qué servicio ofrecés, te digo qué tipo de web te conviene.',
      'Perfecto, lo miro y te respondo por acá.'
    ],
    'Trabajos y modelos': [
      'Te paso algunos trabajos nuestros para que veas cómo resolvimos proyectos parecidos al tuyo.',
      'Acá podés mirar los modelos y elegir uno o dos que te gusten: gokywebs.com/modelos/',
      'El modelo es un punto de partida. Después lo adaptamos con tu marca, tus textos y tus fotos.',
      'Me gustó ese modelo para tu negocio. Si querés, vemos qué partes conservar y cuáles cambiar.',
      'Si no te convence ninguno tal cual, combinamos ideas de dos modelos.'
    ],
    'Presupuesto': [
      'Te preparo el presupuesto para lo que me contaste y te lo paso por acá.',
      'Hay dos opciones: pago único con seña al empezar, que incluye mantenimiento el primer año, o suscripción mensual. ¿Cuál preferís?',
      '¿Te cierra esta propuesta? Si querés avanzar, seguimos con tus datos y el modelo que elegiste.',
      'El valor depende de las funciones que necesites. Contame eso y te doy un número concreto.',
      'Si querés sumar algo que no habíamos previsto, lo vemos y te digo cuánto cambia el presupuesto.'
    ],
    'Formulario': [
      'Cuando quieras avanzar, completá este formulario: gokywebs.com/form',
      'En el formulario dejás tu WhatsApp y elegís hasta dos modelos. Así tengo todo junto para empezar.',
      '¿Pudiste abrir el formulario? Si se trabó en algún campo, decime y te ayudo.',
      'Ya vi tus datos, gracias. Ahora reviso los modelos que marcaste y seguimos por acá.',
      'Si querés cambiar un modelo que elegiste, avisame cuál preferís y lo anoto.'
    ],
    'Diseño y cambios': [
      'Anoté ese cambio. ¿Hay algo más en esa misma pantalla que quieras ajustar?',
      'Te comparto cómo quedó para que lo mires con calma y me digas qué cambiarías.',
      'Con pago único, podemos rehacer el diseño hasta dos veces antes de elegir uno.',
      'Una vez elegido el diseño, tenés tres rondas para ajustar el resto de la web.',
      'Los cambios después de entregada la web con pago único se presupuestan aparte.',
      'El mantenimiento no incluye cambios. Con la suscripción está el plan con cambios, con un cambio por mes.'
    ],
    'Cobros': [
      'Para empezar con pago único, te paso los datos para la seña y después confirmamos el arranque.',
      'La seña reserva el trabajo y no se devuelve. Si el diseño no te convence, lo rehacemos hasta dos veces.',
      '¿Me mandás el comprobante cuando hagas el pago? Así lo registro y seguimos.',
      'Todavía me figura pendiente el pago. Si ya lo hiciste, mandame el comprobante y lo reviso.',
      'Recibí el comprobante, gracias. Verifico que se haya acreditado y te confirmo.',
      'El saldo del pago único se abona al entregar la web. Te aviso cuando esté lista.',
      'Para la suscripción mensual, te comparto el enlace de pago y te confirmo cuando quede activo.'
    ],
    'Seguimiento': [
      'Hola, ¿pudiste mirar los trabajos y los modelos que te pasé?',
      'Me quedó pendiente tu respuesta. ¿Seguís con ganas de avanzar con la web?',
      'Si ahora no es buen momento, no hay problema. Decime cuándo preferís que retomemos.',
      'Ya vi tu mensaje. Dame un rato para revisar el detalle y te respondo bien.',
      'Gracias por la paciencia. Te escribo apenas tenga la próxima versión lista.'
    ]
  };
  Object.entries(grupos).forEach(([nombre, frases]) => {
    const grupo = document.createElement('details');
    const titulo = document.createElement('summary');
    titulo.textContent = `${nombre} (${frases.length})`;
    grupo.append(titulo);
    frases.forEach(frase => {
      const boton = document.createElement('button');
      boton.type = 'button'; boton.textContent = frase;
      boton.addEventListener('click', () => {
        const actual = respuesta.value;
        const posicion = Number.isInteger(respuesta.selectionEnd) ? respuesta.selectionEnd : actual.length;
        const antes = actual.slice(0, posicion);
        const despues = actual.slice(posicion);
        const prefijo = antes && !/\s$/.test(antes) ? '\n\n' : '';
        const sufijo = despues && !/^\s/.test(despues) ? '\n\n' : '';
        respuesta.value = antes + prefijo + frase + sufijo + despues;
        const cursor = (antes + prefijo + frase).length;
        respuesta.dispatchEvent(new Event('input', { bubbles: true }));
        respuesta.focus();
        respuesta.setSelectionRange(cursor, cursor);
      });
      grupo.append(boton);
    });
    caja.append(grupo);
  });
})();
