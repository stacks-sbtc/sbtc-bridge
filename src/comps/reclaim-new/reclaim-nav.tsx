import { classNames } from "@/util";
import { SECTION } from "../HomeApp";
import { SectionActionProps, SectionSelection } from "../HomeSelectedHeader";
import { NavTile } from "../core/app-nav";

const ReclaimNav = ({ section, onClickSection }: SectionSelection) => {
  const handleClickSection = (section: SECTION) => {};
  return (
    <div
      style={{
        borderTop: "1px solid rgba(255, 255, 255, 0.2)",
        borderBottom: "1px solid rgba(255, 255, 255, 0.2)",
      }}
      className="w-full bg-[#272628] h-20 flex items-center justify-center
      "
    >
      <NavTile
        section={SECTION.RECLAIM}
        activeSection={section}
        text="RECLAIM"
        onClickSection={handleClickSection}
      />
    </div>
  );
};

export default ReclaimNav;
