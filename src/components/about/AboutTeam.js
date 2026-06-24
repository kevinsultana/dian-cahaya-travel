const team = [
  {
    name: "KH. Ahmad Fauzi",
    role: "Pembimbing Ibadah",
    bio: "Pengalaman 15 tahun membimbing jamaah umrah dan haji. Lulusan Universitas Islam Madinah.",
  },
  {
    name: "Rina Marlina, S.E.",
    role: "Manajer Operasional",
    bio: "Ahli manajemen perjalanan dengan pengalaman 10 tahun di industri travel umrah.",
  },
  {
    name: "H. Abdurrahman",
    role: "Kepala Cabang",
    bio: "Berpengalaman dalam koordinasi perjalanan ibadah dan pelayanan jamaah.",
  },
  {
    name: "Siti Nurhaliza",
    role: "Customer Service",
    bio: "Melayani konsultasi dan pendaftaran jamaah dengan ramah dan profesional.",
  },
];

export default function AboutTeam() {
  return (
    <section className="section-padding bg-surface-container-low">
      <div className="container-custom">
        <div className="max-w-2xl mx-auto text-center mb-12">
          <p className="text-secondary font-semibold text-sm uppercase tracking-widest mb-3">
            Tim Kami
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-primary leading-tight mb-4">
            Dikelola oleh Tenaga{" "}
            <span className="text-secondary-container">Profesional</span>
          </h2>
          <p className="text-on-surface-variant text-lg leading-relaxed">
            Tim berpengalaman dan berdedikasi tinggi siap melayani perjalanan
            ibadah Anda dengan sepenuh hati.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {team.map((member) => (
            <div
              key={member.name}
              className="bg-white rounded-xl p-6 shadow-card border border-outline-variant/30 text-center"
            >
              {/* Avatar placeholder */}
              <div className="w-20 h-20 mx-auto bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                </svg>
              </div>
              <h3 className="font-bold text-on-surface">{member.name}</h3>
              <p className="text-sm text-secondary font-medium mb-2">
                {member.role}
              </p>
              <p className="text-sm text-on-surface-variant leading-relaxed">
                {member.bio}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
