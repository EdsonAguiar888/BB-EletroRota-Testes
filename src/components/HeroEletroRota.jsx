import '../styles/bbEletroRota.css';
import logoEletroRota from '../assets/LogoEletroRota.svg';

export default function HeroEletroRota() {
  return (
    <section className="bb-hero">
      <div className="bb-hero-content">
        <img className="bb-hero-logo" src={logoEletroRota} alt="BB EletroRota" />

        <p className="bb-hero-subtitle">
          O caminho mais inteligente para carregar seu carro elétrico.
        </p>

        <p className="bb-hero-text">
          Encontre o melhor ponto de recarga, planeje suas viagens e calcule a autonomia do seu carro com tranquilidade.
        </p>
      </div>
    </section>
  );
}
