const StatusButton = ({ gameId }) => {
  const status = gameStatuses[gameId];

  return (
    <div className="relative group">
      <button className="p-2 bg-gray-100 dark:bg-[#1a1a1a] hover:bg-gray-200 dark:hover:bg-[#2a2a2a] rounded-lg transition-all">
        {status === "planToPlay" ? (
          <Clock className="w-5 h-5 text-blue-500 dark:text-blue-400" />
        ) : status === "playing" ? (
          <Play className="w-5 h-5 text-green-500 dark:text-green-400" />
        ) : status === "finished" ? (
          <Check className="w-5 h-5 text-yellow-500 dark:text-yellow-400" />
        ) : (
          <Plus className="w-5 h-5 text-gray-700 dark:text-gray-300" />
        )}
      </button>

      <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-[#2a2a2a] rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10 border border-gray-200 dark:border-gray-700">
        <button
          onClick={() => handleStatusChange(gameId, "planToPlay")}
          className="w-full px-4 py-2 text-left text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-[#3a3a3a] rounded-t-lg flex items-center gap-2 transition-colors"
        >
          <Clock className="w-4 h-4 text-blue-500 dark:text-blue-400" />
          Plan to Play
        </button>
        <button
          onClick={() => handleStatusChange(gameId, "playing")}
          className="w-full px-4 py-2 text-left text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-[#3a3a3a] flex items-center gap-2 transition-colors"
        >
          <Play className="w-4 h-4 text-green-500 dark:text-green-400" />
          Playing Now
        </button>
        <button
          onClick={() => handleStatusChange(gameId, "finished")}
          className="w-full px-4 py-2 text-left text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-[#3a3a3a] rounded-b-lg flex items-center gap-2 transition-colors"
        >
          <Check className="w-4 h-4 text-yellow-500 dark:text-yellow-400" />
          Finished
        </button>
      </div>
    </div>
  );
};

export default StatusButton;
