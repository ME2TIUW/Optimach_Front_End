import React, { useEffect, useState, useMemo } from "react";
import {
  Panel,
  Divider,
  Grid,
  Row,
  Col,
  SelectPicker,
  Button,
  Modal,
  InputGroup,
  Input,
} from "rsuite";

export default function FoodLogModal({
  openModal,
  setOpenModal,
  size = "md",
  modalType = "Add", // "Add", "Edit", or "Manual"
  foodData,
  scaledServing,
  handleConfirmAction,
  selectedOccasion,
  setSelectedOccasion,
  isLoading,
  quantity,
}) {
  // --- STATE FOR MANUAL INPUTS ---
  const [manualName, setManualName] = useState("");
  const [manualWeight, setManualWeight] = useState("");
  const [manualCalories, setManualCalories] = useState("");
  const [manualProtein, setManualProtein] = useState("");
  const [manualCarbs, setManualCarbs] = useState("");
  const [manualFat, setManualFat] = useState("");
  const [error, setError] = useState(null);

  // State for ratio
  const [editWeight, setEditWeight] = useState("");

  const isManual = modalType === "Manual";
  const isEdit = modalType === "Edit";

  const occasionsData = [
    { label: "Breakfast", value: "Breakfast" },
    { label: "Lunch", value: "Lunch" },
    { label: "Dinner", value: "Dinner" },
    { label: "Snack", value: "Snack" },
  ];

  // RESET / PRE-FILL LOGIC
  useEffect(() => {
    if (!openModal) {
      setManualName("");
      setManualWeight("");
      setManualCalories("");
      setManualProtein("");
      setManualCarbs("");
      setManualFat("");
      setEditWeight("");
      return;
    }

    if (isEdit && foodData) {
      setEditWeight(foodData.weight_grams);
      const matchedOccasion = occasionsData.find(
        (o) => o.value.toLowerCase() === foodData.occasion.toLowerCase()
      );
      if (matchedOccasion) setSelectedOccasion(matchedOccasion.value);
    }
  }, [openModal, modalType, foodData]);

  // DISPLAY DATA CALC.
  const displayData = useMemo(() => {
    //return raw input values
    if (isManual) return {};

    // EDIT MODE: Calculate Ratio
    if (isEdit && foodData) {
      const originalWeight = parseFloat(foodData.weight_grams) || 1;
      const newWeight = parseFloat(editWeight) || 0;
      const ratio = newWeight / originalWeight;

      return {
        calories: Math.round(foodData.calories * ratio),
        protein: (foodData.protein_grams * ratio).toFixed(1),
        carbohydrate: (foodData.carbohydrate_grams * ratio).toFixed(1),
        fat: (foodData.fat_grams * ratio).toFixed(1),
        serving: `${newWeight} g`,
      };
    }

    // ADD MODE : Use scaledServing
    return {
      calories: scaledServing?.calories,
      protein: scaledServing?.protein,
      carbohydrate: scaledServing?.carbohydrate,
      fat: scaledServing?.fat,
      serving: scaledServing?.serving_description,
    };
  }, [modalType, scaledServing, foodData, editWeight, isManual, isEdit]);

  const isManualFormIncomplete = useMemo(() => {
    if (!isManual) return false;

    // Check if any field is null, undefined, or an empty string after trimming whitespace
    return (
      !manualName?.trim() ||
      manualWeight === "" ||
      manualCalories === "" ||
      manualProtein === "" ||
      manualCarbs === "" ||
      manualFat === ""
    );
  }, [
    isManual,
    manualName,
    manualWeight,
    manualCalories,
    manualProtein,
    manualCarbs,
    manualFat,
  ]);

  const onConfirm = () => {
    if (isManual && isManualFormIncomplete) {
      setError("Please fill in all manual fields.");
      return;
    }
    let payload = {};

    if (isManual) {
      const requiredFields = [
        manualName,
        manualWeight,
        manualCalories,
        manualProtein,
        manualCarbs,
        manualFat,
      ];
      const errors = {};

      for (const field of requiredFields) {
        if (!field) {
          errors[field] = `Field ${field} is required.`;
          setError(errors);
        }
      }
      setError(errors);

      if (Object.keys(errors).length > 0) {
        return;
      }

      payload = {
        food_name: manualName,
        weight_grams: parseFloat(manualWeight),
        calories: parseInt(manualCalories),
        protein_grams: parseFloat(manualProtein),
        carbohydrate_grams: parseFloat(manualCarbs),
        fat_grams: parseFloat(manualFat),
        occasion: selectedOccasion,
      };
    } else if (isEdit) {
      payload = {
        ...foodData,
        occasion: selectedOccasion,
        weight_grams: parseFloat(editWeight),
        calories: displayData.calories,
        protein_grams: parseFloat(displayData.protein),
        carbohydrate_grams: parseFloat(displayData.carbohydrate),
        fat_grams: parseFloat(displayData.fat),
      };
    }

    handleConfirmAction(payload);
  };

  return (
    <Modal
      open={openModal}
      onClose={() => setOpenModal(false)}
      size={size}
      backdrop="static">
      <Modal.Header>
        <h3 style={{ color: "#229100" }}>{modalType} Food Log</h3>
      </Modal.Header>
      <Modal.Body>
        <Grid fluid>
          {/* FOOD NAME */}
          <Row className="show-grid" style={{ marginBottom: "15px" }}>
            <Col xs={24}>
              {isManual ? (
                <div>
                  <label className="font-bold mb-1 block text-gray-600">
                    Food Name
                  </label>
                  <Input
                    placeholder="e.g. Homemade Sandwich"
                    value={manualName}
                    onChange={setManualName}
                  />
                </div>
              ) : (
                <Panel bordered style={{ backgroundColor: "#f9f9f9" }}>
                  <div className="text-center">
                    <strong style={{ display: "block", fontSize: "1.1rem" }}>
                      Food
                    </strong>
                    <span style={{ fontSize: "1rem", color: "#555" }}>
                      {foodData?.food_name}
                    </span>
                  </div>
                </Panel>
              )}
            </Col>
          </Row>

          {/* WEIGHT / SERVING */}
          <Row className="show-grid" style={{ marginBottom: "15px" }}>
            <Col xs={24}>
              {isManual ? (
                <div>
                  <label className="font-bold mb-1 block text-gray-600">
                    Weight
                  </label>
                  <InputGroup>
                    <Input
                      type="number"
                      value={manualWeight}
                      onChange={setManualWeight}
                      placeholder="0"
                    />
                    <InputGroup.Addon>g</InputGroup.Addon>
                  </InputGroup>
                </div>
              ) : isEdit ? (
                <div>
                  <label className="font-bold mb-1 block text-gray-600">
                    Edit Weight
                  </label>
                  <InputGroup>
                    <Input
                      type="number"
                      value={editWeight}
                      onChange={setEditWeight}
                    />
                    <InputGroup.Addon>g</InputGroup.Addon>
                  </InputGroup>
                </div>
              ) : (
                <Panel bordered style={{ backgroundColor: "#f9f9f9" }}>
                  <div className="text-center">
                    <strong>Serving Size</strong>
                    <div style={{ color: "#555" }}>{displayData.serving}</div>
                  </div>
                </Panel>
              )}
            </Col>
          </Row>

          {/* CALORIES */}
          <Row className="show-grid" style={{ marginBottom: "15px" }}>
            <Col xs={24}>
              {isManual ? (
                <div>
                  <label className="font-bold mb-1 block text-gray-600">
                    Total Calories
                  </label>
                  <InputGroup>
                    <Input
                      type="number"
                      value={manualCalories}
                      onChange={setManualCalories}
                      placeholder="0"
                    />
                    <InputGroup.Addon>kcal</InputGroup.Addon>
                  </InputGroup>
                </div>
              ) : (
                <Panel
                  bordered
                  style={{
                    borderColor: "#229100",
                    backgroundColor: "#f0f9eb",
                  }}>
                  <div className="flex justify-between items-center px-4">
                    <strong style={{ fontSize: "1.2rem", color: "#229100" }}>
                      Total Calories
                    </strong>
                    <span
                      style={{
                        fontSize: "1.5rem",
                        fontWeight: "bold",
                        color: "#229100",
                      }}>
                      {displayData.calories}
                    </span>
                  </div>
                </Panel>
              )}
            </Col>
          </Row>

          {/* OCCASION */}
          <Row style={{ marginBottom: "15px" }}>
            <Col xs={24}>
              <label className="font-bold mb-1 block text-gray-600">
                Occasion
              </label>
              <SelectPicker
                data={occasionsData}
                searchable={false}
                placeholder="Breakfast, Lunch..."
                style={{ width: "100%", marginBottom: "15px" }}
                value={selectedOccasion}
                onChange={(value) => setSelectedOccasion(value)}
                size="md"
                cleanable={false}
              />
            </Col>
          </Row>

          {/* MACROS */}
          <div style={{ borderTop: "1px solid #eee", paddingTop: "15px" }}>
            <p className="font-bold mb-2 text-gray-500 text-center">
              Macronutrients (g)
            </p>
            <Row gutter={10}>
              <Col xs={8}>
                {isManual ? (
                  <div className="text-center">
                    <label className="text-xs block mb-1">Protein</label>
                    <Input
                      type="number"
                      size="sm"
                      value={manualProtein}
                      onChange={setManualProtein}
                    />
                  </div>
                ) : (
                  <div className="text-center p-2 bg-gray-50 rounded">
                    <div className="text-xs font-bold text-gray-500">
                      Protein
                    </div>
                    <div className="text-lg">
                      {Math.round(displayData.protein || 0)}g
                    </div>
                  </div>
                )}
              </Col>
              <Col xs={8}>
                {isManual ? (
                  <div className="text-center">
                    <label className="text-xs block mb-1">Carbs</label>
                    <Input
                      type="number"
                      size="sm"
                      value={manualCarbs}
                      onChange={setManualCarbs}
                    />
                  </div>
                ) : (
                  <div className="text-center p-2 bg-gray-50 rounded">
                    <div className="text-xs font-bold text-gray-500">Carbs</div>
                    <div className="text-lg">
                      {Math.round(displayData.carbohydrate || 0)}g
                    </div>
                  </div>
                )}
              </Col>
              <Col xs={8}>
                {isManual ? (
                  <div className="text-center">
                    <label className="text-xs block mb-1">Fat</label>
                    <Input
                      type="number"
                      size="sm"
                      value={manualFat}
                      onChange={setManualFat}
                    />
                  </div>
                ) : (
                  <div className="text-center p-2 bg-gray-50 rounded">
                    <div className="text-xs font-bold text-gray-500">Fat</div>
                    <div className="text-lg">
                      {Math.round(displayData.fat || 0)}g
                    </div>
                  </div>
                )}
              </Col>
            </Row>
          </div>
        </Grid>
      </Modal.Body>
      <Modal.Footer>
        <Button
          onClick={() => setOpenModal(false)}
          appearance="subtle"
          disabled={isLoading}>
          Cancel
        </Button>
        <Button
          onClick={onConfirm}
          appearance="primary"
          style={{ backgroundColor: "#229100" }}
          disabled={
            // isLoading ||
            // !selectedOccasion ||
            // (isManual &&
            //   (!manualName ||
            //     !manualWeight ||
            //     !manualCalories ||
            //     !manualProtein ||
            //     !manualCarbs ||
            //     !manualFat) &&
            //   parseFloat(quantity))
            isLoading ||
            !selectedOccasion || // Must have an occasion (Breakfast, etc.)
            (isManual && isManualFormIncomplete) || // If manual, check all fields
            (isEdit && !editWeight) // If edit, must have a weight
          }>
          {isEdit ? "Save Changes" : "Add Entry"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
