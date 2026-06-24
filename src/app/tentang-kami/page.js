import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import AboutHero from "@/components/about/AboutHero";
import AboutMission from "@/components/about/AboutMission";
import AboutStats from "@/components/about/AboutStats";
import AboutTeam from "@/components/about/AboutTeam";

export const metadata = {
  title: "Tentang Kami - Dian Cahaya Travel",
  description:
    "Kenali lebih dekat Dian Cahaya Travel, biro perjalanan Umrah dan Haji terpercaya sejak 2015.",
};

export default function TentangKamiPage() {
  return (
    <>
      <Header />
      <main className="pt-20">
        <AboutHero />
        <AboutMission />
        <AboutStats />
        <AboutTeam />
      </main>
      <Footer />
    </>
  );
}
