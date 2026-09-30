// 2026-09-30: Aviso de privacidad integral (LFPDPPP 2025) — incluye uso de imagen de alumnos
// y sección de cookies enlazada desde el banner de consentimiento (#cookies).
import type { ReactNode } from 'react'
import Link from 'next/link'
import Navigation from '@/components/Navigation'
import Seo from '@/components/Seo'
import { SITE_ROUTES } from '@/lib/seo/routes'
import { LEGAL_ENTITY, PRIVACY_NOTICE_UPDATED_AT } from '@/lib/legal'

function Section({ id, title, children }: { id?: string; title: string; children: ReactNode }) {
  return (
    <section id={id} className="scroll-mt-28">
      <h2 className="mb-3 text-lg font-extrabold text-gray-900 md:text-xl">{title}</h2>
      <div className="space-y-3 text-sm leading-relaxed text-gray-700 md:text-base">{children}</div>
    </section>
  )
}

function List({ items }: { items: readonly ReactNode[] }) {
  return (
    <ul className="list-disc space-y-1.5 pl-5">
      {items.map((item, index) => (
        <li key={index}>{item}</li>
      ))}
    </ul>
  )
}

const mail = (
  <a
    href={`mailto:${LEGAL_ENTITY.privacyEmail}`}
    className="font-semibold text-[#013BDF] hover:underline"
  >
    {LEGAL_ENTITY.privacyEmail}
  </a>
)

export default function AvisoDePrivacidadPage() {
  const pageSeo = SITE_ROUTES.find((route) => route.path === '/aviso-de-privacidad')!

  return (
    <div className="bg-white">
      <Seo
        title={pageSeo.title}
        description={pageSeo.description}
        path={pageSeo.path}
        keywords={pageSeo.keywords}
      />
      <Navigation currentSection={1} />

      <article className="px-4 pb-16 pt-24 md:pt-28">
        <header className="mx-auto mb-10 max-w-3xl border-b border-gray-100 pb-8">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#013BDF]">
            {LEGAL_ENTITY.razonSocial}
          </p>
          <h1 className="text-3xl font-extrabold text-gray-900 md:text-4xl">
            Aviso de Privacidad Integral
          </h1>
          <p className="mt-3 text-sm text-gray-500">
            Última actualización: {PRIVACY_NOTICE_UPDATED_AT}
          </p>
        </header>

        <div className="mx-auto max-w-3xl space-y-10">
          <Section title="1. Identidad y domicilio del responsable">
            <p>
              <strong>{LEGAL_ENTITY.razonSocialUpper}</strong> (en adelante, &ldquo;el
              Instituto&rdquo;), con RFC {LEGAL_ENTITY.rfc} y domicilio en{' '}
              {LEGAL_ENTITY.domicilio}, es responsable del tratamiento de los datos personales
              que nos proporcione, conforme a la Ley Federal de Protección de Datos Personales
              en Posesión de los Particulares y demás normativa aplicable.
            </p>
            <p>
              Para cualquier asunto relacionado con este aviso o con sus datos personales, puede
              escribirnos a {mail} o acudir a nuestro domicilio en horario de oficina.
            </p>
          </Section>

          <Section title="2. Datos personales que tratamos">
            <p>
              Según el trámite o servicio, podemos tratar las siguientes categorías de datos:
            </p>
            <List
              items={[
                <>
                  <strong>De padres, madres o tutores:</strong> nombre, teléfono, correo
                  electrónico, domicilio, parentesco con el alumno y, cuando se requiera factura,
                  datos fiscales.
                </>,
                <>
                  <strong>De alumnos y aspirantes (menores de edad):</strong> nombre, fecha de
                  nacimiento, CURP, nivel y grado escolar, historial académico, documentos de
                  inscripción, así como fotografías y videos en actividades escolares.
                </>,
                <>
                  <strong>Datos de pago:</strong> información necesaria para el cobro de
                  colegiaturas y servicios educativos.
                </>,
              ]}
            />
            <p>
              <strong>Datos sensibles:</strong> para la atención y seguridad del alumno podemos
              solicitar información de salud (por ejemplo, alergias, padecimientos o
              indicaciones médicas). Estos datos se tratan con medidas de seguridad reforzadas y
              solo con el consentimiento expreso y por escrito del padre, madre o tutor.
            </p>
            <p>
              Los datos de menores de edad se recaban a través de su padre, madre o tutor, quien
              otorga el consentimiento en su representación.
            </p>
            <p>
              Obtenemos estos datos cuando usted los proporciona directamente: en el formulario
              de contacto de este sitio, por teléfono, WhatsApp, correo electrónico o de forma
              presencial durante los procesos de informes, admisión e inscripción.
            </p>
          </Section>

          <Section title="3. Finalidades del tratamiento">
            <p>
              <strong>Finalidades primarias</strong> (necesarias para la relación con el
              Instituto):
            </p>
            <List
              items={[
                'Atender solicitudes de informes, visitas y citas de admisión.',
                'Realizar los procesos de admisión, inscripción y reinscripción.',
                'Prestar el servicio educativo e integrar el expediente escolar del alumno.',
                'Realizar trámites ante las autoridades educativas (registro, boletas y certificados).',
                'Mantener comunicación con padres, madres o tutores sobre el desempeño y las actividades del alumno.',
                'Cobrar colegiaturas y servicios, y emitir comprobantes fiscales.',
                'Atender emergencias médicas o de seguridad del alumno dentro del plantel.',
                'Cumplir obligaciones legales aplicables al Instituto.',
              ]}
            />
            <p>
              <strong>Finalidades secundarias</strong> (no son necesarias para el servicio, pero
              nos ayudan a brindarle una mejor atención):
            </p>
            <List
              items={[
                'Enviarle información sobre eventos, campañas de inscripción y actividades institucionales.',
                'Aplicar encuestas de satisfacción y calidad del servicio.',
              ]}
            />
            <p>
              Si no desea que sus datos se usen para finalidades secundarias, envíe un correo a{' '}
              {mail} indicando su negativa. Esta negativa no será motivo para negarle los
              servicios que solicita o contrata con el Instituto.
            </p>
          </Section>

          <Section title="4. Uso de imagen y fotografías de alumnos">
            <p>
              El Instituto publica fotografías y videos de alumnos en su sitio web institucional
              y en sus redes sociales oficiales con el fin de difundir las actividades
              académicas, culturales, deportivas y de convivencia de la comunidad escolar.
            </p>
            <p>
              Esta publicación se realiza únicamente con la{' '}
              <strong>
                autorización de uso de imagen firmada por el padre, madre o tutor
              </strong>
              , la cual se conserva en el archivo escolar del alumno.
            </p>
            <p>
              El padre, madre o tutor puede revocar esta autorización en cualquier momento
              escribiendo a {mail}. A partir de la revocación, el Instituto dejará de publicar
              nuevas imágenes del alumno y retirará de su sitio web y redes oficiales las que
              estén bajo su control.
            </p>
          </Section>

          <Section title="5. Transferencias y remisiones de datos">
            <p>
              El Instituto no vende ni renta sus datos personales. Podemos compartirlos, sin
              requerir su consentimiento, en los casos que permite la ley, entre ellos:
            </p>
            <List
              items={[
                'Con la Secretaría de Educación Pública y la Secretaría de Educación del Estado de Tamaulipas, para el registro, la acreditación y la certificación de estudios.',
                'Con autoridades competentes que lo requieran conforme a la ley.',
                'Con servicios médicos o de emergencia, cuando sea necesario para proteger la salud del alumno.',
              ]}
            />
            <p>
              También podemos apoyarnos en proveedores que tratan datos por cuenta del Instituto
              (por ejemplo, servicios de correo electrónico, alojamiento web y plataformas
              escolares). Estos proveedores están obligados a mantener la confidencialidad de
              la información y a usarla solo para los fines que el Instituto les indique.
            </p>
          </Section>

          <Section title="6. Derechos ARCO">
            <p>
              Usted tiene derecho a <strong>Acceder</strong> a sus datos personales, a{' '}
              <strong>Rectificarlos</strong> si son inexactos, a <strong>Cancelarlos</strong>{' '}
              cuando considere que no se requieren para alguna de las finalidades señaladas, y a{' '}
              <strong>Oponerse</strong> a su tratamiento para fines específicos. Tratándose de
              menores de edad, estos derechos los ejerce su padre, madre o tutor.
            </p>
            <p>Para ejercerlos, envíe su solicitud a {mail} con la siguiente información:</p>
            <List
              items={[
                'Nombre completo del titular y, en su caso, de su representante.',
                'Copia de una identificación oficial del titular y, en su caso, documento que acredite la representación.',
                'Descripción clara del derecho que desea ejercer y de los datos involucrados.',
                'Correo electrónico o domicilio para recibir la respuesta.',
                'Cualquier documento que facilite la localización de sus datos.',
              ]}
            />
            <p>
              Le responderemos en un plazo máximo de 20 días hábiles contados desde la recepción
              de su solicitud. Si resulta procedente, la haremos efectiva dentro de los 15 días
              hábiles siguientes a la respuesta.
            </p>
          </Section>

          <Section title="7. Revocación del consentimiento y limitación del uso">
            <p>
              Puede revocar el consentimiento que nos haya otorgado, o pedir que limitemos el uso
              o la divulgación de sus datos, enviando un correo a {mail}. Tome en cuenta que, en
              algunos casos, no podremos atender su solicitud de inmediato por existir una
              obligación legal, o que la revocación puede implicar que no podamos seguir
              prestando el servicio.
            </p>
            <p>
              Si no desea recibir publicidad por teléfono, también puede inscribirse en el
              Registro Público para Evitar Publicidad (REPEP) de la Procuraduría Federal del
              Consumidor.
            </p>
          </Section>

          <Section id="cookies" title="8. Cookies y tecnologías de rastreo">
            <p>Este sitio web utiliza dos tipos de tecnologías:</p>
            <List
              items={[
                <>
                  <strong>Necesarias:</strong> almacenamiento en su navegador para recordar su
                  preferencia de cookies y permitir el funcionamiento básico del sitio. No
                  requieren su consentimiento.
                </>,
                <>
                  <strong>Analítica y publicidad:</strong> Google Tag Manager y Google Ads
                  (Google LLC), que pueden recabar su dirección IP, tipo de navegador y
                  dispositivo, páginas visitadas, tiempo de navegación y el origen de su visita,
                  para medir el uso del sitio y el desempeño de nuestras campañas.
                </>,
              ]}
            />
            <p>
              Las cookies de analítica y publicidad <strong>solo se activan si usted elige
              &ldquo;Aceptar todas&rdquo;</strong> en el aviso de cookies. Puede cambiar su
              decisión en cualquier momento desde el enlace &ldquo;Preferencias de
              cookies&rdquo; al pie de cada página, o eliminarlas desde la configuración de su
              navegador.
            </p>
            <p>
              La página de contacto muestra un mapa de Google Maps. Al visualizarlo, Google puede
              tratar datos de navegación conforme a su propia política de privacidad.
            </p>
          </Section>

          <Section title="9. Cambios al aviso de privacidad">
            <p>
              Este aviso puede modificarse por cambios legales, en nuestros servicios o en
              nuestras prácticas de privacidad. Cualquier cambio se publicará en esta misma
              página, indicando la fecha de la última actualización.
            </p>
          </Section>

          <Section title="10. Autoridad competente">
            <p>
              Si considera que su derecho a la protección de datos personales ha sido vulnerado,
              puede acudir ante la Secretaría Anticorrupción y Buen Gobierno, autoridad
              encargada de la aplicación de la ley en la materia.
            </p>
          </Section>

          <footer className="rounded-xl bg-[#F7F8FC] p-5 text-sm text-gray-600">
            <p>
              <strong className="text-gray-900">{LEGAL_ENTITY.razonSocial}</strong> ·{' '}
              {LEGAL_ENTITY.domicilio} · Tel.{' '}
              <a href={LEGAL_ENTITY.phoneHref} className="text-[#013BDF] hover:underline">
                {LEGAL_ENTITY.phone}
              </a>
            </p>
            <p className="mt-2">
              ¿Dudas sobre sus datos? Escríbanos a {mail} o visite nuestra página de{' '}
              <Link href="/contacto" className="font-semibold text-[#013BDF] hover:underline">
                contacto
              </Link>
              .
            </p>
          </footer>
        </div>
      </article>
    </div>
  )
}
