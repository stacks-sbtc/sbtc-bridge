import { useState, useMemo } from "react";
import { useNotifications } from "./use-notifications";
import { NotificationStatusType } from "@/comps/Notifications";

export function useShortAddress(address: string) {
  const [isHovered, setIsHovered] = useState(false);
  const { notify } = useNotifications();

  const onMouseEnter = () => setIsHovered(true);
  const onMouseLeave = () => setIsHovered(false);
  const copyOnClick = () => {
    navigator.clipboard.writeText(address);
    notify({
      message: "Address copied to clipboard",
      type: NotificationStatusType.SUCCESS,
    });
  };

  const shortenedAddress = useMemo(() => {
    if (address.length > 20) {
      return `${address.slice(0, 10)}...${address.slice(-10)}`;
    }
    return address;
  }, [address]);
  return (
    <span
      className="cursor-copy break-all"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={copyOnClick}
    >
      {isHovered ? address : shortenedAddress}
    </span>
  );
}
