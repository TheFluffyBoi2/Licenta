import React, { useState } from "react";
import { Star, Plus, Check, Clock, Play } from "lucide-react";

const HomePage = () => {
  const [gameStatuses, setGameStatuses] = useState({});

  // Mock data - în producție ar veni din API
  const recommendedGames = [
    {
      id: 1,
      title: "The Last of Us Part II",
      rating: 9.2,
      year: 2020,
      genres: ["Action", "Adventure"],
      image:
        "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800",
      description:
        "Experience Ellie's journey of revenge and redemption in a post-apocalyptic world.",
      platform: "PS5, PS4",
    },
    {
      id: 2,
      title: "Elden Ring",
      rating: 9.5,
      year: 2022,
      genres: ["RPG", "Action"],
      image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800",
      description:
        "Explore a vast fantasy world filled with danger and discovery.",
      platform: "Multi-platform",
    },
    // Adaugă mai multe jocuri...
  ];

  const top10AllTime = [
    {
      id: 1,
      title: "The Witcher 3",
      rating: 9.8,
      description:
        "Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi pretium tellus duis convallis. Tempus leo eu aenean sed diam urna tempor. Pulvinar vivamus fringilla lacus nec metus bibendum egestas. Iaculis massa nisl malesuada lacinia integer nunc posuere. Ut hendrerit semper vel class aptent taciti sociosqu. Ad litora torquent per conubia nostra inceptos himenaeos.",
      year: 2015,
      genres: ["Action", "Adventure"],
      image:
        "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=400",
    },
    {
      id: 2,
      title: "Red Dead Redemption 2",
      rating: 9.7,
      description:
        "Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi pretium tellus duis convallis. Tempus leo eu aenean sed diam urna tempor. Pulvinar vivamus fringilla lacus nec metus bibendum egestas. Iaculis massa nisl malesuada lacinia integer nunc posuere. Ut hendrerit semper vel class aptent taciti sociosqu. Ad litora torquent per conubia nostra inceptos himenaeos.",

      year: 2018,
      genres: ["Action", "Adventure"],
      image: "https://images.unsplash.com/photo-1552820728-8b83bb6b773f?w=400",
    },
    {
      id: 3,
      title: "God of War",
      description:
        "Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi pretium tellus duis convallis. Tempus leo eu aenean sed diam urna tempor. Pulvinar vivamus fringilla lacus nec metus bibendum egestas. Iaculis massa nisl malesuada lacinia integer nunc posuere. Ut hendrerit semper vel class aptent taciti sociosqu. Ad litora torquent per conubia nostra inceptos himenaeos.",

      rating: 9.6,
      year: 2018,
      genres: ["Action", "Adventure"],
      image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400",
    },
    {
      id: 4,
      title: "Breath of the Wild",
      rating: 9.5,
      year: 2017,
      genres: ["Action", "Adventure"],
      image:
        "https://images.unsplash.com/photo-1578374173705-75a5c1bdb3da?w=400",
    },
    {
      id: 5,
      title: "Half-Life 2",
      rating: 9.5,
      year: 2004,
      genres: ["Action", "Adventure"],
      image: "https://images.unsplash.com/photo-1560419015-7c427e8ae5ba?w=400",
    },
    {
      id: 6,
      title: "Portal 2",
      rating: 9.4,
      year: 2011,
      genres: ["Action", "Adventure"],
      image: "https://images.unsplash.com/photo-1556438064-2d7646166914?w=400",
    },
    {
      id: 7,
      title: "Dark Souls",
      rating: 9.3,
      year: 2011,
      genres: ["Action", "Adventure"],
      image:
        "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=400",
    },
    {
      id: 8,
      title: "Bloodborne",
      rating: 9.3,
      year: 2015,
      genres: ["Action", "Adventure"],
      image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400",
    },
    {
      id: 9,
      title: "Mass Effect 2",
      rating: 9.2,
      year: 2010,
      genres: ["Action", "Adventure"],
      image: "https://images.unsplash.com/photo-1552820728-8b83bb6b773f?w=400",
    },
    {
      id: 10,
      title: "Hades",
      rating: 9.2,
      year: 2020,
      genres: ["Action", "Adventure"],
      image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400",
    },
  ];

  const top10Upcoming = [
    {
      id: 11,
      title: "Hollow Knight: Silksong",
      rating: null,
      description:
        "Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi pretium tellus duis convallis. Tempus leo eu aenean sed diam urna tempor. Pulvinar vivamus fringilla lacus nec metus bibendum egestas. Iaculis massa nisl malesuada lacinia integer nunc posuere. Ut hendrerit semper vel class aptent taciti sociosqu. Ad litora torquent per conubia nostra inceptos himenaeos.",

      releaseDate: "TBA 2026",
      genres: ["Action", "Adventure"],
      image:
        "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=400",
    },
    {
      id: 12,
      title: "Elder Scrolls VI",
      rating: null,
      description:
        "Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi pretium tellus duis convallis. Tempus leo eu aenean sed diam urna tempor. Pulvinar vivamus fringilla lacus nec metus bibendum egestas. Iaculis massa nisl malesuada lacinia integer nunc posuere. Ut hendrerit semper vel class aptent taciti sociosqu. Ad litora torquent per conubia nostra inceptos himenaeos.",

      releaseDate: "2027",
      genres: ["Action", "Adventure"],
      image: "https://images.unsplash.com/photo-1552820728-8b83bb6b773f?w=400",
    },
    {
      id: 13,
      title: "Grand Theft Auto VI",
      rating: null,
      description:
        "Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi pretium tellus duis convallis. Tempus leo eu aenean sed diam urna tempor. Pulvinar vivamus fringilla lacus nec metus bibendum egestas. Iaculis massa nisl malesuada lacinia integer nunc posuere. Ut hendrerit semper vel class aptent taciti sociosqu. Ad litora torquent per conubia nostra inceptos himenaeos.",

      releaseDate: "Fall 2026",
      genres: ["Action", "Adventure"],
      image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400",
    },
    {
      id: 14,
      title: "Metroid Prime 4",
      rating: null,
      releaseDate: "2026",
      genres: ["Action", "Adventure"],
      image:
        "https://images.unsplash.com/photo-1578374173705-75a5c1bdb3da?w=400",
    },
    {
      id: 15,
      title: "Perfect Dark",
      rating: null,
      releaseDate: "2026",
      genres: ["Action", "Adventure"],
      image: "https://images.unsplash.com/photo-1560419015-7c427e8ae5ba?w=400",
    },
    {
      id: 16,
      title: "Fable",
      rating: null,
      releaseDate: "2026",
      genres: ["Action", "Adventure"],
      image: "https://images.unsplash.com/photo-1556438064-2d7646166914?w=400",
    },
    {
      id: 17,
      title: "Star Wars: Eclipse",
      rating: null,
      releaseDate: "TBA",
      genres: ["Action", "Adventure"],
      image:
        "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=400",
    },
    {
      id: 18,
      title: "Wolverine",
      rating: null,
      releaseDate: "2026",
      genres: ["Action", "Adventure"],
      image:
        "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400",
    },
    {
      id: 19,
      title: "Death Stranding 2",
      rating: null,
      releaseDate: "2026",
      genres: ["Action", "Adventure"],
      image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400",
    },
    {
      id: 20,
      title: "Judas",
      rating: null,
      releaseDate: "2026",
      genres: ["Action", "Adventure"],
      image: "https://images.unsplash.com/photo-1552820728-8b83bb6b773f?w=400",
    },
  ];

  const top10NewReleases = [
    {
      id: 21,
      title: "Dragon's Dogma 2",
      rating: 8.8,
      year: 2024,
      description:
        "Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi pretium tellus duis convallis. Tempus leo eu aenean sed diam urna tempor. Pulvinar vivamus fringilla lacus nec metus bibendum egestas. Iaculis massa nisl malesuada lacinia integer nunc posuere. Ut hendrerit semper vel class aptent taciti sociosqu. Ad litora torquent per conubia nostra inceptos himenaeos.",

      genres: ["Action", "Adventure"],
      image:
        "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=400",
    },
    {
      id: 22,
      title: "Helldivers 2",
      rating: 9.1,
      year: 2024,
      description:
        "Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi pretium tellus duis convallis. Tempus leo eu aenean sed diam urna tempor. Pulvinar vivamus fringilla lacus nec metus bibendum egestas. Iaculis massa nisl malesuada lacinia integer nunc posuere. Ut hendrerit semper vel class aptent taciti sociosqu. Ad litora torquent per conubia nostra inceptos himenaeos.",

      genres: ["Action", "Adventure"],
      image: "https://images.unsplash.com/photo-1552820728-8b83bb6b773f?w=400",
    },
    {
      id: 23,
      title: "Final Fantasy VII Rebirth",
      rating: 9.3,
      description:
        "Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi pretium tellus duis convallis. Tempus leo eu aenean sed diam urna tempor. Pulvinar vivamus fringilla lacus nec metus bibendum egestas. Iaculis massa nisl malesuada lacinia integer nunc posuere. Ut hendrerit semper vel class aptent taciti sociosqu. Ad litora torquent per conubia nostra inceptos himenaeos.",

      year: 2024,
      genres: ["Action", "Adventure"],
      image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400",
    },
    {
      id: 24,
      title: "Like a Dragon: Infinite Wealth",
      rating: 8.9,
      year: 2024,
      genres: ["Action", "Adventure"],
      image:
        "https://images.unsplash.com/photo-1578374173705-75a5c1bdb3da?w=400",
    },
    {
      id: 25,
      title: "Prince of Persia: Lost Crown",
      rating: 8.7,
      year: 2024,
      genres: ["Action", "Adventure"],
      image: "https://images.unsplash.com/photo-1560419015-7c427e8ae5ba?w=400",
    },
    {
      id: 26,
      title: "Persona 3 Reload",
      rating: 9.0,
      year: 2024,
      genres: ["Action", "Adventure"],
      image: "https://images.unsplash.com/photo-1556438064-2d7646166914?w=400",
    },
    {
      id: 27,
      title: "Tekken 8",
      rating: 8.8,
      year: 2024,
      genres: ["Action", "Adventure"],
      image:
        "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=400",
    },
    {
      id: 28,
      title: "Balatro",
      rating: 9.2,
      year: 2024,
      genres: ["Action", "Adventure"],
      image:
        "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400",
    },
    {
      id: 29,
      title: "Palworld",
      rating: 8.5,
      year: 2024,
      genres: ["Action", "Adventure"],
      image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400",
    },
    {
      id: 30,
      title: "Unicorn Overlord",
      rating: 8.6,
      year: 2024,
      genres: ["Action", "Adventure"],
      image: "https://images.unsplash.com/photo-1552820728-8b83bb6b773f?w=400",
    },
  ];

  const handleStatusChange = (gameId, status) => {
    setGameStatuses((prev) => ({
      ...prev,
      [gameId]: status,
    }));
  };

  const StatusButton = ({ gameId }) => {
    const status = gameStatuses[gameId];

    return (
      <div className="relative group">
        <button className="p-2 bg-[#1a1a1a] hover:bg-[#2a2a2a] rounded-lg transition-all">
          {status === "planToPlay" ? (
            <Clock className="w-5 h-5 text-blue-400" />
          ) : status === "playing" ? (
            <Play className="w-5 h-5 text-green-400" />
          ) : status === "finished" ? (
            <Check className="w-5 h-5 text-yellow-400" />
          ) : (
            <Plus className="w-5 h-5" />
          )}
        </button>

        <div className="absolute right-0 top-full mt-2 w-48 bg-[#2a2a2a] rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
          <button
            onClick={() => handleStatusChange(gameId, "planToPlay")}
            className="w-full px-4 py-2 text-left hover:bg-[#3a3a3a] rounded-t-lg flex items-center gap-2"
          >
            <Clock className="w-4 h-4 text-blue-400" />
            Plan to Play
          </button>
          <button
            onClick={() => handleStatusChange(gameId, "playing")}
            className="w-full px-4 py-2 text-left hover:bg-[#3a3a3a] flex items-center gap-2"
          >
            <Play className="w-4 h-4 text-green-400" />
            Playing Now
          </button>
          <button
            onClick={() => handleStatusChange(gameId, "finished")}
            className="w-full px-4 py-2 text-left hover:bg-[#3a3a3a] rounded-b-lg flex items-center gap-2"
          >
            <Check className="w-4 h-4 text-yellow-400" />
            Finished
          </button>
        </div>
      </div>
    );
  };

  function LargeRank({ rank }) {
    const isFirst = rank == 1;
    const isSecond = rank == 2;
    const isThird = rank == 3;

    if (isFirst)
      return (
        <div className="bg-[#EFBF04] text-white px-4 py-2 rounded-lg font-bold text-2xl">
          #{rank}
        </div>
      );
    else if (isSecond)
      return (
        <div className="bg-[#A7A7AD] text-white px-4 py-2 rounded-lg font-bold text-2xl">
          #{rank}
        </div>
      );
    else if (isThird)
      return (
        <div className="bg-[#A77044] text-white px-4 py-2 rounded-lg font-bold text-2xl">
          #{rank}
        </div>
      );
    else
      return (
        <div className="bg-[#4DFFBC] text-white px-4 py-2 rounded-lg font-bold text-2xl">
          #{rank}
        </div>
      );
  }

  function LargeRank({ rank }) {
    const isFirst = rank == 1;
    const isSecond = rank == 2;
    const isThird = rank == 3;

    if (isFirst)
      return (
        <div className="bg-[#EFBF04] text-white px-4 py-2 rounded-lg font-bold text-2xl">
          #{rank}
        </div>
      );
    else if (isSecond)
      return (
        <div className="bg-[#A7A7AD] text-white px-4 py-2 rounded-lg font-bold text-2xl">
          #{rank}
        </div>
      );
    else if (isThird)
      return (
        <div className="bg-[#A77044] text-white px-4 py-2 rounded-lg font-bold text-2xl">
          #{rank}
        </div>
      );
  }

  const LargeGameCard = ({ game, rank }) => (
    <div className="relative bg-[#1a1a1a] rounded-xl overflow-hidden hover:ring-2 hover:ring-[#FFD700] transition-all group">
      <div className="absolute top-4 left-4 z-10">
        <LargeRank rank={rank} />
      </div>

      <div className="absolute top-4 right-4 z-10">
        <StatusButton gameId={game.id} />
      </div>

      <div className="relative h-60">
        <img
          src={game.image}
          alt={game.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-linear-to-t from-[#1a1a1a] via-transparent to-transparent" />
      </div>

      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="text-2xl font-bold mb-1">{game.title}</h3>
            <div className="flex items-center gap-3 text-gray-400 text-sm">
              <span>{game.year}</span>
              <span>•</span>
              <span>{game.platform}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-[#2a2a2a] px-3 py-2 rounded-lg">
            <Star className="w-5 h-5 fill-[#FFD700] text-[#FFD700]" />
            <span className="text-xl font-bold">{game.rating}</span>
          </div>
        </div>

        <div className="flex gap-2 mb-3">
          {game.genres.map((genre) => (
            <span
              key={genre}
              className="px-3 py-1 bg-[#2a2a2a] rounded-full text-sm"
            >
              {genre}
            </span>
          ))}
        </div>

        <p className="text-gray-400 text-sm line-clamp-2">{game.description}</p>
      </div>
    </div>
  );

  const SmallGameCard = ({ game, rank, isUpcoming = false }) => (
    <div className="relative bg-[#1a1a1a] rounded-lg overflow-hidden hover:ring-2 hover:ring-[#FFD700] transition-all group">
      <div className="absolute top-2 left-2 z-10">
        <div className="bg-[#343434] text-white px-3 py-1 rounded-md font-bold">
          #{rank}
        </div>
      </div>

      <div className="absolute top-2 right-2 z-10">
        <StatusButton gameId={game.id} />
      </div>

      <div className="relative h-48">
        <img
          src={game.image}
          alt={game.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-linear-to-t from-[#1a1a1a] via-transparent to-transparent" />
      </div>

      <div className="p-4">
        <h3 className="font-bold mb-2 line-clamp-1">{game.title}</h3>

        <div className="flex items-center justify-between">
          {isUpcoming ? (
            <span className="text-sm text-gray-400">{game.releaseDate}</span>
          ) : (
            <span className="text-sm text-gray-400">{game.year}</span>
          )}

          {game.rating && (
            <div className="flex items-center gap-1 text-sm">
              <Star className="w-4 h-4 fill-[#FFD700] text-[#FFD700]" />
              <span className="font-semibold">{game.rating}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="pb-12 flex flex-col gap-3 max-w-400 mx-auto">
      <div className="bg-white dark:bg-[#1C1C1C] rounded-2xl text-black dark:text-white px-8 py-4 shadow-lg transition-all duration-500 ease-in-out">
        {/* Recommended for You */}
        <div className="flex items-center gap-3 mb-6">
          <h2 className="text-3xl font-bold">Recommended for You</h2>
          <div className="h-1 grow bg-linear-to-r from-[#FFD700] to-transparent rounded" />
        </div>
        <section>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {recommendedGames.slice(0, 2).map((game, idx) => (
              <LargeGameCard key={game.id} game={game} rank={idx + 1} />
            ))}
          </div>
        </section>
      </div>

      <div className="bg-white dark:bg-[#1C1C1C] rounded-2xl text-black dark:text-white px-6 py-4 shadow-lg transition-all duration-500 ease-in-out">
        {/* Top 10 All Time */}
        <div className="flex items-center gap-3 mb-6">
          <h2 className="text-3xl font-bold">Top 10 All Time</h2>
          <div className="h-1 grow bg-linear-to-r from-[#FFD700] to-transparent rounded" />
        </div>
        <section>
          {/* Top 3 Large Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {top10AllTime.slice(0, 3).map((game, idx) => (
              <LargeGameCard key={game.id} game={game} rank={idx + 1} />
            ))}
          </div>

          {/* Remaining 7 Small Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
            {top10AllTime.slice(3, 10).map((game, idx) => (
              <SmallGameCard key={game.id} game={game} rank={idx + 4} />
            ))}
          </div>
        </section>
      </div>

      <div className="bg-white dark:bg-[#1C1C1C] rounded-2xl text-black dark:text-white px-6 py-4 shadow-lg transition-all duration-500 ease-in-out">
        {/* Top 10 Upcoming */}
        <div className="flex items-center gap-3 mb-6">
          <h2 className="text-3xl font-bold">Top 10 Most Anticipated</h2>
          <div className="h-1 grow bg-linear-to-r from-[#FFD700] to-transparent rounded" />
        </div>
        <section>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {top10Upcoming.slice(0, 3).map((game, idx) => (
              <LargeGameCard key={game.id} game={game} rank={idx + 1} />
            ))}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
            {top10Upcoming.slice(3, 10).map((game, idx) => (
              <SmallGameCard
                key={game.id}
                game={game}
                rank={idx + 4}
                isUpcoming={true}
              />
            ))}
          </div>
        </section>
      </div>

      <div className="bg-white dark:bg-[#1C1C1C] rounded-2xl text-black dark:text-white px-6 py-4 shadow-lg transition-all duration-500 ease-in-out">
        {/* Top 10 New Releases */}
        <div className="flex items-center gap-3 mb-6">
          <h2 className="text-3xl font-bold">Top 10 New Releases</h2>
          <div className="h-1 grow bg-linear-to-r from-[#FFD700] to-transparent rounded" />
        </div>
        <section>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {top10NewReleases.slice(0, 3).map((game, idx) => (
              <LargeGameCard key={game.id} game={game} rank={idx + 1} />
            ))}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
            {top10NewReleases.slice(3, 10).map((game, idx) => (
              <SmallGameCard key={game.id} game={game} rank={idx + 4} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default HomePage;
