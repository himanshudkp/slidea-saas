import { Home, LayoutTemplate, Settings2, Trash2 } from "lucide-react";

export const DATA = {
  user: {
    name: "Himanshu",
    email: "himanshudkp@gmail.com",
    avatar: "/globe.png",
  },
  navigation: [
    {
      title: "Home",
      url: "/dashboard",
      icon: Home,
    },
    {
      title: "Templates",
      url: "/templates",
      icon: LayoutTemplate,
    },
    {
      title: "Trash",
      url: "/trash",
      icon: Trash2,
    },
    {
      title: "Settings",
      url: "/settings",
      icon: Settings2,
    },
  ],
};

export const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};
