/**
 * Guardián de la única duplicación deliberada del diseño.
 *
 * `packages/forms` y `atom-forms-api` declaran el MISMO schema en repos distintos,
 * porque npm está desconectado como canal y no hay import posible entre ellos. Si una
 * mitad cambia y la otra no, el usuario pasa la validación en el navegador y el
 * endpoint le rechaza el envío con un error que no puede resolver.
 *
 * No se puede importar el gemelo desde aquí, así que este test clava los valores. No
 * verifica que el endpoint esté sincronizado —eso es imposible desde este lado— sino
 * que **rompe en cuanto alguien toca esta mitad**, obligando a mirar la otra.
 *
 * Al fallar: actualizar `atom-forms-api/lib/{options,schema,messages}.ts` y la lista
 * `COLUMNS` de `apps-script/Codigo.gs` ANTES de actualizar estos valores.
 */
import { describe, expect, it } from 'vitest';
import { CARGOS, LEADS_MENSUALES, OBJETIVOS, PAISES } from '../src/data/options';
import { getDict } from '../src/i18n';
import { createLeadBasicSchema } from '../src/schemas/lead-basic';

describe('contrato con el gemelo del endpoint', () => {
  it('las claves del payload son exactamente estas', () => {
    const schema = createLeadBasicSchema(getDict('es'));
    const resultado = schema.safeParse({});
    expect(resultado.success).toBe(false);
    // `.strict()` en ambos lados: una clave de más también es un rechazo, así que la
    // lista tiene que coincidir en los dos sentidos.
    expect(Object.keys(getDict('es').validation).sort()).toEqual([
      'aceptacion',
      'cargo',
      'email',
      'empresa',
      'leads_mensuales',
      'nombre',
      'objetivo',
      'pais',
      'sitio_web',
      'whatsapp',
    ]);
  });

  it('los valores de los selects son exactamente estos', () => {
    expect([...CARGOS]).toEqual(['marketing', 'ventas', 'direccion', 'operaciones', 'ti', 'otro']);
    expect([...LEADS_MENSUALES]).toEqual([
      'menos-100',
      '100-500',
      '500-2000',
      '2000-10000',
      'mas-10000',
    ]);
    expect([...OBJETIVOS]).toEqual([
      'responder-rapido',
      'atender-mas',
      'filtrar-intencion',
      'recuperar-leads',
      'convertir-chats',
      'conectar-crm',
      'atribucion-campanas',
      'otro',
    ]);
    expect(PAISES).toHaveLength(22);
    expect(PAISES).toContain('MX');
    expect(PAISES[PAISES.length - 1]).toBe('otro');
  });

  it('cada idioma etiqueta TODAS las opciones, sin huecos', () => {
    for (const lang of ['es', 'pt', 'en'] as const) {
      const { options } = getDict(lang);
      expect(Object.keys(options.cargo).sort()).toEqual([...CARGOS].sort());
      expect(Object.keys(options.pais).sort()).toEqual([...PAISES].sort());
      expect(Object.keys(options.leads_mensuales).sort()).toEqual([...LEADS_MENSUALES].sort());
      expect(Object.keys(options.objetivo).sort()).toEqual([...OBJETIVOS].sort());
      for (const grupo of Object.values(options)) {
        for (const etiqueta of Object.values(grupo)) {
          expect(String(etiqueta).trim().length).toBeGreaterThan(0);
        }
      }
    }
  });
});
