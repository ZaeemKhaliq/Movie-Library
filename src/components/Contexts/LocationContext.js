import { createContext, useEffect, useState } from "react";
import { useLocation } from "react-router";

export const LocContext = createContext();

export default function LocationContext(props) {
  let location = useLocation();

  const [locations, setLocations] = useState({
    from: location.pathname,
    to: "/",
  });
  // console.log(locations);

  useEffect(() => {
    setLocations((prev) => ({
      from: prev.to,
      to: location.pathname,
    }));
  }, [location]);

  return (
    <LocContext.Provider value={{ locations: locations }}>
      {props.children}
    </LocContext.Provider>
  );
}
