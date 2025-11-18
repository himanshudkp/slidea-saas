import { Project } from "@/generated/prisma/client";
import React from "react";
import { motion } from "framer-motion";
import { containerVariants } from "@/lib/constants";
import ProjectCard from "./project-card";

type Props = {
  projects: Project[];
};

const Projects = ({ projects }: Props) => {
  return (
    <motion.div
      className="grid grid-cols-1 lg:grid-cols-4 gap-4"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <ProjectCard />
    </motion.div>
  );
};

export default Projects;
