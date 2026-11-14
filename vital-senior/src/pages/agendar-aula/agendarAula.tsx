import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { 
  ChevronLeft, Search, Navigation, TreePine, ChevronRight 
} from 'lucide-react';
import MenuBar from '../../components/menu-bar/menuBar';
import { listarAulas } from '../../API/apiAula';
import type { DadosListagemAula } from '../../types/aula';
import './agendarAula.css';

// Importações do OpenLayers
import 'ol/ol.css';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import { fromLonLat } from 'ol/proj';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import { Vector as VectorSource } from 'ol/source';
import { Vector as VectorLayer } from 'ol/layer';
import { Style, Circle as CircleStyle, Fill, Stroke } from 'ol/style';

// Função de Haversine para calcular distância entre coordenadas (retorna em km)
function calcularDistancia(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371; // Raio da Terra em km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Formata LocalDateTime do Spring Boot (ex: "Qua. 09:00")
function formatarDiaHora(isoString: string) {
  const data = new Date(isoString);
  const dias = ['Dom.', 'Seg.', 'Ter.', 'Qua.', 'Qui.', 'Sex.', 'Sáb.'];
  const hora = data.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  return `${dias[data.getDay()]} ${hora}`;
}

export default function AgendarAula() {
  const [busca, setBusca] = useState('');
  const [aulas, setAulas] = useState<DadosListagemAula[]>([]);
  const [carregando, setCarregando] = useState(true);

  // Estado com a posição do utilizador (inicia próximo à Aclimação até clicar em "Você")
  const [posicaoUsuario, setPosicaoUsuario] = useState({ lon: -46.6330, lat: -23.5750 });

  // Referências do OpenLayers
  const mapElement = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<Map | null>(null);
  const vectorSourceRef = useRef<VectorSource>(new VectorSource());
  const marcadorUsuarioRef = useRef<Feature | null>(null);

  // 1. Busca aulas reais cadastradas no Spring Boot
  useEffect(() => {
    listarAulas()
      .then((dados) => {
        const ativas = dados.filter((a) => a.status !== 'CANCELADA' && a.local);
        setAulas(ativas);
      })
      .catch((error) => console.error('Erro ao buscar aulas:', error))
      .finally(() => setCarregando(false));
  }, []);

  // 2. Inicializa o Mapa do OpenLayers
  useEffect(() => {
    if (!mapElement.current) return;

    const marcadorUsuario = new Feature({
      geometry: new Point(fromLonLat([posicaoUsuario.lon, posicaoUsuario.lat])),
    });
    marcadorUsuario.setStyle(
      new Style({
        image: new CircleStyle({
          radius: 10,
          fill: new Fill({ color: '#007D83' }),
          stroke: new Stroke({ color: '#ffffff', width: 3 }),
        }),
      })
    );
    vectorSourceRef.current.addFeature(marcadorUsuario);
    marcadorUsuarioRef.current = marcadorUsuario;

    const map = new Map({
      target: mapElement.current,
      layers: [
        new TileLayer({ source: new OSM() }),
        new VectorLayer({ source: vectorSourceRef.current }),
      ],
      view: new View({
        center: fromLonLat([posicaoUsuario.lon, posicaoUsuario.lat]),
        zoom: 15,
      }),
    });

    mapInstance.current = map;

    return () => {
      map.setTarget(undefined);
    };
  }, []);

  // 3. Plota os pinos laranjas no mapa sempre que as aulas carregarem do backend
  useEffect(() => {
    const estiloAula = new Style({
      image: new CircleStyle({
        radius: 12,
        fill: new Fill({ color: '#FF6B35' }),
        stroke: new Stroke({ color: '#ffffff', width: 3 }),
      }),
    });

    aulas.forEach((aula) => {
      const feature = new Feature({
        geometry: new Point(
          fromLonLat([Number(aula.local.longitude), Number(aula.local.latitude)])
        ),
        nome: aula.local.nome,
      });
      feature.setStyle(estiloAula);
      vectorSourceRef.current.addFeature(feature);
    });
  }, [aulas]);

  // Pede a localização real e anima o mapa
  const buscarLocalizacaoReal = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lon = position.coords.longitude;
          const lat = position.coords.latitude;

          setPosicaoUsuario({ lon, lat });

          const coordenadasReais = fromLonLat([lon, lat]);

          if (marcadorUsuarioRef.current) {
            marcadorUsuarioRef.current.setGeometry(new Point(coordenadasReais));
          }

          if (mapInstance.current) {
            mapInstance.current.getView().animate({
              center: coordenadasReais,
              zoom: 16,
              duration: 1500,
            });
          }
        },
        (error) => {
          console.error('Erro ao obter localização:', error);
          alert('Por favor, permita o acesso à localização no seu navegador para usar esta funcionalidade.');
        }
      );
    } else {
      alert('O seu dispositivo não suporta geolocalização.');
    }
  };

  // Filtra e ordena as aulas reais num raio de até 2 km
  const aulasProximas = aulas
    .map((aula) => ({
      ...aula,
      distanciaKm: calcularDistancia(
        posicaoUsuario.lat,
        posicaoUsuario.lon,
        Number(aula.local.latitude),
        Number(aula.local.longitude)
      ),
    }))
    .filter(
      (aula) =>
        aula.distanciaKm <= 2 &&
        (aula.local.nome.toLowerCase().includes(busca.toLowerCase()) ||
          aula.titulo.toLowerCase().includes(busca.toLowerCase()))
    )
    .sort((a, b) => a.distanciaKm - b.distanciaKm);

  return (
    <main className="app-container agendar-container">
      {/* Secção Superior do Mapa */}
      <section className="map-section">
        <div ref={mapElement} className="ol-map-container" />

        <div className="map-ui-overlay">
          <header className="agendar-header">
            <Link to="/agenda" className="back-link">
              <ChevronLeft size={20} />
              <span>Agenda</span>
            </Link>
          </header>

          <div className="search-bar-wrapper">
            <Search size={20} className="search-icon" />
            <input
              type="text"
              placeholder="Parques e praças próximos"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="search-input"
            />
          </div>
        </div>

        <button className="user-location-btn" onClick={buscarLocalizacaoReal}>
          <Navigation size={16} />
          <span>Você</span>
        </button>
      </section>

      {/* Secção da Lista de Locais (Rolável) */}
      <section className="locations-section">
        <div className="locations-header">
          <h2>Locais próximos</h2>
          <span className="distance-badge">Até 2 km</span>
        </div>

        <div className="locations-list">
          {carregando ? (
            <p style={{ textAlign: 'center', color: '#64748B', marginTop: '20px' }}>
              Buscando locais próximos...
            </p>
          ) : (
            aulasProximas.map((aula) => {
              const distFormatada =
                aula.distanciaKm < 1
                  ? `${Math.round(aula.distanciaKm * 1000)} m`
                  : `${aula.distanciaKm.toFixed(1).replace('.', ',')} km`;

              const horario = formatarDiaHora(aula.dataHoraInicio);

              return (
                <Link
                  key={aula.idAula}
                  to={`/confirmar-aula/${aula.idAula}`}
                  className="location-card"
                  style={{ textDecoration: 'none', color: 'inherit' }}
                >
                  <div className="loc-icon-wrapper">
                    <TreePine size={24} strokeWidth={2} />
                  </div>

                  <div className="loc-info">
                    <h3>{aula.local.nome}</h3>
                    <p>
                      {aula.titulo} • {distFormatada} - {horario}
                    </p>
                    <span className="loc-spots">Prof. {aula.nomeProfessor}</span>
                  </div>

                  <ChevronRight size={20} className="loc-chevron" />
                </Link>
              );
            })
          )}

          {!carregando && aulasProximas.length === 0 && (
            <p style={{ textAlign: 'center', color: '#64748B', marginTop: '20px', fontWeight: 500 }}>
              Nenhum local encontrado num raio de 2 km.
            </p>
          )}
        </div>
      </section>

      <MenuBar activePage="agenda" />
    </main>
  );
}