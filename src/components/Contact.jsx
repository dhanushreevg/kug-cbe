export default function Contact() {
  return (
    <section
      id="contact"
      className="py-28 px-6 md:px-12 max-w-3xl mx-auto text-center relative"
    >
      <div className="reveal relative w-fit mx-auto mb-6">
        <div className="absolute inset-0 mascot-glow rounded-full scale-125 pointer-events-none -z-10 animate-pulse-glow" />
        <img
          src="/assets/kotlin_mascot_2/Digital/SVG/Kodee_Assets_Digital_Kodee-waving.svg"
          alt="Kodee waving"
          className="w-24 h-24 object-contain mx-auto animate-float"
        />
      </div>

      <span className="reveal text-kotlin-purple font-mono text-sm tracking-widest uppercase inline-flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-kotlin-purple" />
        Say Hello
      </span>

      <h2 className="reveal text-4xl md:text-6xl font-bold mt-3 mb-6">
        Get in <span className="kotlin-gradient-text">Touch</span>
      </h2>

      <p className="reveal text-white/55 text-lg leading-relaxed mb-10">
        Want to speak at an event, partner with us, or just say hi?
        <br />
        We would love to hear from you.
      </p>

      <div className="reveal flex flex-col sm:flex-row gap-4 justify-center items-center">
        <a
          href="mailto:kugcoimbatore@gmail.com"
          className="glass-btn rounded-full px-8 py-4 font-semibold text-kotlin-purple text-base"
        >
          kugcoimbatore@gmail.com
        </a>
        <a
          href="https://kotlinlang.org/community/user-groups/"
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full px-8 py-4 font-semibold text-base text-white/60 border border-white/10 hover:border-white/25 hover:text-white transition-all duration-300"
        >
          All KUGs ↗
        </a>
      </div>
    </section>
  )
}
