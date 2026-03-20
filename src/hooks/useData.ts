import { useState, useEffect } from 'react';

export interface Author {
  author_id: string;
  havza: string;
  meshur_isim: string;
  tam_isim: string;
  dogum_yili_h: number | null;
  dogum_yili_m: number | null;
  vefat_yili_h: number | null;
  vefat_yili_m: number | null;
  yuzyil: number | null;
  sehir: string;
  mezhep: string;
  kimlik: string;
  dia_slug: string;
  dia_url: string;
  eser_sayisi: number;
  // DİA enriched
  arabic_name?: string;
  birth_place?: string;
  death_place?: string;
  importance_score?: number | null;
  fields?: string;
  dia_short_desc?: string;
}

export interface Work {
  work_id: string;
  author_id: string;
  havza: string;
  eser_adi: string;
  dil: string;
  eser_turu: string;
  yazilma_sehri: string;
  kaynak_sayfa: number;
  tanitim: string;
  hanedan: string;
  diger_adlari?: string[];
}

export interface Relation {
  source: string;
  source_name: string;
  type: string;
  target: string;
  target_name: string;
  both_in_itta: boolean;
}

export interface Stats {
  total_scholars: number;
  total_works: number;
  total_havzas: number;
  dia_matches: number;
  dia_relations: number;
  dia_works: number;
  havza_counts: Record<string, number>;
  century_counts: Record<string, number>;
  type_counts: Record<string, number>;
  generated_at: string;
}

export type CityCoords = Record<string, [number, number]>;

export interface HavzaGeoFeature {
  type: 'Feature';
  properties: { id: string; name_tr: string; name_en: string; name_ar: string };
  geometry: { type: string; coordinates: number[][][] };
}

export interface HavzaGeoCollection {
  type: 'FeatureCollection';
  features: HavzaGeoFeature[];
}

const cache: Record<string, unknown> = {};
const BASE = import.meta.env.BASE_URL;

async function loadJSON<T>(path: string): Promise<T> {
  if (cache[path]) return cache[path] as T;
  const res = await fetch(BASE + path);
  const data = await res.json();
  cache[path] = data;
  return data as T;
}

export function useAuthors() {
  const [authors, setAuthors] = useState<Author[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    loadJSON<Author[]>('data/itta_authors.json').then(d => { setAuthors(d); setLoading(false); });
  }, []);
  return { authors, loading };
}

export function useWorks() {
  const [works, setWorks] = useState<Work[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    loadJSON<Work[]>('data/itta_works.json').then(d => { setWorks(d); setLoading(false); });
  }, []);
  return { works, loading };
}

export function useRelations() {
  const [relations, setRelations] = useState<Relation[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    loadJSON<Relation[]>('data/itta_relations.json').then(d => { setRelations(d); setLoading(false); });
  }, []);
  return { relations, loading };
}

export function useStats() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    loadJSON<Stats>('data/itta_stats.json').then(d => { setStats(d); setLoading(false); });
  }, []);
  return { stats, loading };
}

export function useCityCoords() {
  const [coords, setCoords] = useState<CityCoords>({});
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    loadJSON<CityCoords>('data/city_coords.json').then(d => { setCoords(d); setLoading(false); });
  }, []);
  return { coords, loading };
}

export function useHavzaGeo() {
  const [geo, setGeo] = useState<HavzaGeoCollection | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    loadJSON<HavzaGeoCollection>('data/havza_geo.json').then(d => { setGeo(d); setLoading(false); });
  }, []);
  return { geo, loading };
}
