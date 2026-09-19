"use client";

import { motion, useInView } from "framer-motion";
import React, { useEffect, useRef, useState } from "react";

const timelineData = [
  {
    date: "September 30 / Tuesday",
    items: [
      "Complete project proposal for new client presentation",
      "Review and approve marketing campaign materials",
      "Team meeting with development department at 2 PM",
      "Update quarterly financial reports",
      "Call with stakeholders regarding product roadmap",
    ],
  },
  {
    date: "October 1 / Wednesday",
    items: [
      "Conduct user testing sessions for mobile app",
      "Finalize budget allocation for Q4 initiatives",
      "Review code changes in development branch",
      "Prepare presentation slides for board meeting",
      "Schedule one-on-one meetings with team members",
    ],
  },
  {
    date: "October 2 / Thursday",
    items: [
      "Launch new feature rollout to production environment",
      "Analyze customer feedback from recent survey",
      "Update documentation for API endpoints",
      "Coordinate with design team on wireframe revisions",
      "Review security audit findings and action items",
    ],
  },
  {
    date: "October 3 / Friday",
    items: [
      "Deploy hotfix for critical bug in payment system",
      "Attend cross-functional planning session",
      "Review and merge pending pull requests",
      "Prepare weekly progress report for management",
      "Organize team retrospective meeting",
    ],
  },
  {
    date: "October 4 / Saturday",
    items: [
      "Research new technologies for upcoming projects",
      "Update personal development goals and milestones",
      "Review industry trends and competitor analysis",
      "Organize project files and documentation",
    ],
  },
  {
    date: "October 5 / Sunday",
    items: [
      "Plan upcoming week priorities and deadlines",
      "Review project timelines and resource allocation",
      "Prepare for Monday morning team standup",
      "Update task management system with new assignments",
    ],
  },
];

const Skiper74 = () => {
  const [currentDate, setCurrentDate] = useState("");

  return (
    <div className="fc w-full">
      <div className="mb-[66vh] w-full max-w-4xl px-10">
        <header className="bg-muted text-foreground/50 border-foreground/20 sticky top-0 z-10 border-b pb-4 pt-14 text-2xl tracking-tight">
          <motion.span
            initial={{ x: -5, opacity: 0 }}
            key={`${currentDate}`}
            animate={{ x: 0, opacity: 1 }}
            className="text-foreground mr-2 inline-block font-medium"
          >
            {currentDate.split(" ")[0]} {currentDate.split(" ")[1]}
          </motion.span>
          {currentDate.split(" ").slice(2).join(" ")}
        </header>

        <div className="-mt-34">
          {/* each timeline  */}
          {timelineData.map((item) => (
            <Template
              key={item.date}
              setCurrentDate={setCurrentDate}
              data={item}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export { Skiper74 };

const Template = ({
  data,
  setCurrentDate,
}: {
  data: { date: string; items: string[] };
  setCurrentDate: any;
}) => {
  const tempalteRef = useRef(null);

  const itemInView = useInView(tempalteRef, {
    amount: 0,
    margin: "-70px 0px -100% 0px",
  });

  useEffect(() => {
    if (itemInView) {
      setCurrentDate(data.date);
    }
  }, [itemInView, data.date, setCurrentDate]);

  return (
    <div ref={tempalteRef} className="my-22">
      <header className="text-foreground/50 border-foreground/20 mb-4 border-b py-2 text-xl font-medium tracking-tight">
        <span className="text-foreground mr-1">{data.date.split(" ")[1]}</span>/{" "}
        {data.date.split(" ")[3]}
      </header>

      <ul>
        {data.items.map((item, index) => (
          <li key={index} className="my-4 flex items-center gap-4">
            <span className="bg-foreground/10 size-5 rounded-full" />
            <div>{item}</div>
          </li>
        ))}
      </ul>
    </div>
  );
};
