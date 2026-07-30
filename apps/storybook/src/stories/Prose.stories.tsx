import type { Meta, StoryObj } from '@storybook/react';

/**
 * Prose — contenido largo estilizado POR ELEMENTO.
 *
 * El resto del DS tipografia por clase (.h2, .body): sirve cuando maquetas cada
 * nodo. No sirve cuando el cuerpo viene de un CMS, de un rich text de Webflow o
 * de un modelo de bloques. Ahi va `.prose`: una clase en el contenedor y sus
 * hijos semanticos —sin una sola clase propia— heredan el sistema.
 */
function Body() {
  return (
    <>
      <h2>Identidad del responsable</h2>
      <p>
        El responsable del tratamiento de los datos personales recabados a traves de este sitio es
        Atom, con domicilio en Ciudad de Mexico. Cualquier solicitud relacionada con el ejercicio de
        derechos puede dirigirse al correo de contacto publicado en este aviso.
      </p>
      <h3>Informacion de contacto</h3>
      <p>
        Las solicitudes se atienden en un plazo maximo de veinte dias habiles. Si la solicitud
        requiere informacion adicional, se notificara dentro de los primeros cinco dias.
      </p>
      <ul>
        <li>Acceso a los datos personales en posesion del responsable.</li>
        <li>Rectificacion de datos inexactos o incompletos.</li>
        <li>
          Cancelacion y oposicion al tratamiento, en los terminos previstos por la legislacion
          aplicable.
        </li>
      </ul>
      <h2>Principios aplicados en el tratamiento</h2>
      <p>
        El tratamiento se rige por los principios de licitud, consentimiento, informacion, calidad,
        finalidad, lealtad, proporcionalidad y responsabilidad.
      </p>
      <ol>
        <li>Se recaban unicamente los datos necesarios para la finalidad declarada.</li>
        <li>Los datos se conservan solo mientras subsista esa finalidad.</li>
      </ol>
      <blockquote>
        El titular puede revocar su consentimiento en cualquier momento, sin efectos retroactivos
        sobre los tratamientos ya realizados.
      </blockquote>
      <h3>Seguridad y conservacion</h3>
      <p>
        La informacion se transmite cifrada y los accesos quedan registrados. Las peticiones a la
        API se autentican con un encabezado <code>Authorization</code> y se limitan por origen.
      </p>
      <table>
        <thead>
          <tr>
            <th>Plan</th>
            <th>Suspension</th>
            <th>Cancelacion</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Starter</td>
            <td>15 dias de mora</td>
            <td>45 dias</td>
          </tr>
          <tr>
            <td>Professional</td>
            <td>30 dias de mora</td>
            <td>60 dias</td>
          </tr>
          <tr>
            <td>Enterprise</td>
            <td>Segun contrato</td>
            <td>Segun contrato</td>
          </tr>
        </tbody>
      </table>
      <p>
        Consulta tambien los <a href="#">terminos de suscripcion</a> para el detalle de los plazos
        de facturacion.
      </p>
      <small>Ultima actualizacion: mayo de 2025.</small>
    </>
  );
}

const meta: Meta = { title: 'Layout/Prose' };
export default meta;
type Story = StoryObj;

/** Medida de lectura por defecto (68ch): el limite lo pone el componente, no el layout. */
export const Default: Story = {
  render: () => (
    <div className="prose">
      <Body />
    </div>
  ),
};

/** --narrow (56ch): columnas estrechas, sidebars de documentacion. */
export const Narrow: Story = {
  render: () => (
    <div className="prose prose--narrow">
      <Body />
    </div>
  ),
};

/**
 * --wide libera la medida. Solo para cuando el ancho ya lo gobierna la rejilla
 * del layout; sin limite y a pantalla completa el texto se vuelve ilegible.
 */
export const Wide: Story = {
  render: () => (
    <div className="prose prose--wide">
      <Body />
    </div>
  ),
};
