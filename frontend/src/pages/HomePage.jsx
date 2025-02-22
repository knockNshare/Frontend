import React from "react";
import Header from "../components/Header";
import { motion } from "framer-motion";

const HomePage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Hero Section */}
      <section className="relative bg-[#2C3E50] text-white text-center py-24">
        <div className="container mx-auto px-6">
          <motion.h1
            className="text-5xl font-bold mb-6"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            KnockNShare : Partage & Solidarité entre Voisins
          </motion.h1>
          <p className="text-lg mb-8">
            Échangez des services et compétences avec vos voisins en toute simplicité.
          </p>
          <a
            href="/signup"
            className="bg-[#F8F9FA] text-[#2C3E50] px-6 py-3 rounded-lg shadow-md hover:bg-gray-300 transition"
          >
            Rejoignez-nous gratuitement ! 
          </a>
        </div>
      </section>

      {/* Section Comment ça marche */}
      <section id="how-it-works" className="py-20 bg-[#F8F9FA]">
        <div className="container mx-auto text-center px-6">
          <h2 className="text-4xl font-bold text-[#2C3E50] mb-10">Comment ça marche ?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              { title: "Inscrivez-vous", desc: "Rejoignez votre communauté en quelques clics." },
              { title: "Offrez & Demandez", desc: "Proposez ou sollicitez des services facilement." },
              { title: "Appaisez-vous", desc: "Soyez averti du moindre danger dans votre quartier." },
            ].map((item, index) => (
              <motion.div
                key={index}
                className="bg-white p-6 rounded-lg shadow-md border border-gray-200"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
              >
                <h3 className="text-xl font-semibold text-[#2C3E50] mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Section Services */}
      <section id="services" className="py-20 bg-[#ECF0F1]">
        <div className="container mx-auto text-center px-6">
          <h2 className="text-4xl font-bold text-[#2C3E50] mb-10">Services que vous pouvez partager</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {["Réparations", "Jardinage", "Soutien scolaire", "Garde d'animaux", "Transport", "Cuisine"].map(
              (service, index) => (
                <motion.div
                  key={index}
                  className="bg-white p-5 rounded-lg shadow-md border border-gray-200"
                  whileHover={{ scale: 1.05 }}
                >
                  <h3 className="font-semibold text-[#2C3E50]">{service}</h3>
                </motion.div>
              )
            )}
          </div>
        </div>
      </section>

      {/* Section Témoignages */}
      <section id="testimonials" className="py-20 bg-[#F8F9FA]">
        <div className="container mx-auto text-center px-6">
          <h2 className="text-4xl font-bold text-[#2C3E50] mb-10">Témoignages</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { text: "J'ai trouvé une super baby-sitter grâce à KnockNShare!", name: "Sarah J." },
              { text: "Un voisin m'a aidé à réparer mon évier, super expérience!", name: "Mike T." },
              { text: "J'ai appris à jardiner avec l'aide d'un voisin passionné!", name: "Emma L." },
            ].map((testi, index) => (
              <motion.div
                key={index}
                className="bg-white p-6 rounded-lg shadow-md border border-gray-200"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
              >
                <p
                  className="italic text-gray-700"
                  dangerouslySetInnerHTML={{
                    __html: testi.text.replace(/(!)/g, "&nbsp;$1"),
                  }}
                />
                <p className="font-bold text-[#2C3E50] mt-4">{testi.name}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>


      {/* CTA Final */}
      <section className="text-center py-16 bg-[#2C3E50] text-white">
        <h2 className="text-3xl font-bold mb-4">Rejoignez KnockNShare dès aujourd'hui !</h2>
        <a
          href="/signup"
          className="bg-[#F8F9FA] text-[#2C3E50] px-6 py-3 rounded-lg shadow-md hover:bg-gray-300 transition"
        >
          S'inscrire gratuitement
        </a>
      </section>
    </div>
  );
};

export default HomePage;
