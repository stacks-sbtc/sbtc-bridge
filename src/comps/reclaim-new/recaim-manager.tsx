import { useState } from "react";
import { SECTION } from "../HomeApp";
import ReclaimNav from "./reclaim-nav";
import LandingAnimation from "../core/LandingAnimation";
import Faqs from "../Faqs";

const ReclaimManager = () => {
  const [selectedSection, _setSelectedSection] = useState<SECTION>(
    SECTION.RECLAIM,
  );

  const setSelectedSection = (section: SECTION) => {};

  return (
    <>
      <ReclaimNav
        section={selectedSection}
        onClickSection={(section) => setSelectedSection(section)}
      />
      <LandingAnimation>
        <div className="w-screen flex "></div>
      </LandingAnimation>
      <div className="m-8" />
      <Faqs />
    </>
  );
};
