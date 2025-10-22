import { useEffect, useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Star, Loader2, Search } from "lucide-react";
import Header from "@/components/Header";

interface Anime {
  mal_id: number;
  title: string;
  images: {
    jpg: {
      image_url: string;
      small_image_url: string;
    };
  };
  score: number;
  type: string;
  year: number;
  synopsis: string;
}

interface ApiResponse {
  data: Anime[];
  pagination: {
    last_visible_page: number;
    has_next_page: boolean;
  };
}

export default function Home() {
  const [animes, setAnimes] = useState<Anime[]>([]);
  const [filteredAnimes, setFilteredAnimes] = useState<Anime[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch top animes from Jikan API
  useEffect(() => {
    const fetchTopAnimes = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch 4 pages of 25 animes each to get 100 animes
        const allAnimes: Anime[] = [];

        for (let page = 1; page <= 4; page++) {
          const response = await fetch(
            `https://api.jikan.moe/v4/top/anime?filter=bypopularity&page=${page}&limit=25`
          );

          if (!response.ok) {
            throw new Error("Falha ao carregar animes");
          }

          const data: ApiResponse = await response.json();
          allAnimes.push(...data.data);

          // Add a small delay to respect rate limiting
          if (page < 4) {
            await new Promise((resolve) => setTimeout(resolve, 500));
          }
        }

        setAnimes(allAnimes);
        setFilteredAnimes(allAnimes);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Erro ao carregar animes"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchTopAnimes();
  }, []);

  // Handle search
  const handleSearch = (query: string) => {
    setSearchQuery(query);

    if (query.trim() === "") {
      setFilteredAnimes(animes);
    } else {
      const filtered = animes.filter((anime) =>
        anime.title.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredAnimes(filtered);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header onSearch={handleSearch} />

      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="mb-12">
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
            Descubra os Animes Mais Populares
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Explore uma coleção curada dos 100 animes mais populares do MyAnimeList. Encontre suas próximas séries favoritas com informações detalhadas, avaliações e sinopses.
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
            <span className="ml-3 text-lg text-muted-foreground">
              Carregando animes...
            </span>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-6">
            <p className="text-red-500 font-semibold">Erro ao carregar animes</p>
            <p className="text-red-500/80 text-sm">{error}</p>
          </div>
        )}

        {/* Results Info */}
        {!loading && filteredAnimes.length > 0 && (
          <div className="mb-6 text-sm text-muted-foreground">
            Mostrando <span className="font-semibold">{filteredAnimes.length}</span> de{" "}
            <span className="font-semibold">{animes.length}</span> animes
            {searchQuery && ` (pesquisa: "${searchQuery}")`}
          </div>
        )}

        {/* Anime Grid */}
        {!loading && filteredAnimes.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredAnimes.map((anime) => (
              <Link key={anime.mal_id} href={`/anime/${anime.mal_id}`}>
                <a className="group">
                  <Card className="overflow-hidden h-full hover:shadow-lg transition-shadow duration-300 hover:border-purple-500/50">
                    {/* Image Container */}
                    <div className="relative overflow-hidden bg-muted aspect-[3/4]">
                      <img
                        src={anime.images.jpg.image_url}
                        alt={anime.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      {anime.score > 0 && (
                        <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-sm rounded-lg px-2 py-1 flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                          <span className="text-sm font-semibold text-white">
                            {anime.score.toFixed(1)}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-4">
                      <h3 className="font-semibold text-foreground line-clamp-2 mb-2 group-hover:text-purple-500 transition-colors">
                        {anime.title}
                      </h3>

                      {/* Badges */}
                      <div className="flex flex-wrap gap-1 mb-3">
                        {anime.type && (
                          <Badge variant="secondary" className="text-xs">
                            {anime.type}
                          </Badge>
                        )}
                        {anime.year > 0 && (
                          <Badge variant="secondary" className="text-xs">
                            {anime.year}
                          </Badge>
                        )}
                      </div>

                      {/* Synopsis Preview */}
                      <p className="text-xs text-muted-foreground line-clamp-3">
                        {anime.synopsis || "Sem sinopse disponível"}
                      </p>
                    </div>
                  </Card>
                </a>
              </Link>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredAnimes.length === 0 && animes.length > 0 && (
          <div className="text-center py-12">
            <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-semibold mb-2">Nenhum anime encontrado</h3>
            <p className="text-muted-foreground mb-6">
              Tente uma pesquisa diferente ou navegue por todos os animes
            </p>
            <Button
              variant="outline"
              onClick={() => {
                setSearchQuery("");
                setFilteredAnimes(animes);
              }}
            >
              Ver Todos os Animes
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}

