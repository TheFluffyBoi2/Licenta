const SmallGameCard = ({ game, rank, isUpcoming = false }) => (
  <div className="relative bg-gray-50 dark:bg-[#1a1a1a] cursor-pointer rounded-lg overflow-hidden hover:ring-2 hover:ring-[#FFD700] transition-all group">
    <div className="absolute top-2 left-2 z-10">
      <div className="bg-gray-300 dark:bg-[#343434] text-gray-900 dark:text-white px-3 py-1 rounded-md font-bold text-sm shadow-md">
        #{rank}
      </div>
    </div>

    <div className="absolute top-2 right-2 z-10">
      <StatusButton gameId={game.id} />
    </div>

    <div className="relative h-48">
      <img
        src={game.cover.url}
        alt={game.name}
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-gray-50 dark:from-[#1a1a1a] via-transparent to-transparent" />
    </div>

    <div className="p-4">
      <h3 className="font-bold mb-2 line-clamp-1 text-gray-900 dark:text-white">
        {game.name}
      </h3>

      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {new Date(game.first_release_date * 1000).toLocaleDateString("en-UK")}
        </span>

        {game.aggregated_rating && (
          <div className="flex items-center gap-1 text-sm">
            <Star className="w-4 h-4 fill-[#FFD700] text-[#FFD700]" />
            <span className="font-semibold text-gray-900 dark:text-white">
              {Math.round(game.aggregated_rating)}
            </span>
          </div>
        )}
      </div>
    </div>
  </div>
);

export default SmallGameCard;
