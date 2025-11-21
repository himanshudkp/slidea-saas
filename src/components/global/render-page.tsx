"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { usePromptStore } from "@/store/use-prompt-store";
import CreatePage from "./create-page";
import CreateFromScratch from "./create-from-scratch";
import CreateWithAI from "./create-with-ai";

type Props = {};

const RenderPage = (props: Props) => {
  const router = useRouter();
  const { page } = usePromptStore();

  const renderStep = () => {
    switch (page) {
      case "create":
        return <CreatePage />;
      case "create-from-scratch":
        return <CreateFromScratch />;
      case "creative-ai":
        return <CreateWithAI />;
      default:
        return null;
    }
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={page}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.3 }}
      >
        {renderStep()}
      </motion.div>
    </AnimatePresence>
  );
};

export default RenderPage;
