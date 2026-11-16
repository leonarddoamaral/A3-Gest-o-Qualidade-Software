import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronLeft, MapPin, Navigation, CheckCircle } from 'lucide-react';
import Input from '../../components/input/input';
import Button from '../../components/button/button';
import MenuBar from '../../components/menu-bar/menuBar';
import { cadastrarLocal } from '../../API/apiLocal';
import { cadastrarAula } from '../../API/apiAula';
import './professor.css';

import 'ol/ol.css';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import { fromLonLat, toLonLat } from 'ol/proj';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import { Vector as VectorSource } from 'ol/source';
import { Vector as VectorLayer } from 'ol/layer';
import { Style, Circle as CircleStyle, Fill, Stroke } from 'ol/style';

export default function CadastrarAula() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [titulo, setTitulo] = useState('');
  const [nomeLocal, setNomeLocal] = useState('');
  const [logradouro, setLogradouro] = useState('');
  const [cep, setCep] = useState('');
  const [dataAula, setDataAula] = useState('');
  const [horarioInicio, setHorarioInicio] = useState('');
  const [horarioFim, setHorarioFim] = useState('');
  const [acessibilidade, setAcessibilidade] = useState('');

  const [coordenadas, setCoordenadas] = useState<{ lat: number; lon: number }>({
    lat: -23.5731,
    lon: -46.6277,
  });

  const mapElement = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<Map | null>(null);
  const pinoRef = useRef<Feature | null>(null);

  useEffect(() => {
    if (!mapElement.current) return;

    const vectorSource = new VectorSource();
    const pino = new Feature({
      geometry: new Point(fromLonLat([coordenadas.lon, coordenadas.lat])),
    });

    pino.setStyle(
      new Style({
        image: new CircleStyle({
          radius: 12,
          fill: new Fill({ color: '#FF6B35' }),
          stroke: new Stroke({ color: '#ffffff', width: 3 }),
        }),
      })
    );

    vectorSource.addFeature(pino);
    pinoRef.current = pino;

    const map = new Map({
      target: mapElement.current,
      layers: [
        new TileLayer({ source: new OSM() }),
        new VectorLayer({ source: vectorSource }),
      ],
      view: new View({
        center: fromLonLat([coordenadas.lon, coordenadas.lat]),
        zoom: 15,
      }),
    });

    map.on('singleclick', (evt) => {
      const [lon, lat] = toLonLat(evt.coordinate);
      setCoordenadas({ lat, lon });
      if (pinoRef.current) {
        pinoRef.current.setGeometry(new Point(evt.coordinate));
      }
    });

    mapInstance.current = map;
    return () => map.setTarget(undefined);
  }, []);

  const usarMinhaLocalizacao = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((pos) => {
        const { latitude: lat, longitude: lon } = pos.coords;
        setCoordenadas({ lat, lon });

        const pontoMapa = fromLonLat([lon, lat]);
        if (pinoRef.current) pinoRef.current.setGeometry(new Point(pontoMapa));
        if (mapInstance.current) mapInstance.current.getView().animate({ center: pontoMapa, zoom: 16 });
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const professorId = localStorage.getItem('userId');
    if (!professorId) {
      alert('Sessão expirada. Faça login novamente.');
      navigate('/login');
      return;
    }

    setLoading(true);
    try {
      // 1. Cria o local no PostgreSQL com as coordenadas marcadas no mapa
      const localCriado = await cadastrarLocal({
        nome: nomeLocal,
        descricao: acessibilidade,
        logradouro: logradouro || nomeLocal,
        status: 'ATIVO',
        cep: cep || '00000-000',
        latitude: Number(coordenadas.lat.toFixed(6)),
        longitude: Number(coordenadas.lon.toFixed(6)),
      });

      // 2. Cria a aula vinculada ao professor e ao local recém-criado
      await cadastrarAula({
        idProfessor: Number(professorId),
        idLocal: localCriado.idLocal,
        titulo,
        descricao: acessibilidade,
        dataHoraInicio: `${dataAula}T${horarioInicio}:00`,
        dataHoraFinal: `${dataAula}T${horarioFim}:00`,
      });

      alert('Aula presencial publicada com sucesso!');
      navigate('/professor/minhas-aulas');
    } catch (error: any) {
      alert(error.message || 'Erro ao publicar aula.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="app-container prof-container">
      <header className="prof-header">
        <Link to="/professor/minhas-aulas" className="back-link">
          <ChevronLeft size={20} />
          <span>Minhas Turmas</span>
        </Link>
      </header>

      <section className="prof-content">
        <form className="aula-form" onSubmit={handleSubmit}>
          <Input
            type="text"
            id="titulo"
            text="Título da Aula"
            placeholder="Ex: Alongamento suave no parque"
            onChange={(e) => setTitulo(e.target.value)}
          />

          <Input
            type="date"
            id="dataAula"
            text="Data da Aula"
            placeholder="Ex: 2024-06-15"
            onChange={(e) => setDataAula(e.target.value)}
          />

          <div className="form-row">
            <Input
              type="time"
              id="horarioInicio"
              placeholder="Ex: 09:00"
              text="Início"
              onChange={(e) => setHorarioInicio(e.target.value)}
            />
            <Input
              type="time"
              id="horarioFim"
                placeholder="Ex: 10:00"
              text="Término"
              onChange={(e) => setHorarioFim(e.target.value)}
            />
          </div>

          <Input
            type="text"
            id="nomeLocal"
            text="Nome do Parque ou Praça"
            placeholder="Ex: Parque da Aclimação"
            onChange={(e) => setNomeLocal(e.target.value)}
          />

          <div className="form-row">
            <Input
              type="text"
              id="logradouro"
              text="Endereço / Referência"
              placeholder="Rua Muniz de Sousa, 1119"
              onChange={(e) => setLogradouro(e.target.value)}
            />
            <Input
              type="text"
              id="cep"
              text="CEP"
              placeholder="01534-001"
              onChange={(e) => setCep(e.target.value)}
            />
          </div>

          <div className="map-picker-group">
            <div className="map-picker-header">
              <label>
                <MapPin size={16} /> Toque no mapa para marcar o local
              </label>
              <button type="button" className="gps-mini-btn" onClick={usarMinhaLocalizacao}>
                <Navigation size={14} /> Usar GPS
              </button>
            </div>

            <div ref={mapElement} className="mini-ol-map" />

            <span className="coords-feedback">
              Lat: {coordenadas.lat.toFixed(5)} | Lon: {coordenadas.lon.toFixed(5)}
            </span>
          </div>

          <Input
            type="text"
            id="acessibilidade"
            text="Observações e Acessibilidade"
            placeholder="Ex: Ponto de encontro próximo aos bancos, piso plano"
            onChange={(e) => setAcessibilidade(e.target.value)}
          />

          <div style={{ marginTop: '12px' }}>
            <Button
              text={loading ? 'PUBLICANDO...' : 'PUBLICAR AULA'}
              icon={<CheckCircle size={20} />}
              type="submit"
            />
          </div>
        </form>
      </section>

      <MenuBar activePage="agenda" />
    </main>
  );
}