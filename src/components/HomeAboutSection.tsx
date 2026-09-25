// 2026-09-22: Hannia — bloque de profundidad SEO/GEO (español claro, keyword natural).
// 2026-09-25: Bloque "Educación bilingüe en Ciudad Madero" (spam update Sep 2026, solo home).
import Link from 'next/link'

export default function HomeAboutSection() {
  return (
    <section
      className="bg-white px-4 py-14 md:py-16"
      aria-labelledby="home-about-heading"
    >
      <div className="mx-auto max-w-3xl">
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#013BDF]">
          Quiénes somos
        </p>
        <h2
          id="home-about-heading"
          className="mb-5 text-2xl font-extrabold leading-tight text-gray-900 md:text-3xl"
        >
          El Instituto Winston Churchill en Ciudad Madero
        </h2>

        <p className="mb-4 text-sm leading-relaxed text-gray-700 md:text-base">
          El Instituto Winston Churchill es un colegio bilingüe en Ciudad Madero,
          Tamaulipas. Formamos a niñas y niños desde kínder hasta secundaria. Llevamos
          más de 30 años acompañando a familias de la zona con una educación cercana y
          con visión de futuro.
        </p>

        <p className="mb-4 text-sm leading-relaxed text-gray-700 md:text-base">
          Aquí el inglés no es solo una materia. Se vive en el día a día. También
          cuidamos valores, hábitos de estudio y el desarrollo emocional de cada alumno.
        </p>

        <h3 className="mb-3 text-lg font-bold text-gray-900">
          ¿Qué nos distingue?
        </h3>
        <ul className="mb-6 list-disc space-y-2 pl-5 text-sm leading-relaxed text-gray-700 md:text-base">
          <li>Trayectoria de más de tres décadas en la región.</li>
          <li>Formación bilingüe de kínder a secundaria.</li>
          <li>Respaldo académico de University of Cambridge.</li>
          <li>Comunidad #soywinston con acompañamiento cercano a las familias.</li>
        </ul>

        {/* 2026-09-25: Texto SEO local (Oxford/Cambridge/estancia); fusionado con oferta previa. */}
        <h2 className="mb-4 text-xl font-extrabold leading-tight text-gray-900 md:text-2xl">
          Educación bilingüe en Ciudad Madero
        </h2>
        <p className="mb-4 text-sm leading-relaxed text-gray-700 md:text-base">
          El Instituto Winston Churchill ofrece educación bilingüe desde kínder hasta
          secundaria, con más de 30 años formando alumnos en Ciudad Madero, Tamaulipas.
          El campus está en Calle 3 #309, Colonia Jardín 20 de Noviembre.
        </p>
        <p className="mb-4 text-sm leading-relaxed text-gray-700 md:text-base">
          En kínder y primaria trabajamos con el programa Oxford, con inglés desde los
          primeros años. En secundaria usamos el programa Cambridge, que certifica el
          inglés con reconocimiento internacional. En ambos niveles se incorpora el
          francés.
        </p>
        <p className="mb-4 text-sm leading-relaxed text-gray-700 md:text-base">
          Hay estancia hasta las 7:00 p.m., apoyo en tareas y talleres por la tarde.
          Contamos con sistema de becas e inscripciones abiertas.
        </p>
        <p className="mb-6 text-sm leading-relaxed text-gray-700 md:text-base">
          Si buscas un colegio bilingüe en Ciudad Madero o Tampico, agenda una visita
          con admisiones.
        </p>

        <div className="flex flex-wrap gap-3">
          <Link
            href="/oferta-educativa"
            className="rounded-full bg-[#013BDF] px-6 py-3 text-sm font-bold uppercase tracking-wide text-white transition hover:bg-[#012A9E]"
          >
            Ver oferta educativa
          </Link>
          <Link
            href="/admisiones"
            className="rounded-full bg-[#E3FB07] px-6 py-3 text-sm font-bold uppercase tracking-wide text-black transition hover:shadow-md"
          >
            Ir a admisiones
          </Link>
        </div>
      </div>
    </section>
  )
}
