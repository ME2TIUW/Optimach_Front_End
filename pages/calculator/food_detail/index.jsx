import React, { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/router";
import {
  SelectPicker,
  InputGroup,
  Input,
  useToaster,
  Notification,
  ButtonToolbar,
  Button,
} from "rsuite";
import {
  Plus,
  Scale,
  Flame,
  Zap,
  Droplets,
  BicepsFlexed,
  ExternalLink,
} from "lucide-react";
import ApiFatSecret from "@/pages/api/fatSecret/api_fatsecret";
import Masterdata_ApiFood from "@/pages/api/masterdata/food/api_food";
import HamburgerButton from "@/components/HamburgerButton";
import SideBar from "@/components/SideBar";
import ApiFoodLog from "@/pages/api/api_food_log";
import FoodLogModal from "@/components/FoodLogModal";
import Heading from "@/components/Heading";
import Footer from "@/components/Footer";

// --- Import Skeletons ---
import SkeletonFoodHero from "@/components/skeleton/food_detail/SkeletonFoodHero";
import SkeletonMacroTiles from "@/components/skeleton/food_detail/SkeletonMacroTiles";
import SkeletonNutritionLabel from "@/components/skeleton/food_detail/SkeletonNutritionLabel";

// --- Constants & Dummy Data ---
const DUMMY_DAILY_VALUES = {
  fat: "13%",
  saturated_fat: "8%",
  cholesterol: "8%",
  sodium: "15%",
  carbohydrate: "4%",
  fiber: "0%",
  protein: "22%",
  iron: "3%",
  calcium: "0%",
  potassium: "3%",
};

const MAX_SERVING_WEIGHT = 5000;
const MIN_SERVING_WEIGHT = 0;

// --- Modernized UI Components ---
const NutritionRow = ({
  label,
  value = "0",
  dailyPercent,
  sub = false,
  bold = false,
}) => (
  <div
    className={`flex justify-between items-center py-3 border-b border-gray-50 ${sub ? "pl-4" : ""}`}>
    <span
      className={`${bold ? "font-bold text-gray-800" : "text-gray-500"} text-sm`}>
      {label}
    </span>
    <div className="flex items-center gap-4">
      <span className="font-bold text-[#229100] text-sm">{value || "0"}</span>
      {dailyPercent && (
        <span className="text-[10px] font-black text-gray-300 w-10 text-right uppercase tracking-tighter">
          {dailyPercent}
        </span>
      )}
    </div>
  </div>
);

const MacroCard = ({ label, value, color, Icon }) => (
  <div className="bg-white p-5 rounded-4xl border border-gray-100 shadow-sm flex flex-col items-center justify-center transition-all hover:shadow-md hover:-translate-y-1">
    <div
      className={`p-2.5 rounded-xl mb-3`}
      style={{ backgroundColor: `${color}15`, color: color }}>
      <Icon size={22} />
    </div>
    <span className="text-2xl font-black text-gray-800 leading-none">
      {value || 0}
    </span>
    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-2">
      {label}
    </span>
  </div>
);

export default function FoodDetailPage() {
  const router = useRouter();
  const toaster = useToaster();

  // State Management
  const [foodDetails, setFoodDetails] = useState(null);
  const [selectedServingIndex, setSelectedServingIndex] = useState(0);
  const [userData, setUserData] = useState({});
  const [selectedOccasion, setSelectedOccasion] = useState(null);
  const [addToDiaryModal, setAddToDiaryModal] = useState(false);
  const [quantity, setQuantity] = useState(null);
  const [expanded, setExpanded] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const foodId = router.query.foodId;
  const searchSource = router.query.searchSource;

  const showNotification = (type, message, duration = 2000) => {
    toaster.push(
      <Notification type={type} header={type} closable>
        <p>{message}</p>
        {message === "Food added to diary successfully!" && (
          <ButtonToolbar style={{ marginTop: "10px" }}>
            <Button
              appearance="primary"
              color="green"
              onClick={() => router.push("/home")}>
              Visit Diary
            </Button>
          </ButtonToolbar>
        )}
      </Notification>,
      { placement: "topEnd", duration },
    );
  };

  const rawServings = foodDetails?.servings?.serving;
  const normalizedServings = useMemo(() => {
    return Array.isArray(rawServings)
      ? rawServings
      : rawServings
        ? [rawServings]
        : [];
  }, [rawServings]);

  const selectedServing = normalizedServings[selectedServingIndex] || null;

  const checkScalability = (serving) => {
    if (!serving) return false;
    const baseAmount = parseFloat(serving.metric_serving_amount);
    const hasValidWeight = baseAmount > 0;
    if (searchSource === "Optimach") return hasValidWeight;
    const unit = serving.metric_serving_unit?.toLowerCase();
    return (unit === "g" || unit === "mg" || unit === "kg") && hasValidWeight;
  };

  const isScalableServingSelected = useMemo(
    () => checkScalability(selectedServing),
    [selectedServing],
  );

  const servingData = normalizedServings.map((serving, index) => ({
    label: `${serving.serving_description} ${serving.metric_serving_amount ? `(${serving.metric_serving_amount}${serving.metric_serving_unit})` : ""}`,
    value: index,
  }));

  const scaledServing = useMemo(() => {
    const customServing = parseFloat(quantity);
    const baseServingWeight = parseFloat(
      selectedServing?.metric_serving_amount,
    );

    if (
      !isScalableServingSelected ||
      isNaN(customServing) ||
      customServing <= 0 ||
      customServing === 1 ||
      isNaN(baseServingWeight) ||
      baseServingWeight <= 0
    ) {
      return selectedServing;
    }

    const scaled = {};
    const safeScale = (key, originalValue, customServing) => {
      const num = parseFloat(originalValue);
      if (isNaN(num)) return originalValue;
      const scaledNum = (num * customServing) / baseServingWeight;
      return key === "calories"
        ? String(Math.round(scaledNum))
        : String(scaledNum.toFixed(1));
    };

    for (const key in selectedServing) {
      const originalValue = selectedServing[key];
      if (
        typeof originalValue === "string" &&
        /^\d+(\.\d+)?$/.test(originalValue)
      ) {
        scaled[key] = safeScale(key, originalValue, customServing);
      } else if (key === "serving_description") {
        scaled.serving_description = `${customServing}g`;
      } else {
        scaled[key] = originalValue;
      }
    }
    return scaled;
  }, [selectedServing, quantity, isScalableServingSelected]);

  useEffect(() => {
    if (!router.isReady || !foodId) return;
    const fetchDetails = async () => {
      setIsLoading(true);
      try {
        let res =
          searchSource === "Optimach"
            ? await Masterdata_ApiFood().GetDetailFood({
                food_id: String(foodId),
              })
            : await ApiFatSecret().getFoodDetailById({ food_id: foodId });

        if (res.status === 200 && res.results?.food)
          setFoodDetails(res.results.food);
        else setError(res.message || "Failed to load details.");
      } catch (err) {
        setError("Network error.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchDetails();
  }, [foodId, router.isReady]);

  useEffect(() => {
    const data = localStorage.getItem("userData");
    if (data) setUserData(JSON.parse(data));
  }, []);

  const handleAddToDiary = async () => {
    const payload = {
      id_user: parseInt(userData?.id_user),
      food_name: foodDetails?.food_name,
      protein_grams: parseFloat(scaledServing?.protein),
      carbohydrate_grams: parseFloat(scaledServing?.carbohydrate),
      fat_grams: parseFloat(scaledServing?.fat),
      weight_grams:
        parseFloat(quantity) ||
        parseFloat(scaledServing?.metric_serving_amount),
      calories: parseInt(scaledServing?.calories),
      occasion: selectedOccasion,
    };
    try {
      setIsLoading(true);
      const res = await ApiFoodLog().PostCreateFoodLog(payload);
      if (res.status === 200) {
        showNotification("success", "Food added to diary successfully!", 2500);
        setAddToDiaryModal(false);
      } else if (res.status === 401) {
        setIsLoading(true);
      } else {
        showNotification(
          "error",
          `Failed to add food to diary: ${res.message}`,
        );
      }
    } catch (error) {
      showNotification("error", "Failed to add food to diary.");
    } finally {
      setIsLoading(false);
      setSelectedOccasion(null);
    }
  };

  return (
    <div className="flex h-screen w-full bg-[#f9fafb] overflow-hidden">
      <SideBar expanded={expanded} setExpanded={setExpanded} />

      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <div className="flex-1 overflow-y-auto p-4 md:px-10 md:py-4 custom-scrollbar">
          {/* Header Action Bar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 md:gap-4 gap-8">
            <div className="flex items-center">
              {!expanded && (
                <HamburgerButton setSidebarExpanded={setExpanded} />
              )}
              <div
                className={`flex-1 self-center ${!expanded ? "-translate-x-4" : ""}`}>
                <Heading Header={"Food Details"} />
              </div>
            </div>
          </div>

          <div className="max-w-4xl mx-auto space-y-8 pb-20">
            {!isLoading && foodDetails ? (
              <>
                {/* HERO CARD */}
                <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-10 opacity-[0.03] pointer-events-none">
                    <Flame size={160} strokeWidth={1} />
                  </div>

                  <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div className="flex-1 w-full">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="bg-green-50 text-[#229100] px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
                          {foodDetails.brand_name || "Standard Reference"}
                        </span>
                      </div>
                      <h1 className="text-3xl md:text-5xl font-black text-gray-800 tracking-tight leading-tight">
                        {foodDetails.food_name}
                      </h1>
                    </div>

                    <button
                      onClick={() => setAddToDiaryModal(true)}
                      className="w-full md:w-auto flex justify-center items-center gap-2 bg-[#229100] text-white! px-6 py-3 rounded-3xl! font-bold shadow-lg shadow-green-100 hover:bg-green-700 hover:-translate-y-0.5 transition-all active:scale-95 whitespace-nowrap">
                      <Plus size={20} strokeWidth={3} />
                      Add to Diary
                    </button>
                  </div>

                  {/* INPUTS SECTION */}
                  <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-gray-50/50 rounded-3xl">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
                        Serving Unit
                      </label>
                      <SelectPicker
                        data={servingData}
                        block
                        cleanable={false}
                        value={selectedServingIndex}
                        onChange={setSelectedServingIndex}
                        className="rounded-xl border-none shadow-sm"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
                        Custom Amount (g)
                      </label>
                      <InputGroup className="bg-white border-gray-100 rounded-xl overflow-hidden h-[42px] shadow-sm">
                        <InputGroup.Addon className="bg-gray-50 border-none text-gray-400 font-bold">
                          g
                        </InputGroup.Addon>
                        <Input
                          type="number"
                          min={0}
                          onKeyDown={(e) =>
                            ["-", "e", "E"].includes(e.key) &&
                            e.preventDefault()
                          }
                          placeholder="100"
                          className="font-bold text-gray-800"
                          value={quantity}
                          onChange={(val) => {
                            if (val > MAX_SERVING_WEIGHT) return;
                            setQuantity(val);
                          }}
                          disabled={!isScalableServingSelected}
                        />
                      </InputGroup>
                    </div>
                  </div>
                </div>

                {/* QUICK MACRO TILES */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <MacroCard
                    label="Calories"
                    value={scaledServing?.calories}
                    color="#229100"
                    Icon={Flame}
                  />
                  <MacroCard
                    label="Protein"
                    value={scaledServing?.protein}
                    color="#8B5CF6"
                    Icon={Zap}
                  />
                  <MacroCard
                    label="Carbs"
                    value={scaledServing?.carbohydrate}
                    color="#F97316"
                    Icon={Droplets}
                  />
                  <MacroCard
                    label="Fat"
                    value={scaledServing?.fat}
                    color="#76b800"
                    Icon={BicepsFlexed}
                  />
                </div>

                {/* DETAILED NUTRITION */}
                <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
                  <div className="px-8 py-6 border-b border-gray-50 flex justify-between items-center bg-gray-50/30">
                    <h3 className="font-black text-gray-800 uppercase tracking-tight">
                      Full Nutritional Label
                    </h3>
                    <div className="flex items-center gap-2 bg-white px-3 py-1 rounded-full border border-gray-100">
                      <Scale size={14} className="text-gray-400" />
                      <span className="text-[10px] font-bold text-gray-500 uppercase">
                        {scaledServing?.serving_description}
                      </span>
                    </div>
                  </div>

                  <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-1">
                    <NutritionRow
                      label="Total Fat"
                      value={`${scaledServing?.fat}g`}
                      dailyPercent={DUMMY_DAILY_VALUES.fat}
                      bold
                    />
                    <NutritionRow
                      label="Saturated Fat"
                      value={`-`}
                      dailyPercent={DUMMY_DAILY_VALUES.saturated_fat}
                      sub
                    />
                    <NutritionRow
                      label="Cholesterol"
                      value={`-`}
                      dailyPercent={DUMMY_DAILY_VALUES.cholesterol}
                      bold
                    />
                    <NutritionRow
                      label="Sodium"
                      value={`-`}
                      dailyPercent={DUMMY_DAILY_VALUES.sodium}
                      bold
                    />
                    <NutritionRow
                      label="Total Carbohydrate"
                      value={`${scaledServing?.carbohydrate}g`}
                      dailyPercent={DUMMY_DAILY_VALUES.carbohydrate}
                      bold
                    />
                    <NutritionRow
                      label="Dietary Fiber"
                      value={`-`}
                      dailyPercent={DUMMY_DAILY_VALUES.fiber}
                      sub
                    />
                    <NutritionRow label="Sugar" value={`-`} sub />
                    <NutritionRow
                      label="Protein"
                      value={`${scaledServing?.protein}g`}
                      dailyPercent={DUMMY_DAILY_VALUES.protein}
                      bold
                    />
                    <NutritionRow
                      label="Potassium"
                      value={`-`}
                      dailyPercent={DUMMY_DAILY_VALUES.potassium}
                    />
                    <NutritionRow
                      label="Iron"
                      value={`-`}
                      dailyPercent={DUMMY_DAILY_VALUES.iron}
                    />
                    <NutritionRow
                      label="Calcium"
                      value={`-`}
                      dailyPercent={DUMMY_DAILY_VALUES.calcium}
                    />
                  </div>

                  <div className="px-8 py-6 bg-gray-50/50 text-[10px] text-gray-400 font-medium italic border-t border-gray-100">
                    <p>
                      * Percent Daily Values are based on a 2,000 calorie diet.
                    </p>
                    <p className="mt-1 flex items-center gap-1">
                      <ExternalLink size={10} /> Source: {searchSource} API
                      Platform
                    </p>
                  </div>
                </div>
              </>
            ) : (
              // --- SKELETON LOADING STATE ---
              <>
                <SkeletonFoodHero />
                <SkeletonMacroTiles />
                <SkeletonNutritionLabel />
              </>
            )}
            <Footer />
          </div>
        </div>
      </main>

      <FoodLogModal
        openModal={addToDiaryModal}
        setOpenModal={setAddToDiaryModal}
        modalType="Add"
        foodData={foodDetails}
        scaledServing={scaledServing}
        handleConfirmAction={handleAddToDiary}
        selectedOccasion={selectedOccasion}
        setSelectedOccasion={setSelectedOccasion}
        isLoading={isLoading}
        quantity={quantity}
      />
    </div>
  );
}
