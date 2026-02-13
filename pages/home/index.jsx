import { useEffect, useMemo, useState } from "react";
import HamburgerButton from "@/components/HamburgerButton";
import { useRouter } from "next/router";
import SideBar from "@/components/SideBar";
import useSWR from "swr";
import { Button, Modal, useToaster, Notification, DatePicker } from "rsuite";
import ApiDiary from "../api/api_diary";
import ApiFoodLog from "../api/api_food_log";
import FoodLogCards from "@/components/FoodLogCards";
import FoodLogModal from "@/components/FoodLogModal";
import Heading from "@/components/Heading";
import Footer from "@/components/Footer";
import SkeletonFoodCard from "@/components/skeleton/home/SkeletonFoodCard";
import SkeletonFoodDiaryDashboard from "@/components/skeleton/home/SkeletonFoodDiary";

const fetcherFoodLog = async ([id_user, date, timezone]) => {
  const res = await ApiFoodLog().GetDetailFoodLogListByIdUser({
    id_user,
    created_date: date,
    timezone,
  });
  if (res.status !== 200) throw new Error("Failed to fetch food logs");
  return res.data;
};

const fetcherDiary = async ([id_user, date]) => {
  const res = await ApiDiary().getDiaryByDate({ id_user, date });
  if (res.status !== 200) return {};
  return res.data;
};

const MacroDisplay = ({ label, value, color }) => (
  <div className="flex flex-col justify-center items-center text-center px-2">
    <div className="text-2xl md:text-4xl font-black text-gray-800">
      {Math.round(value || 0)}
      <span className="text-xs md:text-sm font-bold ml-0.5 text-gray-400 uppercase">
        g
      </span>
    </div>
    <p
      className="font-bold text-[10px] md:text-xs uppercase tracking-widest mt-1"
      style={{ color }}>
      {label}
    </p>
  </div>
);

export default function HomePage() {
  const router = useRouter();
  const toaster = useToaster();

  const [userData, setUserData] = useState({});
  const [expanded, setExpanded] = useState(true);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedFoodLog, setSelectedFoodLog] = useState(null);
  const [selectedOccasion, setSelectedOccasion] = useState(null);

  const currentDate = new Intl.DateTimeFormat("en-CA").format(new Date());
  const userTimezone = useMemo(
    () => Intl.DateTimeFormat().resolvedOptions().timeZone,
    [],
  );
  const [diaryDate, setDiaryDate] = useState(currentDate);

  const handleEditClick = (foodLog) => {
    setSelectedFoodLog(foodLog);
    setSelectedOccasion(foodLog.occasion);
    setEditModalOpen(true);
  };

  const {
    data: diaryData,
    mutate: mutateDiary,
    isLoading: isDiaryLoading,
  } = useSWR(
    userData?.id_user ? [userData.id_user, diaryDate] : null,
    fetcherDiary,
  );

  const {
    data: foodLogDataRaw,
    mutate: mutateFoodLogs,
    isLoading: isFoodLogsLoading,
  } = useSWR(
    userData?.id_user ? [userData.id_user, diaryDate, userTimezone] : null,
    fetcherFoodLog,
  );

  const calorieData = diaryData || {};
  const foodLogData = foodLogDataRaw || [];

  useEffect(() => {
    const localUser = localStorage.getItem("userData");
    if (localUser) setUserData(JSON.parse(localUser));
  }, []);

  const showNotification = (type, message) => {
    toaster.push(
      <Notification type={type} header={type.toUpperCase()} closable>
        <p>{message}</p>
      </Notification>,
      { placement: "topEnd", duration: 2000 },
    );
  };

  const handleUpdateFoodLog = async (updatedLog = selectedFoodLog) => {
    setIsActionLoading(true);
    const payload = {
      id_user: userData?.id_user,
      id_food_log: updatedLog?.id_food_log,
      food_name: updatedLog?.food_name,
      protein_grams: updatedLog?.protein_grams,
      carbohydrate_grams: updatedLog?.carbohydrate_grams,
      fat_grams: updatedLog?.fat_grams,
      weight_grams: updatedLog?.weight_grams,
      calories: updatedLog?.calories,
      occasion: selectedOccasion,
    };
    try {
      const res = await ApiFoodLog().PutUpdateFoodLog(payload);
      if (res.status === 200) {
        showNotification("success", "Food log updated successfully.");
        mutateDiary();
        mutateFoodLogs();
      } else {
        showNotification("error", `Failed to update food log: ${res.message}`);
      }
    } catch (error) {
      console.error("Error updating food log:", error);
      showNotification("error", "Failed to update food log.");
    } finally {
      setIsActionLoading(false);
      setEditModalOpen(false);
      setSelectedFoodLog(null);
    }
  };

  const handleConfirmDelete = async (foodLog) => {
    setIsActionLoading(true);
    try {
      const res = await ApiFoodLog().PutDeleteFoodLog({
        id_food_log: foodLog?.id_food_log,
      });
      if (res.status === 200) {
        showNotification("success", "Entry deleted.");
        mutateDiary();
        mutateFoodLogs(
          (currentData) =>
            currentData.filter(
              (item) => item.id_food_log !== foodLog.id_food_log,
            ),
          false,
        );
      }
    } catch (error) {
      showNotification("error", "Failed to delete.");
    } finally {
      setIsActionLoading(false);
      setDeleteModalOpen(false);
      setSelectedFoodLog(null);
    }
  };

  const groupedFoodLogs = useMemo(() => {
    return foodLogData.reduce((acc, log) => {
      const key = log.occasion.toLowerCase();
      if (!acc[key]) acc[key] = [];
      acc[key].push(log);
      return acc;
    }, {});
  }, [foodLogData]);

  const showFoodSkeleton = isFoodLogsLoading && !foodLogDataRaw;
  const showDiarySkeleton = isDiaryLoading && !diaryData;

  return (
    <div className="flex h-screen w-full bg-[#f9fafb] overflow-hidden">
      <SideBar expanded={expanded} setExpanded={setExpanded} />

      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        <div className="flex-1 overflow-y-auto p-4 md:px-10 md:py-4 custom-scrollbar">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 md:gap-4 gap-8">
            <div className="flex items-center">
              {!expanded && (
                <HamburgerButton setSidebarExpanded={setExpanded} />
              )}
              <div
                className={`flex-1 self-center ${!expanded ? "-translate-x-4" : ""}`}>
                <Heading Header={"Daily Diary"} />
              </div>
            </div>
            {/* Responsive DatePicker Container */}
            <div className="w-full md:w-auto">
              <DatePicker
                format="yyyy-MM-dd"
                size="lg" // Makes it bigger and easier to tap
                value={new Date(diaryDate)}
                onChange={(date) => {
                  if (date)
                    setDiaryDate(new Intl.DateTimeFormat("en-CA").format(date));
                }}
                cleanable={false}
                oneTap
                shouldDisableDate={(date) => date > new Date()}
                placeholder="Select Date"
                style={{ width: "100%" }} // Allows parent div to control width (Full on mobile, auto on desktop)
                className="custom-datepicker shadow-sm rounded-xl"
              />
            </div>
          </div>

          {showDiarySkeleton ? (
            <SkeletonFoodDiaryDashboard />
          ) : (
            <div className="bg-white rounded-4xl border border-gray-100 shadow-sm p-6 mb-10 transition-all duration-500 hover:shadow-md">
              <div className="flex flex-col lg:flex-row items-center gap-10">
                <div className="relative flex items-center justify-center">
                  <div className="w-56 h-56 lg:w-64 lg:h-64 rounded-full border-10 border-gray-50 flex flex-col items-center justify-center shadow-inner">
                    <span className="text-5xl lg:text-6xl font-black text-gray-800 tracking-tighter">
                      {calorieData?.net_calories || 0}
                    </span>
                    <span className="text-[#229100] font-bold text-xs uppercase tracking-[0.2em] mt-1">
                      Cals. Consumed
                    </span>
                  </div>
                </div>

                <div className="flex-1 w-full grid grid-cols-3 gap-4 lg:gap-0">
                  <MacroDisplay
                    label="Protein"
                    value={calorieData?.total_protein}
                    color="#8B5CF6"
                  />
                  <div className="flex justify-center border-x border-gray-100">
                    <MacroDisplay
                      label="Fat"
                      value={calorieData?.total_fat}
                      color="#76b800"
                    />
                  </div>
                  <MacroDisplay
                    label="Carbs"
                    value={calorieData?.total_carbohydrate}
                    color="#F97316"
                  />
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 pb-10">
            {["Breakfast", "Lunch", "Dinner", "Snack"].map((meal) =>
              showFoodSkeleton ? (
                <div
                  key={meal}
                  className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                  <div className="h-6 w-24 bg-gray-100 rounded mb-4 animate-pulse"></div>
                  <SkeletonFoodCard />
                </div>
              ) : (
                <FoodLogCards
                  key={meal}
                  groupedFoodLogs={groupedFoodLogs}
                  calorieData={calorieData}
                  emoji={
                    meal === "Breakfast" ? "🍳" : meal === "Snack" ? "🍎" : "🍲"
                  }
                  occasion={meal}
                  onEditClick={handleEditClick}
                  onDeleteClick={(log) => {
                    setSelectedFoodLog(log);
                    setDeleteModalOpen(true);
                  }}
                />
              ),
            )}
          </div>
          <Footer />
        </div>
      </main>

      <FoodLogModal
        openModal={editModalOpen}
        setOpenModal={setEditModalOpen}
        modalType="Edit"
        foodData={selectedFoodLog}
        handleConfirmAction={handleUpdateFoodLog}
        selectedOccasion={selectedOccasion}
        setSelectedOccasion={setSelectedOccasion}
        isLoading={isActionLoading}
      />

      <Modal
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        size="xs">
        <Modal.Body className="p-6 text-center">
          <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
            !
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">
            Confirm Delete
          </h3>
          <p className="text-gray-500">
            Do you want to delete{" "}
            <span className="font-bold">{selectedFoodLog?.food_name}</span>?
          </p>
          <div className="flex justify-center gap-3 mt-5">
            <Button
              onClick={() => setDeleteModalOpen(false)}
              appearance="subtle">
              Cancel
            </Button>
            <Button
              loading={isActionLoading}
              onClick={() => handleConfirmDelete(selectedFoodLog)}
              className="bg-red-500! text-white! px-6">
              Delete
            </Button>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}
