import { NextResponse } from 'next/server';

export const revalidate = 900; // Cache 15 minutos

export async function GET() {
  const fallbackEpisode = {
    episodeId: "75136124",
    title: "Equidad y Complementariedad Energética",
    episodeNumber: "EPISODIO 03",
    subtitle: "Nuevas miradas para transformar",
    description: "Descubre nuestra conversación más reciente sobre sostenibilidad, innovación y soluciones.",
    spreakerUrl: "https://www.spreaker.com/episode/3-equidad-y-complementariedad-energetica--75136124",
    spreakerShowUrl: "https://www.spreaker.com/podcast/the-other-narrative--7175122",
    spotifyShowUrl: "https://open.spotify.com/show/033PCu2aysmpjGuazxZ0Oz",
    podimoShowUrl: "https://podimo.com/en/shows/the-other-narrative",
    imageUrl: "https://d3wo5wojvuv7l.cloudfront.net/t_square_limited_160/images.spreaker.com/original/38cb7bb9be1eef3a684443b1042baa38.jpg",
    publishedAt: "15 de septiembre de 2026",
    duration: "33 min",
  };

  try {
    const res = await fetch('https://api.spreaker.com/v2/shows/7175122/episodes', {
      headers: {
        'Accept': 'application/json',
      },
      next: { revalidate: 900 }
    });

    if (!res.ok) {
      return NextResponse.json(fallbackEpisode);
    }

    const data = await res.json();
    const items = data?.response?.items;

    if (items && items.length > 0) {
      const latest = items[0];
      const rawTitle = latest.title || fallbackEpisode.title;
      const cleanTitle = rawTitle.replace(/^\d+[\.\-\s]+/, '');
      const epNumMatch = rawTitle.match(/^\d+/);
      const epNum = epNumMatch ? `EPISODIO ${epNumMatch[0].padStart(2, '0')}` : fallbackEpisode.episodeNumber;

      return NextResponse.json({
        episodeId: String(latest.episode_id || fallbackEpisode.episodeId),
        title: cleanTitle || rawTitle,
        fullTitle: rawTitle,
        episodeNumber: epNum,
        description: fallbackEpisode.description,
        spreakerUrl: latest.site_url || fallbackEpisode.spreakerUrl,
        spreakerShowUrl: fallbackEpisode.spreakerShowUrl,
        spotifyShowUrl: fallbackEpisode.spotifyShowUrl,
        podimoShowUrl: fallbackEpisode.podimoShowUrl,
        imageUrl: latest.image_url || fallbackEpisode.imageUrl,
        publishedAt: latest.published_at || fallbackEpisode.publishedAt,
        duration: latest.duration ? `${Math.round(latest.duration / 60000)} min` : fallbackEpisode.duration,
      });
    }

    return NextResponse.json(fallbackEpisode);
  } catch (error) {
    console.error('Error fetching latest podcast episode from Spreaker:', error);
    return NextResponse.json(fallbackEpisode);
  }
}
