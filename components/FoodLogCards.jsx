import React from "react";
import { useRouter } from "next/router";
import { Pagination } from "rsuite";
import { Eye, Trash2, Plus, CircleDot, UtensilsCrossed } from "lucide-react";

export default function FoodLogCards({
  groupedFoodLogs,
  calorieData,
  emoji,
  occasion,
  onEditClick,
  onDeleteClick,
}) {
  const router = useRouter();
  const occasionKey = occasion.toLowerCase();
  const totalCalories = calorieData?.[`total_${occasionKey}`] || 0;
  const mealLogs = groupedFoodLogs[occasionKey] || [];

  const [activePage, setActivePage] = React.useState(1);
  const LIMIT = 5;

  const paginatedLogs = React.useMemo(() => {
    const startIndex = LIMIT * (activePage - 1);
    return mealLogs.slice(startIndex, startIndex + LIMIT);
  }, [mealLogs, activePage]);

  return (
    <div className="group flex flex-1 flex-col p-6 bg-white rounded-4xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 h-[420px]">
      {/* HEADER SECTION */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-2xl shadow-inner group-hover:bg-green-50 transition-colors">
            {emoji}
          </div>
          <div>
            <h3 className="text-xl font-black text-gray-800 tracking-tight">
              {occasion}
            </h3>
            <p className="text-[#229100] font-bold text-xs uppercase tracking-widest">
              {totalCalories} kcal
            </p>
          </div>
        </div>

        <button
          className="bg-green-50 text-[#229100] p-2.5 rounded-xl hover:bg-[#229100] hover:text-white transition-all duration-300 shadow-sm active:scale-95"
          onClick={() => router.push("/calculator")}>
          <Plus size={20} strokeWidth={3} />
        </button>
      </div>

      {/* LOGS CONTAINER */}
      <div
        className={`
        flex-1 flex flex-col rounded-2xl overflow-hidden
        ${paginatedLogs.length > 0 ? "bg-white border border-gray-50" : "bg-gray-50/50 border border-dashed border-gray-200 justify-center"}
      `}>
        {paginatedLogs.length > 0 ? (
          <div className="flex flex-col h-full divide-y divide-gray-50">
            {paginatedLogs.map((food) => (
              <div
                key={food.id_food_log}
                className="group/item flex justify-between items-center p-3 hover:bg-gray-50 transition-colors">
                <div className="flex flex-col min-w-0 flex-1">
                  <span className="font-bold text-gray-800 text-sm truncate pr-2">
                    {food.food_name}
                  </span>
                  <div className="flex gap-2 mt-1">
                    <span className="bg-purple-50 text-purple-600 text-[10px] px-1.5 py-0.5 rounded-md font-bold uppercase">
                      P: {Math.round(food.protein_grams)}g
                    </span>
                    <span className="bg-orange-50 text-orange-600 text-[10px] px-1.5 py-0.5 rounded-md font-bold uppercase">
                      C: {Math.round(food.carbohydrate_grams)}g
                    </span>
                    <span className="bg-green-50 text-green-600 text-[10px] px-1.5 py-0.5 rounded-md font-bold uppercase">
                      F: {Math.round(food.fat_grams)}g
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-4 ml-2 shrink-0">
                  <p className="font-black text-gray-900 text-sm whitespace-nowrap">
                    {food.calories}{" "}
                    <span className="text-[10px] text-gray-400">kcal</span>
                  </p>

                  <div className="flex items-center gap-1 ">
                    <button
                      className="p-1.5 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-all"
                      onClick={() => onEditClick(food)}>
                      <Eye size={16} />
                    </button>
                    <button
                      className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                      onClick={() => onDeleteClick(food)}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3 py-10 opacity-40">
            <UtensilsCrossed size={40} className="text-gray-400" />
            <p className="text-sm font-bold text-gray-500 uppercase tracking-tighter">
              Fuel your day
            </p>
          </div>
        )}
      </div>

      {/* FOOTER / PAGINATION */}
      <div className="mt-4 pt-4 border-t border-gray-50 flex justify-between items-center">
        <div className="flex items-center gap-2 text-gray-400">
          <CircleDot size={12} className="text-[#229100]" />
          <span className="text-[10px] font-bold uppercase tracking-wider">
            Entries: {mealLogs.length}
          </span>
        </div>

        <Pagination
          size="xs"
          prev
          next
          maxButtons={3}
          total={mealLogs.length}
          limit={LIMIT}
          activePage={activePage}
          onChangePage={setActivePage}
          className="custom-mini-pagination"
        />
      </div>
    </div>
  );
}
