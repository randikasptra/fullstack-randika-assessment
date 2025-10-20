import React from "react";
import PropTypes from "prop-types";
import { Clock, CreditCard, Package2, Truck, CheckCircle } from "lucide-react";

const ProgressSteps = ({ status }) => {
  const steps = [
    { key: "pending", label: "Belum Bayar", icon: Clock },
    { key: "processing", label: "Menunggu Pembayaran", icon: CreditCard },
    { key: "paid", label: "Diproses", icon: Package2 },
    { key: "shipped", label: "Dikirim", icon: Truck },
    { key: "completed", label: "Selesai", icon: CheckCircle },
  ];

  const currentIndex = steps.findIndex((step) => step.key === status);

  return (
    <div
      className="flex items-center justify-between"
      role="progressbar"
      aria-valuenow={currentIndex + 1}
      aria-valuemin="0"
      aria-valuemax={steps.length}
    >
      {steps.map((step, index) => {
        const Icon = step.icon;
        const isActive = index <= currentIndex;
        const isCompleted = index < currentIndex;

        return (
          <div key={step.key} className="flex flex-col items-center flex-1">
            <div
              className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                isActive
                  ? isCompleted
                    ? "bg-green-500 border-green-500 text-white"
                    : "bg-blue-500 border-blue-500 text-white"
                  : "bg-gray-100 border-gray-300 text-gray-400"
              }`}
              aria-label={`${step.label} ${
                isCompleted ? "completed" : isActive ? "active" : "pending"
              }`}
            >
              <Icon className="w-5 h-5" />
            </div>
            <span
              className={`text-xs mt-2 text-center ${
                isActive ? "text-blue-600 font-medium" : "text-gray-500"
              }`}
            >
              {step.label}
            </span>
          </div>
        );
      })}
    </div>
  );
};

ProgressSteps.propTypes = {
  status: PropTypes.oneOf(["pending", "processing", "paid", "shipped", "completed"]),
};

export default ProgressSteps;
