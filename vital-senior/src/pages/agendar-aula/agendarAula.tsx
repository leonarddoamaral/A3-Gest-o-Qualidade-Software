import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { 
  ChevronLeft, Search, Navigation, TreePine, ChevronRight 
} from 'lucide-react';
import MenuBar from '../../components/menu-bar/menuBar';
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

export default function AgendarAula() {
  const [busca, setBusca] = useState('');
  
  // Estado com a posição do utilizador (inicia com uma posição simulada)
  const [posicaoUsuario, setPosicaoUsuario] = useState({ lon: -46.6330, lat: -23.5750 });
  
  // Referência para ligar o OpenLayers ao HTML
  const mapElement = useRef<HTMLDivElement>(null);

  // Guardam o mapa e o pino do utilizador na memória com a tipagem correta
  const mapInstance = useRef<Map | null>(null);
  const marcadorUsuarioRef = useRef<Feature | null>(null);

  // Pede a localização real e anima o mapa
  const buscarLocalizacaoReal = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lon = position.coords.longitude;
          const lat = position.coords.latitude;
          
          // Atualiza o estado para que a lista recalcule as distâncias
          setPosicaoUsuario({ lon, lat });

          const coordenadasReais = fromLonLat([lon, lat]);

          // Move o pino verde para a posição real
          if (marcadorUsuarioRef.current) {
            marcadorUsuarioRef.current.setGeometry(new Point(coordenadasReais));
          }

          // Move a "câmera" do mapa suavemente para onde o utilizador está
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
  
  // Dados simulados da sua base de dados com Latitude e Longitude
  const locais = [
    {
      id: 1,
      nome: 'Parque da Aclimação',
      detalhes: '900 m - Qua. 09:00', // Manteremos o horário cortando a string depois
      vagas: 4,
      lon: -46.6277,
      lat: -23.5731 
    },
    {
      id: 2,
      nome: 'Parque do Carmo',
      detalhes: '1,4 km - Qua. 16:00',
      vagas: 7,
      lon: -46.467399577771616,
      lat: -23.56895236111588
    }
  ];

  useEffect(() => {
    if (!mapElement.current) return;

    const vectorSource = new VectorSource();

    const estiloAula = new Style({
      image: new CircleStyle({
        radius: 12,
        fill: new Fill({ color: '#FF6B35' }),
        stroke: new Stroke({ color: '#ffffff', width: 3 }),
      }),
    });

    locais.forEach((local) => {
      const feature = new Feature({
        geometry: new Point(fromLonLat([local.lon, local.lat])),
        nome: local.nome,
      });
      feature.setStyle(estiloAula);
      vectorSource.addFeature(feature);
    });

    const marcadorUsuario = new Feature({
      geometry: new Point(fromLonLat([posicaoUsuario.lon, posicaoUsuario.lat])),
    });
    marcadorUsuario.setStyle(new Style({
      image: new CircleStyle({
        radius: 10,
        fill: new Fill({ color: '#007D83' }),
        stroke: new Stroke({ color: '#ffffff', width: 3 }),
      }),
    }));
    vectorSource.addFeature(marcadorUsuario);
    marcadorUsuarioRef.current = marcadorUsuario;

    const map = new Map({
      target: mapElement.current,
      layers: [
        new TileLayer({
          source: new OSM(), 
        }),
        new VectorLayer({
          source: vectorSource, 
        }),
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
          {locais
            // 1. Calcula a distância e anexa ao objeto
            .map(local => ({
              ...local,
              distanciaKm: calcularDistancia(posicaoUsuario.lat, posicaoUsuario.lon, local.lat, local.lon)
            }))
            // 2. Filtra locais até 2km e aplica a busca por texto (caso a barra de pesquisa seja usada)
            .filter(local => local.distanciaKm <= 2 && local.nome.toLowerCase().includes(busca.toLowerCase()))
            // 3. Ordena do mais perto para o mais longe
            .sort((a, b) => a.distanciaKm - b.distanciaKm)
            // 4. Renderiza os cartões
            .map((local) => {
              // Formata a distância para exibição (ex: "900 m" ou "1,4 km")
              const distFormatada = local.distanciaKm < 1 
                ? `${Math.round(local.distanciaKm * 1000)} m` 
                : `${local.distanciaKm.toFixed(1).replace('.', ',')} km`;

              // Extrai apenas a parte do horário que vem no texto estático (ex: "Qua. 09:00")
              const horario = local.detalhes.split(' - ')[1] || '';

              return (
                <Link 
                  key={local.id} 
                  to="/confirmar-aula" 
                  className="location-card"
                  style={{ textDecoration: 'none', color: 'inherit' }}
                >
                  <div className="loc-icon-wrapper">
                    <TreePine size={24} strokeWidth={2} />
                  </div>
                  
                  <div className="loc-info">
                    <h3>{local.nome}</h3>
                    <p>{distFormatada} - {horario}</p>
                    <span className="loc-spots">{local.vagas} vagas</span>
                  </div>
                  
                  <ChevronRight size={20} className="loc-chevron" />
                </Link>
              );
            })}
            
            {/* Mensagem caso não encontre nenhum local num raio de 2km */}
            {locais.filter(l => calcularDistancia(posicaoUsuario.lat, posicaoUsuario.lon, l.lat, l.lon) <= 2 && l.nome.toLowerCase().includes(busca.toLowerCase())).length === 0 && (
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