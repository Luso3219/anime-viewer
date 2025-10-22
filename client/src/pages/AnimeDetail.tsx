import { useEffect, useState } from "react";
import { useParams, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Star, Users, Calendar, Tv } from "lucide-react";

interface AnimeData {
  mal_id: number;
  title: string;
  images: {
    jpg: {
      image_url: string;
      small_image_url: string;
      large_image_url: string;
    };
  };
  synopsis: string;
  score: number;
  scored_by: number;
  rank: number;
  popularity: number;
  year: number;
  type: string;
  episodes: number | null;
  status: string;
  genres: Array<{ mal_id: number; type: string; name: string; url: string }>;
  studios: Array<{ mal_id: number; type: string; name: string; url: string }>;
  aired: {
    from: string;
    to: string | null;
  };
}

export default function AnimeDetail() {
  const { id } = useParams<{ id: string }>();
  const [, setLocation] = useLocation();
  const [anime, setAnime] = useState<AnimeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnimeDetail = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(`https://api.jikan.moe/v4/anime/${id}`);
        if (!response.ok) {
          throw new Error("Falha ao carregar detalhes do anime");
        }
        const data = await response.json();
        setAnime(data.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erro desconhecido");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchAnimeDetail();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Button variant="ghost" onClick={() => setLocation("/")} className="mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar
        </Button>
        <div className="text-center">Carregando...</div>
      </div>
    );
  }

  if (error || !anime) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Button variant="ghost" onClick={() => setLocation("/")} className="mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar
        </Button>
        <div className="text-center text-red-500">{error || "Anime não encontrado"}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Button variant="ghost" onClick={() => setLocation("/")} className="mb-6">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Voltar
      </Button>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Poster */}
        <div className="md:col-span-1">
          <img
            src={anime.images.jpg.large_image_url}
            alt={anime.title}
            className="w-full rounded-lg shadow-lg object-cover"
          />
          <div className="mt-4 space-y-2">
            {anime.score > 0 && (
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                <span className="font-semibold">{anime.score.toFixed(2)}</span>
                <span className="text-sm text-muted-foreground">
                  ({anime.scored_by.toLocaleString()} votos)
                </span>
              </div>
            )}
            {anime.rank > 0 && (
              <div className="text-sm text-muted-foreground">
                Ranking: #{anime.rank}
              </div>
            )}
            {anime.popularity > 0 && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Users className="w-4 h-4" />
                Popularidade: #{anime.popularity}
              </div>
            )}
          </div>
        </div>

        {/* Conteúdo */}
        <div className="md:col-span-2">
          <h1 className="text-4xl font-bold mb-2">{anime.title}</h1>

          {/* Badges */}
          <div className="flex flex-wrap gap-2 mb-6">
            <Badge variant="secondary">{anime.type}</Badge>
            <Badge variant="secondary">{anime.status}</Badge>
            {anime.year > 0 && <Badge variant="secondary">{anime.year}</Badge>}
          </div>

          {/* Informações principais */}
          <div className="grid grid-cols-2 gap-4 mb-6 p-4 bg-muted rounded-lg">
            {anime.episodes && (
              <div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                  <Tv className="w-4 h-4" />
                  Episódios
                </div>
                <div className="text-lg font-semibold">{anime.episodes}</div>
              </div>
            )}
            {anime.aired?.from && (
              <div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                  <Calendar className="w-4 h-4" />
                  Lançamento
                </div>
                <div className="text-lg font-semibold">
                  {new Date(anime.aired.from).getFullYear()}
                </div>
              </div>
            )}
          </div>

          {/* Gêneros */}
          {anime.genres && anime.genres.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3">Gêneros</h3>
              <div className="flex flex-wrap gap-2">
                {anime.genres.map((genre) => (
                  <Badge key={genre.mal_id} variant="outline">
                    {genre.name}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Estúdios */}
          {anime.studios && anime.studios.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3">Estúdios</h3>
              <div className="flex flex-wrap gap-2">
                {anime.studios.map((studio) => (
                  <Badge key={studio.mal_id} variant="outline">
                    {studio.name}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Sinopse */}
          {anime.synopsis && (
            <div>
              <h3 className="text-lg font-semibold mb-3">Sinopse</h3>
              <Card className="p-4 bg-muted/50">
                <p className="text-foreground leading-relaxed">{anime.synopsis}</p>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

