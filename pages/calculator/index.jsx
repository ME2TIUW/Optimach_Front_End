import { useEffect, useState } from "react";
import ApiFatSecret from "../api/fatSecret/api_fatsecret";
import { useRouter } from "next/router";
import SideBar from "@/components/SideBar";
import HamburgerButton from "@/components/HamburgerButton";
import { Button, ButtonToolbar, Notification, useToaster } from "rsuite"; // Removed Loader from imports
import { Search, Database, Info } from "lucide-react";
import FoodDatabaseToggle from "@/components/FoodDatabaseToggle";
import FoodLogModal from "@/components/FoodLogModal";
import Masterdata_ApiFood from "../api/masterdata/food/api_food";
import ApiFoodLog from "../api/api_food_log";
import Heading from "@/components/Heading";
import useSWR from "swr";
import SkeletonSearchResult from "@/components/skeleton/calculator/SkeletonFoodResults";

export default function CalculatorPage() {
  const router = useRouter();
  const toaster = useToaster();

  // State
  const [searchSource, setSearchSource] = useState("Optimach");
  const [selectedOccasion, setSelectedOccasion] = useState(null);
  const [userData, setUserData] = useState({});
  const [expanded, setExpanded] = useState(true);
  const [manualModalOpen, setManualModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeQuery, setActiveQuery] = useState("");
  const [validationError, setValidationError] = useState(null);

  // Notifications
  const showNotification = (type, message) => {
    toaster.push(
      <Notification type={type} header={type.toUpperCase()} closable>
        <p className="text-sm font-medium">{message}</p>
        {message === "Manual log added successfully." && (
          <ButtonToolbar className="mt-2">
            <Button
              appearance="primary"
              color="green"
              size="xs"
              onClick={() => router.push("/home")}>
              Visit Diary
            </Button>
          </ButtonToolbar>
        )}
      </Notification>,
      { placement: "topEnd", duration: 3000 },
    );
  };

  const {
    data: results,
    error: apiError,
    isLoading,
  } = useSWR(
    activeQuery ? ["search-food", activeQuery, searchSource] : null,

    async ([_, query, source]) => {
      const res =
        source === "fatSecret"
          ? await ApiFatSecret().searchFood({ query })
          : await Masterdata_ApiFood().GetFoodListByName({ query });

      if (res.status !== 200) {
        showNotification("info", res.message || "Error fetching food data");
        throw new Error(res.message);
      }

      return res.results.foods.food;
    },
  );

  const handleSearch = async (e) => {
    if (e) e.preventDefault();
    if (!searchTerm.trim()) {
      setValidationError("Please enter a food name.");
      return;
    }
    setActiveQuery(searchTerm.trim());
    setValidationError(null);
  };

  const handleManualSubmit = async (manualData) => {
    const payload = { ...manualData, id_user: userData?.id_user };
    try {
      const res = await ApiFoodLog().PostCreateFoodLog(payload);
      if (res.status === 200) {
        showNotification("success", "Manual log added successfully.");
        setManualModalOpen(false);
      }
    } catch (error) {
      showNotification("error", "Error adding log.");
    }
  };

  useEffect(() => {
    const data = localStorage.getItem("userData");
    if (data) setUserData(JSON.parse(data));
  }, []);

  return (
    <div className="flex h-screen w-full bg-[#f9fafb] overflow-hidden">
      {/* 1. Sidebar - Same configuration as Home */}
      <SideBar expanded={expanded} setExpanded={setExpanded} />

      {/* 2. Main Container */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        <div className="flex-1 overflow-y-auto p-4 md:px-10 md:py-4 custom-scrollbar">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 md:gap-4 gap-8">
            <div className="flex items-center">
              {!expanded && (
                <HamburgerButton setSidebarExpanded={setExpanded} />
              )}
              <div
                className={`flex-1 self-center ${!expanded ? "-translate-x-4" : ""}`}>
                <Heading Header={"Nutrition Calculator"} />
              </div>
            </div>
          </div>

          {/* Search Controls Section */}
          <div className="flex items-center justify-center md:justify-start gap-2">
            <div>
              <button
                onClick={() => setManualModalOpen(true)}
                className=" bg-[#229100] text-white! px-5 py-3 mb-6! rounded-2xl! font-bold! shadow-lg shadow-green-100 hover:bg-green-700 transition-all active:scale-95">
                <span>Manual Entry</span>
              </button>
            </div>
          </div>
          <div className="max-w-5xl mx-auto mb-12">
            <div className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-gray-100">
              <div className="flex flex-col items-center gap-6">
                <div className="flex items-center gap-2 text-gray-400">
                  <Database size={16} />
                  <span className="text-[10px] font-bold uppercase tracking-widest">
                    Select Food Database
                  </span>
                </div>

                <FoodDatabaseToggle
                  activeTab={searchSource}
                  onTabChange={setSearchSource}
                />

                <form onSubmit={handleSearch} className="relative w-full">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setValidationError(null);
                    }}
                    placeholder="Search Foods.."
                    className="w-full h-14 pl-6 pr-32 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-green-500/20 transition-all text-gray-800 placeholder:text-gray-400 font-medium"
                  />
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="absolute h-14 right-0 top-0 bottom-0 px-6 bg-[#229100] text-white! rounded-br-2xl! rounded-tr-2xl! font-bold! flex items-center gap-2 hover:bg-green-700 transition-all">
                    <Search size={18} />
                    <span>Search</span>
                  </button>
                </form>
                {apiError && (
                  <p className="text-red-500 text-xs font-bold">
                    {apiError.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* RESULTS GRID */}
          <div className="min-h-[400px]">
            {isLoading ? (
              // --- SKELETON LOADING STATE ---
              <SkeletonSearchResult />
            ) : results ? (
              results.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {results.map((food) => (
                    <FoodResultCard
                      key={food.food_id}
                      food={food}
                      onClick={() =>
                        router.push(
                          `/calculator/food_detail?foodId=${food.food_id}&searchSource=${searchSource}`,
                        )
                      }
                    />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-20 text-gray-300">
                  <Info size={48} />
                  <p className="mt-4 font-bold">
                    No results found for "{activeQuery}"
                  </p>
                </div>
              )
            ) : (
              <div className="flex flex-col items-center justify-center py-20 opacity-20">
                <Search size={80} strokeWidth={1} />
                <p className="mt-4 font-black text-2xl tracking-tighter uppercase">
                  Ready to Search
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      <FoodLogModal
        openModal={manualModalOpen}
        setOpenModal={setManualModalOpen}
        modalType="Manual"
        handleConfirmAction={handleManualSubmit}
        foodData={null}
        selectedOccasion={selectedOccasion}
        setSelectedOccasion={setSelectedOccasion}
        isLoading={false}
      />
    </div>
  );
}

// --- Sub-component for Search Results ---
function FoodResultCard({ food, onClick }) {
  // Parse description: "Per 100g - Calories: 52kcal | Fat: 0.17g | Carbs: 13.81g | Protein: 0.26g"
  const parts = food.food_description.split("-")[1].split("|");
  const calories = parts[0].split(":")[1].trim();

  return (
    <div
      onClick={onClick}
      className="group bg-white p-5 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer flex flex-col gap-10  h-48">
      <div>
        <h5 className="font-black text-gray-800 text-lg leading-tight group-hover:text-[#229100]! transition-colors truncate mb-1">
          {food.food_name}
        </h5>
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
          {parts[0].split(":")[0].replace("Calories", "").trim()}
        </p>
      </div>

      <div className="mt-auto">
        <div className="flex justify-between items-end">
          <p className="text-2xl font-black text-[#229100] leading-none">
            {calories.replace("kcal", "")}{" "}
            <span className="text-[10px] text-gray-400 font-bold uppercase">
              kcal
            </span>
          </p>
        </div>

        <div className="flex gap-2 mt-4 pt-3 border-t border-gray-50">
          {parts.slice(1).map((macro, idx) => (
            <span
              key={idx}
              className="text-[9px] font-black text-gray-400 uppercase whitespace-nowrap">
              {macro.split(":")[0].trim().substring(0, 1)}:{" "}
              {macro.split(":")[1].trim()}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
